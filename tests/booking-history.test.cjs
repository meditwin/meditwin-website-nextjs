const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const babel = require("next/dist/compiled/babel/core");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const source = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8").replace(/^import[\s\S]*?;\r?$/gm, "").replace(/^export /gm, "");
const compile = (text) => babel.transformSync(text, { babelrc: false, configFile: false, presets: [require("next/dist/compiled/babel/preset-react")] }).code;
const plain = (value) => JSON.parse(JSON.stringify(value));
const appointment = {
    _id: "appointment1", appointment_id: "MED-AP-000001", user_id: "user1", availability_id: "availability1", status: 2,
    appointment_date: "2099-12-20", start_time: "10:30", end_time: "10:45", amount: 600,
    doctor: { _id: "doctor1", name: "Dr Example", specialization: "Eye Specialist" },
    medical: { name: "Clinic Example", location: { locality: "Saltlake", city_name: "Kolkata" } },
    patient_details: { patient_name: "Patient Example" },
};

function setup() {
    const calls = [];
    let response = { status: "success", data: [appointment], totalPages: 1 };
    const axios = Object.fromEntries(["get", "post", "put"].map((method) => [method, async (...args) => { calls.push({ method, args }); return { data: response }; }]));
    const context = vm.createContext({ axios, MEDICAL_API_URL: "https://backend.invalid", FormData, Intl });
    vm.runInContext(source("components/BookingHistory/history.js") + "\nthis.api = { HISTORY_TABS, fetchBookings, fetchBooking, cancelBooking, rescheduleBooking, canManage, bookingPresentation };", context);
    return { context, api: context.api, calls, respond: (value) => { response = value; } };
}

test("All omits the status filter; each status tab requests the user's bookings", async () => {
    const { api, calls } = setup();
    assert.deepEqual(plain(api.HISTORY_TABS.map((tab) => [tab.label, tab.status])), [["All", null], ["Upcoming", 2], ["Cancelled", 3], ["Completed", 4]]);
    for (const status of [null, 2, 3, 4]) {
        await api.fetchBookings({ userId: "user1", token: "token", status, page: 1 });
        const [url, config] = calls.at(-1).args;
        assert.equal(url, "https://backend.invalid/appointments/1");
        assert.equal(config.params.user_id, "user1");
        assert.equal(config.headers.Authorization, "Bearer token");
        if (status == null) assert.equal("status" in config.params, false);
        else assert.equal(config.params.status, status);
    }
});

test("history pagination preserves user filtering and rejects missing sessions", async () => {
    const { api, respond, calls } = setup();
    respond({ status: "success", data: [appointment, { ...appointment, _id: "other", user_id: "another-user" }], totalPages: 3 });
    const result = await api.fetchBookings({ userId: "user1", token: "token", status: 2, page: 2 });
    assert.equal(calls.at(-1).args[0], "https://backend.invalid/appointments/2");
    assert.equal(result.records.length, 1);
    assert.equal(result.hasNext, true);
    await assert.rejects(() => api.fetchBookings({ userId: "", token: "token", page: 1 }), /log in/);
    await assert.rejects(() => api.fetchBookings({ userId: "user1", token: "", page: 1 }), /log in/);
});

test("details load the selected record, preserve lookups and reject another user's record", async () => {
    const { api, respond } = setup();
    respond({ status: "success", data: { _id: appointment._id, user_id: "user1", status: 2, description: "Notes" } });
    const record = await api.fetchBooking(appointment, "user1", "token");
    assert.equal(record.doctor.name, "Dr Example");
    assert.equal(record.description, "Notes");
    respond({ status: "success", data: { _id: appointment._id, user_id: "another-user" } });
    await assert.rejects(() => api.fetchBooking(appointment, "user1", "token"), /not available/);
});

test("cancellation requires a reason and sends status 3 with the trimmed reason", async () => {
    const { api, calls, respond } = setup();
    respond({ status: "success", data: { ...appointment, status: 3 } });
    await assert.rejects(() => api.cancelBooking(appointment, "   ", "token"), /reason/);
    assert.equal(calls.length, 0);
    await api.cancelBooking(appointment, "  Change of plans  ", "token");
    assert.equal(calls[0].args[0], "https://backend.invalid/appointment/appointment1/status");
    assert.deepEqual(plain(calls[0].args[1]), { status: 3, reason: "Change of plans" });
    for (const status of [3, 4]) await assert.rejects(() => api.cancelBooking({ ...appointment, status }, "Reason", "token"), /no longer/);
});

test("reschedule updates only date and times within the original availability", async () => {
    const { api, calls, respond } = setup();
    const slot = { availabilityId: "availability1", date: "2099-12-21", startTime: "11:00:00", endTime: "11:15:00", booked: false };
    respond({ status: "success", data: appointment });
    await api.rescheduleBooking(appointment, slot, "token");
    assert.equal(calls[0].args[0], "https://backend.invalid/appointment/appointment1");
    assert.deepEqual(JSON.parse(calls[0].args[1].get("appointment_data")), { appointment_date: "2099-12-21", start_time: "11:00", end_time: "11:15" });
    await assert.rejects(() => api.rescheduleBooking(appointment, { ...slot, availabilityId: "another-record" }, "token"), /available time/);
    await assert.rejects(() => api.rescheduleBooking(appointment, { ...slot, booked: true }, "token"), /available time/);
    await assert.rejects(() => api.rescheduleBooking(appointment, { ...slot, date: appointment.appointment_date, startTime: appointment.start_time, endTime: appointment.end_time }, "token"), /different/);
    for (const status of [3, 4]) await assert.rejects(() => api.rescheduleBooking({ ...appointment, status }, slot, "token"), /no longer/);
    assert.equal(calls.length, 1);
});

test("backend action errors are surfaced without reporting success", async () => {
    const { api, respond } = setup();
    respond({ status: "error", message: "This slot was just booked" });
    await assert.rejects(() => api.rescheduleBooking(appointment, { availabilityId: "availability1", date: "2099-12-21", startTime: "11:00", endTime: "11:15" }, "token"), /just booked/);
});

test("cards show exactly the actions allowed by appointment status", () => {
    const { context } = setup();
    Object.assign(context, { React, Image: () => null, styles: {}, displayTime: (time) => time });
    vm.runInContext(compile(source("components/BookingHistory/BookingHistory.jsx").replace("default function BookingHistory", "function BookingHistory")) + "\nthis.Card = BookingCard;", context);
    const card = (data) => renderToStaticMarkup(React.createElement(context.Card, { appointment: data, onAction() {} }));
    const upcoming = card(appointment);
    for (const action of ["Reschedule", "View Details", "Cancel"]) assert.match(upcoming, new RegExp(`>${action}</button>`));
    const cancelled = card({ ...appointment, status: 3, rejection_reason: "Change of plans" });
    assert.doesNotMatch(cancelled, /<button|<a /);
    assert.match(cancelled, /Change of plans/);
    const completed = card({ ...appointment, status: 4, prescription: { name: "Eye Care", description: "Use drops twice daily.", file: "prescription.pdf" } });
    assert.doesNotMatch(completed, />Reschedule<|>View Details<|>Cancel</);
    assert.match(completed, /Download Invoice/);
    assert.doesNotMatch(completed, /<button[^>]*disabled[^>]*>.*?Download Invoice/);
    assert.doesNotMatch(completed, /Invoice download will/);
    assert.match(completed, /Use drops twice daily/);
    assert.match(completed, /https:\/\/backend.invalid\/uploads\/appointment\/prescriptions\/prescription.pdf/);
    assert.match(completed, /target="_blank"/);
    assert.match(completed, /rel="noopener noreferrer"/);
});

test("reschedule picker restricts available slots without changing the new-booking picker", async () => {
    const records = ["availability1", "another-record"].map((id, index) => ({
        _id: id, doctor_id: "doctor1", medical_id: "clinic1", department_id: "department1",
        availability_details: [{ availability_date: "2099-12-21", time_details: [{ status: 1, appointment_slots: [{ start_time: index ? "11:00" : "10:30", end_time: index ? "11:15" : "10:45", appointment_status: 0 }] }] }],
    }));
    let state, cursor, effects, tree;
    const context = vm.createContext({ Intl, Date, AbortController, React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) }, styles: {}, MEDICAL_API_URL: "https://backend.invalid", useState: (initial) => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], (value) => { state[index] = value; }]; }, useEffect: (fn) => effects.push(fn), axios: { get: async () => ({ data: { status: "success", data: records, totalPages: 1 } }) } });
    vm.runInContext(source("components/DoctorSelection/doctors.js"), context);
    vm.runInContext(source("components/DateTimeSelection/slots.js"), context);
    vm.runInContext(compile(source("components/DateTimeSelection/DateTimeSelection.jsx").replace("default function DateTimeSelection", "function DateTimeSelection")) + "\nthis.Picker = DateTimeSelection;", context);
    function findTime(time, node) { if (!node || typeof node !== "object") return false; if (node.type === "button" && node.props["aria-label"]?.startsWith(time)) return true; return node.children.some((child) => findTime(time, child)); }
    for (const availabilityId of ["availability1", undefined]) {
        state = []; cursor = 0; effects = [];
        const props = { doctorId: "doctor1", availabilityId, onSelect() {} };
        context.Picker(props);
        effects.forEach((fn) => fn());
        await new Promise((resolve) => setImmediate(resolve));
        cursor = 0; tree = context.Picker(props);
        assert.equal(findTime("10:30 AM", tree), true);
        assert.equal(findTime("11:00 AM", tree), availabilityId == null);
    }
});
