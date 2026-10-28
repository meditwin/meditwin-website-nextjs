const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const babel = require("next/dist/compiled/babel/core");

const source = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8").replace(/^import.*;\r?$/gm, "");
const tick = () => new Promise(setImmediate);
const savedPatient = { id: "patient1", patient_name: "Saved Patient", age: 0, phone: "1234567890" };

function api(response = { status: "success", data: [savedPatient] }) {
    const calls = [];
    const context = vm.createContext({
        MEDICAL_API_URL: "https://backend.invalid",
        axios: { get: async (...args) => { calls.push(args); return { data: response }; } }
    });
    vm.runInContext(source("components/BookingCheckout/booking.js").replace(/^export /gm, "") + "\nthis.fetch = fetchPatients;", context);
    return { fetchPatients: context.fetch, calls };
}

test("fetches the user's patients from the provided endpoint with authentication and cancellation", async () => {
    const { fetchPatients, calls } = api();
    const signal = new AbortController().signal;
    const patients = await fetchPatients({ userId: "user1", token: "token", signal });
    assert.deepEqual(JSON.parse(JSON.stringify(patients)), [savedPatient]);
    assert.equal(calls[0][0], "https://backend.invalid/users/user1/patients");
    assert.equal(calls[0][1].headers.Authorization, "Bearer token");
    assert.equal(calls[0][1].signal, signal);
});

test("handles empty lists and rejects missing sessions and backend errors", async () => {
    const empty = api({ status: "success", data: [] });
    assert.equal((await empty.fetchPatients({ userId: "user1", token: "token" })).length, 0);
    await assert.rejects(empty.fetchPatients({ token: "token" }), /log in/);
    assert.equal(empty.calls.length, 1);
    const failed = api({ status: "error", message: "User not found", data: [] });
    await assert.rejects(failed.fetchPatients({ userId: "user1", token: "token" }), /User not found/);
    const malformed = api({ status: "success", data: {} });
    await assert.rejects(malformed.fetchPatients({ userId: "user1", token: "token" }), /load saved patients/);
});

function checkout(fetchPatients = api().fetchPatients) {
    const states = [], effects = [], calls = [];
    let index = 0;
    const context = vm.createContext({
        React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) },
        Image: "image", styles: {}, AbortController,
        useState: initial => { const i = index++; if (!(i in states)) states[i] = initial === "summary" ? "patient" : initial; return [states[i], value => { states[i] = value; }]; },
        useRef: initial => ({ current: initial }), useEffect: effect => effects.push(effect),
        useAuth: () => ({ user: { _id: "user1" }, token: "token" }),
        consultationAmount: () => 100, paymentTotals: () => ({ finalPaise: 10000 }),
        appointmentPayload: () => ({ user_id: "user1" }), fetchPatients,
        savePatient: async args => { calls.push(["save", args]); return { id: "new1", ...args.patient }; },
        createAppointment: async payload => { calls.push(["book", payload]); return { _id: "booking1", appointment_id: "A1", ...payload }; },
        sessionStorage: { removeItem() {} }, URL: { revokeObjectURL() {} },
        currency: String, displayTime: String, clinicAddress: () => ""
    });
    const code = babel.transformSync(source("components/BookingCheckout/BookingCheckout.jsx").replace("export default function", "function"), {
        babelrc: false, configFile: false, presets: [require("next/dist/compiled/babel/preset-react")]
    }).code;
    vm.runInContext(code + "\nthis.Checkout = BookingCheckout;", context);
    function render() {
        index = 0;
        return context.Checkout({ open: true, clinic: {}, department: {}, doctor: {}, slot: { availabilityId: "slot1", date: "2026-10-24", startTime: "10:00" } });
    }
    function find(tree, predicate) {
        return tree && typeof tree === "object" ? (predicate(tree) ? tree : tree.children?.map(child => find(child, predicate)).find(Boolean)) : undefined;
    }
    render();
    const cleanup = effects[0]();
    return {
        calls, cleanup, render,
        field: name => find(render(), node => node.props.name === name),
        select: value => find(render(), node => node.type === "select" && !node.props.name).props.onChange({ target: { value } }),
        submit: async () => { find(render(), node => node.type === "form").props.onSubmit({ preventDefault() {} }); await tick(); },
        find
    };
}

test("checkout loads patients, autofills all available fields and books the existing ID without creating a duplicate", async () => {
    const backend = api();
    const form = checkout(backend.fetchPatients);
    await tick();
    assert.equal(backend.calls[0][0], "https://backend.invalid/users/user1/patients");
    form.select("patient1");
    assert.equal(form.field("patient_name").props.value, savedPatient.patient_name);
    assert.equal(form.field("phone").props.value, savedPatient.phone);
    assert.equal(form.field("age").props.value, 0);
    await form.submit();
    assert.deepEqual(form.calls.map(call => call[0]), ["book"]);
    assert.equal(form.calls[0][1].patient_id, "patient1");
});

test("switching to new patient clears autofill and preserves patient creation; skipping fields still books for self", async () => {
    const form = checkout();
    await tick();
    form.select("patient1");
    form.select("");
    assert.equal(form.field("patient_name").props.value, "");
    form.field("patient_name").props.onChange({ target: { value: "New Patient" } });
    await form.submit();
    assert.deepEqual(form.calls.map(call => call[0]), ["save", "book"]);
    assert.equal(form.calls[1][1].patient_id, "new1");
    const self = checkout();
    await tick();
    await self.submit();
    assert.deepEqual(self.calls.map(call => call[0]), ["book"]);
    assert.equal(self.calls[0][1].patient_id, undefined);
});

test("a failed patient request leaves new-patient booking available", async () => {
    const form = checkout(async () => { throw new Error("Offline"); });
    await tick();
    assert.match(form.find(form.render(), node => node.props.role === "alert").children.join(""), /Unable to load saved patients/);
    form.field("patient_name").props.onChange({ target: { value: "New Patient" } });
    await form.submit();
    assert.deepEqual(form.calls.map(call => call[0]), ["save", "book"]);
});
