"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { displayTime } from "../DateTimeSelection/slots";
import { appointmentPayload, clinicAddress, consultationAmount, createAppointment, currency, downloadReceipt, fetchPatients, savePatient, patientProfileUrl } from "./booking";
import styles from "./booking-checkout.module.css";
import { createRazorpayOrder, loadRazorpay, openRazorpay, paymentTotals, validateCoupon } from "./payment";

const fields = [
    ["patient_name", "Patient Name", "text"],
    ["parent_name", "Father’s / Husband’s Name", "text"],
    ["gender", "Gender", "select"],
    ["email", "Email Address", "email"],
    ["phone", "Mobile Number", "tel"],
    ["age", "Age (years)", "number"],
    ["address", "Address", "textarea"],
    ["pincode", "Pincode", "text"],
    ["marital_status", "Marital Status", "text"],
    ["qualification", "Educational Qualification", "text"],
    ["occupation", "Occupation", "text"],
    ["insurance_status", "Do you have any insurance?", "select"],
    ["height", "Height (feet)", "number"],
    ["weight", "Weight (kg)", "number"]
];
const choices = { gender: ["Male", "Female", "Other"], insurance_status: ["Yes", "No"] };

function Photo({ src, alt, className }) {
    return src ? <Image src={src} alt={alt} width={360} height={220} unoptimized className={className} /> : null;
}

export default function BookingCheckout({ open, clinic, department, doctor, slot, onClose, onComplete }) {
    const { user, token } = useAuth();
    const dialog = useRef(null);
    const title = useRef(null);
    const inFlight = useRef(false);
    const [savedPatient, setSavedPatient] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [existingPatients, setExistingPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [patientsError, setPatientsError] = useState("");
    const [stage, setStage] = useState("summary");
    const [patient, setPatient] = useState({});
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("");
    const [appointment, setAppointment] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("visit");
    const [pendingPayment, setPendingPayment] = useState(null);
    const recoveryKey = `meditwin:payment:${user?._id}:${slot.availabilityId}:${slot.date}:${slot.startTime}`;
    const hasPatient = Boolean(selectedPatient || photo || Object.values(patient).some((value) => String(value).trim()));
    const patientStage = stage === "patient";
    const heading = stage === "summary" ? "Appointment Summary" : patientStage ? "Basic Patient Information" : "Appointment Booked";
    const dateLabel = new Date(`${slot.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    let amount;
    let feeError = "";
    try {
        amount = consultationAmount(doctor);
    } catch (failure) {
        feeError = failure.message;
    }
    const totals = paymentTotals(amount ?? 0, coupon?.discount ?? 0);

    useEffect(() => {
        if (!open || !token || !user?._id) return;
        const controller = new AbortController();
        Promise.resolve().then(async () => {
            if (controller.signal.aborted) return;
            setLoadingPatients(true);
            setPatientsError("");
            setExistingPatients([]);
            try {
                const patients = await fetchPatients({ userId: user._id, token, signal: controller.signal });
                if (!controller.signal.aborted) setExistingPatients(patients);
            } catch {
                if (!controller.signal.aborted) setPatientsError("Unable to load saved patients. You can still enter new patient details below.");
            } finally {
                if (!controller.signal.aborted) setLoadingPatients(false);
            }
        });
        return () => controller.abort();
    }, [open, token, user?._id]);

    useEffect(() => {
        if (!open) return;
        let active = true;
        Promise.resolve().then(() => {
            if (!active) return;
            try {
                const saved = JSON.parse(sessionStorage.getItem(recoveryKey) || "null");
                if (saved?.response && Number.isFinite(saved.amount) && saved.amount >= 0) {
                    setPendingPayment(saved);
                    setPaymentMethod("online");
                    setStage("patient");
                    setError("");
                }
            } catch { /* Keep the in-memory payment response when storage is unavailable. */ }
        });
        return () => { active = false; };
    }, [open, recoveryKey]);

    useEffect(() => {
        const element = dialog.current;
        if (open && !element.open) element.showModal();
        else if (!open && element.open) element.close();
        return () => {
            if (element.open) element.close();
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            title.current?.focus();
            dialog.current?.scrollTo(0, 0);
        }
    }, [stage, open]);

    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function close() {
        if (inFlight.current) return;
        if (appointment) onComplete();
        else onClose();
    }

    function changeStage(nextStage) {
        setError("");
        setStage(nextStage);
    }

    function choosePhoto(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setError("Please choose a JPG or PNG photo smaller than 5 MB.");
            event.target.value = "";
            return;
        }
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
        setError("");
    }

    function choosePatient(event) {
        const selected =
            existingPatients.find(
                (item) => String(item.id) === event.target.value
            ) || null;

        setSelectedPatient(selected);

        setPatient(
            selected
                ? Object.fromEntries(
                    fields.map(([name]) => [
                        name,
                        selected[name] ?? ""
                    ])
                )
                : {}
        );

        setPhoto(null);

        setPreview(
            selected?.profile_picture
                ? patientProfileUrl(selected.profile_picture)
                : ""
        );

        setError("");
    }

    async function applyCoupon(event) {
        event.preventDefault();
        if (applyingCoupon) return;
        setApplyingCoupon(true);
        setCoupon(null);
        setCouponError("");
        try {
            const validated = await validateCoupon(couponCode, user._id, token);
            setCoupon(validated);
            setCouponCode(validated.code);
        } catch (failure) {
            setCouponError(failure.response?.data?.message || failure.message || "Unable to apply this coupon.");
        } finally {
            setApplyingCoupon(false);
        }
    }

    async function payOnline() {
        if (inFlight.current || applyingCoupon) return;
        if (pendingPayment) { changeStage("patient"); return; }
        setError("");
        if (!token || !user?._id) { setError("Please log in before paying for your appointment."); return; }
        inFlight.current = true;
        setBusy(true);
        try {
            let response;
            if (totals.finalPaise === 0) {
                response = { method: "full_discount", amount: 0, currency: "INR" };
            } else {
                await loadRazorpay();
                const order = await createRazorpayOrder(totals.finalPaise, token);
                // Allow Razorpay’s checkout to appear above the native booking dialog.
                dialog.current?.close();
                try { response = await openRazorpay(order, user); }
                finally { if (dialog.current?.isConnected && open && !dialog.current.open) dialog.current.showModal(); }
                if (!response?.razorpay_payment_id || response.razorpay_order_id !== order.order_id || !response.razorpay_signature) throw new Error("The payment response was incomplete. Please contact the clinic before paying again.");
            }
            const saved = { response, amount: totals.finalPaise / 100, couponCode: coupon?.code || null };
            setPendingPayment(saved);
            setPaymentMethod("online");
            try { sessionStorage.setItem(recoveryKey, JSON.stringify(saved)); } catch { /* Keep the payment response in memory. */ }
            changeStage("patient");
        } catch (failure) {
            setError(failure.response?.data?.message || failure.message || "Unable to complete online payment.");
        } finally {
            inFlight.current = false;
            setBusy(false);
        }
    }

    async function book() {
        if (inFlight.current || appointment) return;
        setError("");
        if (!token || !user?._id) {
            setError("Please log in before booking your appointment.");
            return;
        }
        if (hasPatient && !patient.patient_name?.trim()) {
            setError("Please enter the patient’s name, or skip these fields to book for yourself.");
            return;
        }
        inFlight.current = true;
        setBusy(true);
        try {
            // Validate the appointment before creating a patient record.
            const payload = appointmentPayload({ user, doctor, slot });
            if (hasPatient) {
                const saved = savedPatient || selectedPatient || (await savePatient({ patient, photo, token }));
                setSavedPatient(saved);
                payload.patient_id = saved.id;
            }
            if (paymentMethod === "online") {
                if (!pendingPayment) throw new Error("Please complete online payment before booking your appointment.");
                payload.amount = pendingPayment.amount;
                payload.payment_details = pendingPayment.response;
                payload.payment_status = 1;
                if (pendingPayment.couponCode) payload.coupon_code = pendingPayment.couponCode;
            }
            const booked = await createAppointment(payload, token);
            try { sessionStorage.removeItem(recoveryKey); } catch { /* The appointment has been booked. */ }
            setPendingPayment(null);
            setAppointment(booked);
            setStage("booked");
        } catch (failure) {
            setError(failure.response?.data?.message || failure.message || "Unable to book your appointment.");
        } finally {
            inFlight.current = false;
            setBusy(false);
        }
    }

    const rows = appointment
        ? [
              ["Appointment ID", appointment.appointment_id],
              ["Patient", appointment.patient_id ? savedPatient?.patient_name || user.patient_details?.find((item) => item.id === appointment.patient_id)?.patient_name || patient.patient_name || "Patient" : user.name],
              ["Doctor Name", doctor.name],
              ["Specialty", doctor.specialist || department.name],
              ["Clinic", clinic.name],
              ["Address", clinicAddress(clinic) || "Contact the clinic for the address"],
              ["Date & Time", `${dateLabel}, ${displayTime(slot.startTime)}–${displayTime(slot.endTime)}`],
              ["Consultation Fee", currency(amount)],
              ...(appointment.coupon_code ? [["Coupon", appointment.coupon_code], ["Discount", currency(Math.max(0, amount - Number(appointment.amount)))]] : []),
              ["Total Amount", currency(appointment.amount ?? amount)],
              ["Payment Status", Number(appointment.payment_status) === 1 ? "Paid" : "Unpaid · Pay on Visit"]
          ]
        : [];

    return (
        <dialog
            ref={dialog}
            className={styles.dialog}
            aria-labelledby="booking-checkout-title"
            onCancel={(event) => {
                event.preventDefault();
                close();
            }}
        >
            <div className={styles.content} aria-busy={busy}>
                <button type="button" className={styles.close} aria-label="Close booking popup" disabled={busy} onClick={close}>
                    ×
                </button>
                <h2 ref={title} tabIndex={-1} id="booking-checkout-title" className={styles.title}>
                    {heading}
                </h2>
                {stage === "summary" && (
                    <>
                        <article className={styles.doctor}>
                            <Photo src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                            <span className={styles.badge}>Professional Doctor</span>
                            <h3>{doctor.name}</h3>
                            <p>
                                {doctor.specialist || department.name}
                                {doctor.experience != null ? ` | ${doctor.experience} Years Experience` : ""}
                            </p>
                            {doctor.qualification && <p>{doctor.qualification}</p>}
                            {amount != null && <p>{currency(amount)} consultation fees</p>}
                        </article>
                        <div className={styles.date}>
                            <span>{dateLabel}</span>
                            <span>{displayTime(slot.startTime)}</span>
                        </div>
                        <article className={styles.clinic}>
                            <Photo src={clinic.image} alt={clinic.name} className={styles.clinicImage} />
                            <h3>{clinic.name}</h3>
                            {clinicAddress(clinic) && <p>{clinicAddress(clinic)}</p>}
                            {clinic.mobile && (
                                <p>
                                    <a href={`tel:${clinic.mobile.replace(/[^+\d]/g, "")}`}>{clinic.mobile}</a>
                                </p>
                            )}
                        </article>
                        <form className={styles.coupon} onSubmit={applyCoupon}>
                            <label htmlFor="booking-coupon">Apply coupon code</label>
                            <div><input id="booking-coupon" value={couponCode} placeholder="Enter coupon code" disabled={applyingCoupon || busy} onChange={(event) => { setCouponCode(event.target.value); setCoupon(null); setCouponError(""); }} /><button type="submit" className={styles.secondary} disabled={applyingCoupon || busy || !couponCode.trim() || Boolean(feeError)}>{applyingCoupon ? "Applying…" : "Apply"}</button></div>
                            {coupon && <p role="status" className={styles.couponSuccess}>{coupon.code} applied: {coupon.discount}% off online payment.</p>}
                            {couponError && <p role="alert" className={styles.error}>{couponError}</p>}
                        </form>
                        <dl className={styles.breakdown}>
                            <div>
                                <dt>Consultation Fee</dt>
                                <dd>{amount == null ? "Unavailable" : currency(amount)}</dd>
                            </div>
                            {coupon && <div><dt>Coupon Discount ({coupon.discount}%)</dt><dd>−{currency(totals.discountPaise / 100)}</dd></div>}
                            <div className={styles.total}>
                                <dt>Total Amount</dt>
                                <dd>{amount == null ? "Unavailable" : currency(totals.finalPaise / 100)}</dd>
                            </div>
                        </dl>
                        <div className={styles.actions}>
                            <button type="button" className={styles.primary} disabled={Boolean(feeError) || applyingCoupon || busy} onClick={payOnline}>
                                {busy ? "Please wait…" : "Pay Now"}
                            </button>
                            {coupon && <p className={styles.hint}>Coupon applies to online payment. Pay on Visit: {currency(amount)}.</p>}
                            <button type="button" className={styles.secondary} disabled={Boolean(feeError) || applyingCoupon || busy || Boolean(pendingPayment)} onClick={() => { setPaymentMethod("visit"); changeStage("patient"); }}>
                                Pay on Visit
                            </button>
                        </div>
                    </>
                )}
                {patientStage && (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            book();
                        }}
                    >
                        <p className={styles.description}>
                            If you are booking for yourself, please skip these fields and book your appointment. To book for someone else, fill in their patient details below.
                        </p>
                        <fieldset disabled={busy || Boolean(savedPatient)} className={styles.fields}>
                            <label className={styles.patientSelector}>
                                Select existing patient (optional)
                                <select value={selectedPatient ? String(selectedPatient.id) : ""} disabled={loadingPatients} onChange={choosePatient}>
                                    <option value="">New patient / skip selection</option>
                                    {existingPatients.map((item) => (
                                        <option key={item.id} value={String(item.id)}>{item.patient_name}</option>
                                    ))}
                                </select>
                                {loadingPatients && <span role="status">Loading saved patients...</span>}
                                {patientsError && <span role="alert">{patientsError}</span>}
                            </label>
                        </fieldset>
                        <fieldset disabled={busy || Boolean(savedPatient) || Boolean(selectedPatient)} className={styles.fields}>
                            <label className={styles.upload}>
                                Upload Profile Picture
                                {preview && <Photo src={preview} alt="Patient profile preview" className={styles.avatar} />}
                                <input key={selectedPatient?.id || "new"} type="file" accept="image/jpeg,image/png" onChange={choosePhoto} />
                                <span className={styles.hint}>JPG or PNG, up to 5 MB</span>
                            </label>
                            {fields.map(([name, label, type]) => (
                                <label key={name}>
                                    {label}
                                    {type === "select" ? (
                                        <select name={name} value={patient[name] || ""} onChange={(event) => setPatient({ ...patient, [name]: event.target.value })}>
                                            <option value="">Select (optional)</option>
                                            {choices[name].map((choice) => (
                                                <option key={choice} value={choice}>
                                                    {choice}
                                                </option>
                                            ))}
                                        </select>
                                    ) : type === "textarea" ? (
                                        <textarea name={name} rows={3} value={patient[name] || ""} onChange={(event) => setPatient({ ...patient, [name]: event.target.value })} />
                                    ) : (
                                        <input
                                            name={name}
                                            type={type}
                                            value={patient[name] ?? ""}
                                            min={type === "number" ? 0 : undefined}
                                            step={name === "age" ? 1 : type === "number" ? "any" : undefined}
                                            max={name === "age" ? 150 : undefined}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setPatient({ ...patient, [name]: type === "number" && value !== "" ? Number(value) : value });
                                            }}
                                        />
                                    )}
                                </label>
                            ))}
                        </fieldset>
                        {stage === "patient" && savedPatient && <p className={styles.hint}>Patient details saved. You can retry booking without adding the patient again.</p>}
                        <div className={styles.actions}>
                            {paymentMethod === "online" && pendingPayment && <p className={styles.hint}>Payment response saved{pendingPayment.response.razorpay_payment_id ? ` (${pendingPayment.response.razorpay_payment_id})` : ""}. Amount: {currency(pendingPayment.amount)}. Complete the optional patient details and book your appointment.</p>}
                            <button type="submit" className={styles.primary} disabled={busy}>
                                {busy ? "Please wait…" : "Book Appointment"}
                            </button>
                            <button type="button" className={styles.textButton} disabled={busy || Boolean(pendingPayment)} onClick={() => changeStage("summary")}>
                                Back
                            </button>
                        </div>
                    </form>
                )}
                {stage === "booked" && (
                    <>
                        <div className={styles.success}>
                            <span aria-hidden="true">✓</span>
                            <h3>Appointment Booked!</h3>
                            <p>Your appointment has been successfully scheduled.</p>
                            <p>
                                Appointment ID: <strong>{appointment.appointment_id}</strong>
                            </p>
                        </div>
                        <div className={styles.receipt}>
                            <h3>Appointment Details</h3>
                            <dl>
                                {rows.slice(1).filter(([label]) => label !== "Address").map(([label, value]) => (
                                    <div key={label}>
                                        <dt>{label}</dt>
                                        <dd className={label === "Payment Status" ? Number(appointment.payment_status) === 1 ? styles.paid : styles.unpaid : undefined}>{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className={styles.actions}>
                            <button type="button" className={styles.primary} disabled={busy} onClick={async () => {
                                if (inFlight.current) return;
                                inFlight.current = true;
                                setBusy(true);
                                setError("");
                                try { await downloadReceipt(rows, appointment.appointment_id); }
                                catch (failure) { setError(failure.message || "Unable to download your receipt. Please try again."); }
                                finally { inFlight.current = false; setBusy(false); }
                            }}>
                                Download Receipt
                            </button>
                            <button type="button" className={styles.textButton} onClick={close}>
                                Done
                            </button>
                        </div>
                    </>
                )}
                {(error || feeError) && (
                    <p role="alert" className={styles.error}>
                        {error || feeError}
                    </p>
                )}
            </div>
        </dialog>
    );
}
