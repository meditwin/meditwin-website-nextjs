const BLUE = "#00379e";
const MUTED = "#778296";
const BORDER = "#dce2eb";

export function buildReceiptDocument(rows, appointmentId, logo) {
    const details = Object.fromEntries(rows);
    const paid = details["Payment Status"] === "Paid";
    const labelValue = (label, value) => ({ stack: [
        { text: label.toUpperCase(), color: MUTED, fontSize: 7, bold: true, margin: [0, 0, 0, 6] },
        { text: String(value || "—"), fontSize: 10, bold: true }
    ] });
    const feeRows = rows.filter(([label]) => ["Consultation Fee", "Coupon", "Discount", "Total Amount"].includes(label));
    return {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [43, 40, 43, 65],
        info: { title: `MediTwin Receipt ${appointmentId}`, author: "MediTwin" },
        defaultStyle: { font: "Roboto", fontSize: 9, color: "#182235", lineHeight: 1.15 },
        content: [
            { columns: [
                ...(logo ? [{ image: logo, width: 44, margin: [0, 5, 10, 0] }] : []),
                { width: "*", stack: [
                    { text: "Appointment Receipt", fontSize: 21, bold: true, margin: [0, 0, 0, 8] },
                    { text: details.Clinic || "MediTwin", color: MUTED, fontSize: 8, margin: [0, 0, 0, 4] },
                    { text: details.Address || "", color: MUTED, fontSize: 8 }
                ] },
                { width: 135, alignment: "right", stack: [
                    labelValue("Receipt / Booking ID", appointmentId),
                    { text: "BOOKING CONFIRMED", color: "#15803d", bold: true, fontSize: 8, margin: [0, 12, 0, 0] }
                ] }
            ], columnGap: 10 },
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 509, y2: 0, lineWidth: 2, lineColor: BLUE }], margin: [0, 20, 0, 22] },
            { columns: [
                labelValue("Booked For", details.Patient),
                { stack: [labelValue("Consultation With", details["Doctor Name"]), { text: details.Specialty || "—", color: MUTED, margin: [0, 6, 0, 0] }] }
            ], columnGap: 35, margin: [0, 0, 0, 22] },
            { table: { widths: ["*", 140], body: [[
                labelValue("Appointment Date & Time", details["Date & Time"]),
                labelValue("Payment Status", details["Payment Status"])
            ]] }, layout: {
                hLineWidth: () => 0, vLineWidth: () => 0, fillColor: () => "#f4f7fb",
                paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 14, paddingBottom: () => 14
            }, margin: [0, 0, 0, 24] },
            { table: { headerRows: 1, widths: ["*", 130], body: [
                [{ text: "DESCRIPTION", color: "#ffffff", fillColor: BLUE, bold: true }, { text: "AMOUNT", color: "#ffffff", fillColor: BLUE, bold: true, alignment: "right" }],
                ...feeRows.map(([label, value]) => {
                    const total = label === "Total Amount";
                    const discount = label === "Coupon" || label === "Discount";
                    const style = { bold: total || discount, color: total ? BLUE : discount ? "#15803d" : "#182235", fillColor: total ? "#edf4ff" : discount ? "#f0fdf4" : "#ffffff", fontSize: total ? 12 : 10 };
                    return [{ text: label, ...style }, { text: String(value ?? "—"), alignment: "right", ...style }];
                })
            ] }, layout: {
                hLineWidth: (index) => index === feeRows.length ? 1.5 : index === 0 || index === feeRows.length + 1 ? 0 : 0.5,
                hLineColor: (index) => index === feeRows.length ? BLUE : BORDER,
                vLineWidth: () => 0, paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 13, paddingBottom: () => 13
            } },
            { text: paid ? "Payment settled. This receipt confirms your booking." : "Payment is due at the clinic. This receipt confirms your booking.", color: MUTED, fontSize: 9, margin: [0, 20, 0, 0] }
        ],
        footer: { margin: [43, 15, 43, 0], stack: [
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 509, y2: 0, lineWidth: 0.5, lineColor: BORDER }], margin: [0, 0, 0, 10] },
            { columns: [
                { text: "This is a computer-generated receipt and does not require a signature.", color: MUTED, fontSize: 7, width: "*" },
                { text: "Thank you for choosing MediTwin.", color: MUTED, bold: true, fontSize: 7, alignment: "right", width: 170 }
            ] }
        ] }
    };
}

async function receiptLogo() {
    const response = await fetch("/images/logo/medi-logo.png");
    if (!response.ok) throw new Error("Unable to load the receipt logo. Please try again.");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to load the receipt logo. Please try again."));
        reader.readAsDataURL(blob);
    });
}

export async function downloadReceiptPdf(rows, appointmentId) {
    const [{ default: pdfMake }, { default: fonts }, logo] = await Promise.all([
        import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts"), receiptLogo()
    ]);
    pdfMake.addVirtualFileSystem(fonts);
    const filename = String(appointmentId).replace(/[^a-zA-Z0-9-]/g, "");
    await pdfMake.createPdf(buildReceiptDocument(rows, appointmentId, logo)).download(`MediTwin-${filename}-receipt.pdf`);
}
