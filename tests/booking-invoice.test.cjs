const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ Intl, currency: (amount) => `INR ${amount}`, displayTime: (time) => time, MEDICAL_API_URL: "https://backend.invalid" });
for (const file of ["history.js", "invoice.js"]) {
    const source = fs.readFileSync(path.join(__dirname, "../components/BookingHistory", file), "utf8").replace(/^import .*;\r?$/gm, "").replace(/^export /gm, "");
    vm.runInContext(source, context);
}
const booking = {
    _id: "booking1", appointment_id: "MED-AP-000001", status: 4, payment_status: 1,
    created_date: "2026-10-01", appointment_date: "2026-10-02", start_time: "10:30", end_time: "10:45",
    consultation_fee: 600, coupon_code: "SAVE10", discount: 10, amount: 540,
    patient_details: { patient_name: "Example Patient", email: "patient@example.invalid", phone: "1234567890" },
    doctor: { name: "Example Doctor", doctor_details: { specialization: "Eye Specialist", qualification: "MBBS" } },
    medical: { name: "Example Clinic" }
};
const documentText = (record) => JSON.stringify(context.buildInvoiceDocument(record));

test("invoice accepts website and mobile payment IDs, preferring the website ID", () => {
    for (const payment_details of [{ razorpay_payment_id: "pay_web" }, { payment_id: "pay_mobile" }, { razorpay_payment_id: "  ", payment_id: " pay_mobile " }]) {
        assert.match(documentText({ ...booking, payment_details }), /pay_web|pay_mobile/);
        assert.match(documentText({ ...booking, payment_details }), /Online/);
    }
    assert.equal(context.invoicePaymentId({ payment_details: { razorpay_payment_id: " pay_web ", payment_id: "pay_mobile" } }), "pay_web");
    assert.equal(context.invoicePaymentId({}), "");
});

test("invoice preserves patient, consultation, coupon and saved total amount", () => {
    const text = documentText(booking);
    for (const value of ["MED-AP-000001", "Example Patient", "Example Doctor", "Example Clinic", "Eye Specialist", "MBBS", "SAVE10", "10% OFF", "INR 600", "-INR 60", "INR 540", "Total Amount Paid"]) assert.ok(text.includes(value), value);
    assert.doesNotMatch(text, /Online Payment Charge/);
    assert.match(documentText({ ...booking, amount: 0 }), /INR 0/);
    assert.match(documentText({ ...booking, amount: null }), /Not available/);
});

test("invoice rejects incomplete bookings and handles offline and missing fee data", async () => {
    for (const status of [1, 2, 3]) {
        assert.throws(() => context.buildInvoiceDocument({ ...booking, status }), /completed/);
        await assert.rejects(() => context.downloadInvoice({ ...booking, status }), /completed/);
    }
    const offline = documentText({ ...booking, payment_status: 0, coupon_code: null, consultation_fee: null });
    assert.match(offline, /Pay on Visit/);
    assert.match(offline, /Offline/);
    assert.doesNotMatch(offline, /Total Amount Paid|Coupon Applied/);
    assert.match(documentText({ ...booking, consultation_fee: null }), /Not available/);
});

test("invoice renders a real PDF with the website logo and rupee amounts", async () => {
    const pdfMake = require("pdfmake/build/pdfmake");
    pdfMake.addVirtualFileSystem(require("pdfmake/build/vfs_fonts"));
    context.currency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
    const logo = "data:image/png;base64," + fs.readFileSync(path.join(__dirname, "../public/images/logo/medi-logo.png")).toString("base64");
    const pdf = await pdfMake.createPdf(context.buildInvoiceDocument({ ...booking, payment_details: { razorpay_payment_id: "pay_web" } }, logo)).getBuffer();
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(pdf.length > 10000);
});
