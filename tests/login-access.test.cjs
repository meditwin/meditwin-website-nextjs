const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function visitLogin(auth) {
    const effects = [], redirects = [];
    const context = vm.createContext({
        useEffect: effect => effects.push(effect),
        useRouter: () => ({ replace: route => redirects.push(route) }),
        useAuth: () => auth,
    });
    const source = fs.readFileSync(path.join(__dirname, "../app/login/LoginAccess.js"), "utf8")
        .replace(/^import.*;\r?$/gm, "")
        .replace("export default function", "function");
    vm.runInContext(source + '\nthis.rendered = LoginAccess({ children: "login form" });', context);
    effects.forEach(effect => effect());
    return { rendered: context.rendered, redirects };
}

test("returning through Book Appointment reuses the authenticated session", () => {
    assert.deepEqual(visitLogin({ authLoading: false, isAuthenticated: true, profileChecked: true, needsProfileCompletion: false }), {
        rendered: null, redirects: ["/booking"],
    });
});

test("session restoration finishes before deciding whether login is needed", () => {
    for (const isAuthenticated of [false, true]) {
        assert.deepEqual(visitLogin({ authLoading: true, isAuthenticated }), { rendered: null, redirects: [] });
    }
});

test("logged out users and new tab sessions must log in", () => {
    assert.deepEqual(visitLogin({ authLoading: false, isAuthenticated: false }), {
        rendered: "login form", redirects: [],
    });
});

test("authenticated users still complete or retry their profile before booking", () => {
    for (const profile of [
        { profileChecked: true, needsProfileCompletion: true },
        { profileChecked: false, needsProfileCompletion: false },
    ]) {
        assert.deepEqual(visitLogin({ authLoading: false, isAuthenticated: true, ...profile }), {
            rendered: null, redirects: ["/complete-profile"],
        });
    }
});
