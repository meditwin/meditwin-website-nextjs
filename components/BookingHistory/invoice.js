import { bookingDate, bookingPresentation } from "./history";
import { displayTime } from "../DateTimeSelection/slots";
import { currency } from "../BookingCheckout/booking";

const BLUE = "#00379e";
const MUTED = "#778296";
const BORDER = "#dce2eb";
const available = (value) => value !== null && value !== undefined && String(value).trim() !== "" && Number.isFinite(Number(value));

export function invoicePaymentId(booking) {
    const payment = booking.payment_details || {};
    return String(payment.razorpay_payment_id || "").trim() || String(payment.payment_id || "").trim();
}

// Use the same sections, fee calculation and branding as the admin booking invoice.
export function buildInvoiceDocument(booking, logo) {
    if (Number(booking.status) !== 4) throw new Error("Invoices are available only for completed bookings.");
    const info = bookingPresentation(booking);
    const patient = booking.patient_details || {};
    const doctor = booking.doctor || {};
    const paymentId = invoicePaymentId(booking);
    const paid = Number(booking.payment_status) === 1;
    const paymentStatus = paid ? "Paid" : "Pay on Visit";
    const hasCoupon = Boolean(booking.coupon_code);
    const fee = available(booking.consultation_fee) ? Number(booking.consultation_fee) : !hasCoupon && available(booking.amount) ? Number(booking.amount) : null;
    const discountPercent = available(booking.discount) ? Number(booking.discount) : null;
    const labelValue = (label, value) => ({
        stack: [
            { text: label.toUpperCase(), fontSize: 7, bold: true, color: MUTED, margin: [0, 0, 0, 5] },
            { text: String(value || "—"), bold: true, fontSize: 9 }
        ]
    });
    const panel = (cells, margin) => ({
        margin,
        table: { widths: cells.map(() => "*"), body: [cells] },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            fillColor: () => "#f4f7fb",
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 12,
            paddingBottom: () => 12
        }
    });
    const rows = [
        [
            { text: "DESCRIPTION", fillColor: BLUE, color: "#ffffff", bold: true },
            { text: "AMOUNT", alignment: "right", fillColor: BLUE, color: "#ffffff", bold: true }
        ],
        ["Doctor Consultation Fee", { text: fee === null ? "Not available" : currency(fee), alignment: "right" }]
    ];
    if (hasCoupon) {
        rows.push(
            [
                { text: `Coupon Applied: ${booking.coupon_code}`, color: "#15803d", fillColor: "#f0fdf4" },
                { text: discountPercent === null ? "Not available" : `${discountPercent}% OFF`, color: "#15803d", fillColor: "#f0fdf4", alignment: "right" }
            ],
            [
                { text: "Discount Amount", color: "#15803d" },
                { text: fee === null || discountPercent === null ? "Not available" : `-${currency((fee * discountPercent) / 100)}`, color: "#15803d", alignment: "right" }
            ]
        );
    }
    rows.push([
        { text: paid ? "Total Amount Paid" : "Total Amount", bold: true, fontSize: 12, color: BLUE, fillColor: "#edf4ff" },
        { text: available(booking.amount) ? currency(Number(booking.amount)) : "Not available", alignment: "right", bold: true, fontSize: 12, color: BLUE, fillColor: "#edf4ff" }
    ]);
    return {
        pageSize: "A4",
        pageMargins: [43, 40, 43, 65],
        info: { title: `MediTwin Invoice ${booking.appointment_id || booking._id}`, author: "MediTwin" },
        defaultStyle: { font: "Roboto", fontSize: 9, color: "#182235", lineHeight: 1.15 },
        content: [
            {
                columns: [
                    ...(logo ? [{ image: logo, width: 44, margin: [0, 5, 10, 0] }] : []),
                    {
                        width: "*",
                        stack: [
                            { text: "Payment Invoice", fontSize: 21, bold: true, margin: [0, 0, 0, 7] },
                            { text: info.clinic, fontSize: 8, color: MUTED, margin: [0, 0, 0, 4] },
                            { text: info.address, fontSize: 8, color: MUTED }
                        ]
                    },
                    {
                        width: 155,
                        alignment: "right",
                        stack: [
                            labelValue("Invoice / Booking ID", booking.appointment_id || booking._id),
                            { ...labelValue("Booking Date", booking.created_date || booking.created_at), margin: [0, 10, 0, 0] }
                        ]
                    }
                ],
                columnGap: 10
            },
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 509, y2: 0, lineWidth: 2, lineColor: BLUE }], margin: [0, 18, 0, 18] },
            {
                columns: [
                    {
                        stack: [
                            labelValue("Billed To", patient.patient_name || patient.name || "Patient"),
                            { text: patient.email || "—", margin: [0, 5, 0, 5] },
                            { text: patient.phone || patient.mobile || "—" }
                        ]
                    },
                    {
                        stack: [
                            labelValue("Consultation With", info.doctorName),
                            { text: info.specialty || doctor.specialization || "—", margin: [0, 5, 0, 5] },
                            { text: info.qualification || doctor.qualification || "—" }
                        ]
                    }
                ],
                columnGap: 35,
                margin: [0, 0, 0, 20]
            },
            panel(
                [
                    labelValue("Appointment Date", bookingDate(booking.appointment_date)),
                    labelValue("Time", [booking.start_time, booking.end_time].map((time) => (time ? displayTime(time) : "—")).join(" - ")),
                    labelValue("Consultation", booking.consulting_type),
                    labelValue("Status", paymentStatus)
                ],
                [0, 0, 0, 20]
            ),
            {
                table: { headerRows: 1, widths: ["*", 130], body: rows },
                layout: {
                    hLineWidth: (index) => (index === rows.length - 1 ? 1.5 : index === 0 || index === rows.length ? 0 : 0.5),
                    hLineColor: (index) => (index === rows.length - 1 ? BLUE : BORDER),
                    vLineWidth: () => 0,
                    paddingLeft: () => 12,
                    paddingRight: () => 12,
                    paddingTop: () => 12,
                    paddingBottom: () => 12
                }
            },
            panel([labelValue("Payment Status", paymentStatus), labelValue("Payment ID", paymentId), labelValue("Payment Mode", paymentId ? "Online" : "Offline")], [0, 20, 0, 0])
        ],
        footer: {
            margin: [43, 15, 43, 0],
            stack: [
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 509, y2: 0, lineWidth: 0.5, lineColor: BORDER }], margin: [0, 0, 0, 10] },
                {
                    columns: [
                        { text: "This is a computer-generated invoice and does not require a signature.", color: MUTED, fontSize: 7, width: "*" },
                        { text: "Thank you for choosing MediTwin.", color: MUTED, bold: true, fontSize: 7, alignment: "right", width: 170 }
                    ]
                }
            ]
        }
    };
}

async function invoiceLogo() {
    const response = await fetch("/images/logo/medi-logo.png");
    if (!response.ok) throw new Error("Unable to load the invoice logo. Please try again.");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to load the invoice logo. Please try again."));
        reader.readAsDataURL(blob);
    });
}

export async function downloadInvoice(booking) {
    if (Number(booking.status) !== 4) throw new Error("Invoices are available only for completed bookings.");
    const [{ default: pdfMake }, { default: fonts }, logo] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts"), invoiceLogo()]);
    pdfMake.addVirtualFileSystem(fonts);
    const filename = String(booking.appointment_id || booking._id).replace(/[^a-zA-Z0-9-]/g, "");
    await pdfMake.createPdf(buildInvoiceDocument(booking, logo)).download(`MediTwin-${filename}-invoice.pdf`);
}
