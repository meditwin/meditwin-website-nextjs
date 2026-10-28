"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DateTimeSelection from "../DateTimeSelection/DateTimeSelection";
import { displayTime } from "../DateTimeSelection/slots";
import { currency } from "../BookingCheckout/booking";
import { downloadInvoice } from "./invoice";
import {
    HISTORY_TABS,
    bookingDate,
    bookingError,
    bookingPresentation,
    canManage,
    cancelBooking,
    fetchBooking,
    fetchBookings,
    historyFileUrl,
    rescheduleBooking,
    statusLabel
} from "./history";
import styles from "./booking-history.module.css";

function Icon({ kind }) {
    const paths = {
        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" />
            </>
        ),
        time: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        location: (
            <>
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
                <circle cx="12" cy="10" r="2" />
            </>
        ),
        details: (
            <>
                <rect x="3" y="3" width="15" height="18" rx="2" />
                <path d="M7 7h7M7 11h5m5 5 4 5" />
                <circle cx="16" cy="15" r="3" />
            </>
        ),
        cancel: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m6 18 12-12" />
            </>
        ),
        person: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
            </>
        ),
        download: (
            <>
                <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
            </>
        )
    };
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[kind]}
        </svg>
    );
}

function AppointmentSummary({ appointment }) {
    const info = bookingPresentation(appointment);
    return (
        <div className={styles.summary}>
            <div className={styles.photo}>{info.image ? <Image src={info.image} alt={info.doctorName} width={116} height={116} unoptimized /> : <Icon kind="person" />}</div>
            <div className={styles.summaryText}>
                <h3>{info.doctorName}</h3>
                {info.specialty && <p className={styles.specialty}>{info.specialty}</p>}
                <div className={styles.when}>
                    <span>
                        <Icon kind="calendar" />
                        {bookingDate(appointment.appointment_date)}
                    </span>
                    <span>
                        <Icon kind="time" />
                        {appointment.start_time ? displayTime(appointment.start_time) : "Time unavailable"}
                    </span>
                </div>
                <p className={styles.location}>
                    <Icon kind="location" />
                    <span>{[info.clinic, info.address].filter(Boolean).join(", ")}</span>
                </p>
            </div>
        </div>
    );
}

function BookingCard({ appointment, busy, onAction }) {
    const completed = Number(appointment.status) === 4;
    const cancelled = Number(appointment.status) === 3;
    const presentation = bookingPresentation(appointment);
    return (
        <article className={styles.card}>
            <span className={`${styles.badge} ${completed ? styles.completed : cancelled ? styles.cancelled : styles.upcoming}`}>{statusLabel(appointment.status)}</span>
            <AppointmentSummary appointment={appointment} />
            {canManage(appointment) && (
                <div className={styles.cardActions}>
                    <button type="button" className={styles.outline} disabled={busy} onClick={() => onAction(appointment, "reschedule")}>
                        <Icon kind="calendar" />
                        Reschedule
                    </button>
                    <button type="button" className={styles.outline} disabled={busy} onClick={() => onAction(appointment, "details")}>
                        <Icon kind="details" />
                        View Details
                    </button>
                    <button type="button" className={styles.outline} disabled={busy} onClick={() => onAction(appointment, "cancel")}>
                        <Icon kind="cancel" />
                        Cancel
                    </button>
                </div>
            )}
            {cancelled && appointment.rejection_reason && (
                <p className={styles.cancellationReason}>
                    <strong>Cancellation reason:</strong> {appointment.rejection_reason}
                </p>
            )}
            {completed && (
                <>
                    <div className={styles.prescription}>
                        <h4>{appointment.prescription?.name || "Prescription"}</h4>
                        <p>{appointment.prescription?.description || "No prescription description provided."}</p>
                    </div>
                    <div className={styles.cardActions}>
                        <button type="button" className={styles.outline} disabled={busy} onClick={() => onAction(appointment, "invoice")}>
                            <Icon kind="download" />
                            Download Invoice
                        </button>
                        {presentation.prescriptionUrl ? (
                            <a className={styles.outline} href={presentation.prescriptionUrl} target="_blank" rel="noopener noreferrer">
                                <Icon kind="download" />
                                Download Prescription
                            </a>
                        ) : (
                            <button type="button" className={styles.outline} disabled>
                                <Icon kind="download" />
                                Download Prescription
                            </button>
                        )}
                    </div>
                </>
            )}
        </article>
    );
}

function CancellationDialog({ appointment, busy, error, onClose, onConfirm }) {
    const dialog = useRef(null);
    const [reason, setReason] = useState("");
    const [validation, setValidation] = useState("");
    useEffect(() => {
        const element = dialog.current;
        element.showModal();
        return () => element.close();
    }, []);
    return (
        <dialog
            ref={dialog}
            className={styles.cancelDialog}
            aria-labelledby="cancel-booking-title"
            onCancel={(event) => {
                event.preventDefault();
                if (!busy) onClose();
            }}
        >
            <h2 id="cancel-booking-title">Cancel Appointment</h2>
            <p>
                {bookingPresentation(appointment).doctorName} · {bookingDate(appointment.appointment_date)}
            </p>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (!reason.trim()) {
                        setValidation("Please enter a reason for cancellation.");
                        return;
                    }
                    onConfirm(reason.trim());
                }}
            >
                <label>
                    Reason for cancellation
                    <textarea
                        autoFocus
                        value={reason}
                        onChange={(event) => {
                            setReason(event.target.value);
                            setValidation("");
                        }}
                        rows={4}
                        maxLength={1000}
                        required
                        disabled={busy}
                        placeholder="Tell us why you need to cancel this appointment"
                    />
                </label>
                {(validation || error) && (
                    <p className={styles.error} role="alert">
                        {validation || error}
                    </p>
                )}
                <div className={styles.cancelActions}>
                    <button type="button" className={styles.outline} disabled={busy} onClick={onClose}>
                        Keep Appointment
                    </button>
                    <button type="submit" className={styles.danger} disabled={busy || !reason.trim()}>
                        {busy ? "Cancelling…" : "Confirm Cancellation"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default function BookingHistory({ onClose }) {
    const { user, token } = useAuth();
    const dialog = useRef(null);
    const heading = useRef(null);
    const inFlight = useRef(false);
    const [status, setStatus] = useState(null);
    const [page, setPage] = useState(1);
    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState({ key: null, records: [], hasNext: false, error: "" });
    const [selected, setSelected] = useState(null);
    const [stage, setStage] = useState("list");
    const [slot, setSlot] = useState(null);
    const [cancelling, setCancelling] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const key = `${user._id}:${status}:${page}:${revision}`;
    const loading = result.key !== key;
    const list = loading ? [] : result.records;

    useEffect(() => {
        const element = dialog.current;
        const previousOverflow = document.body.style.overflow;
        element.showModal();
        heading.current?.focus();
        document.body.style.overflow = "hidden";
        return () => {
            element.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchBookings({ userId: user._id, token, status, page, signal: controller.signal })
            .then((data) => {
                if (!controller.signal.aborted) setResult({ ...data, key, error: "" });
            })
            .catch((failure) => {
                if (!controller.signal.aborted) setResult({ key, records: [], hasNext: false, error: bookingError(failure) });
            });
        return () => controller.abort();
    }, [user._id, token, status, page, key]);

    useEffect(() => {
        heading.current?.focus();
        dialog.current?.scrollTo({ top: 0 });
    }, [stage, status, page]);

    function showList() {
        setStage("list");
        setSelected(null);
        setSlot(null);
        setError("");
    }

    function closeHistory() {
        if (!inFlight.current) onClose();
    }

    async function openAction(appointment, action) {
        if (inFlight.current) return;
        inFlight.current = true;
        setBusy(true);
        setError("");
        setNotice("");
        try {
            const fresh = await fetchBooking(appointment, user._id, token);
            if (action === "invoice") {
                await downloadInvoice(fresh);
                return;
            }
            if (action !== "details" && !canManage(fresh)) {
                setRevision((value) => value + 1);
                throw new Error("This appointment has already been cancelled or completed.");
            }
            if (action === "cancel") setCancelling(fresh);
            else {
                if (action === "reschedule" && !bookingPresentation(fresh).doctorId)
                    throw new Error("Doctor availability is missing for this appointment. Please contact the clinic.");
                setSelected(fresh);
                setSlot(null);
                setStage(action);
            }
        } catch (failure) {
            setError(bookingError(failure));
        } finally {
            inFlight.current = false;
            setBusy(false);
        }
    }

    async function updateBooking(action, reason) {
        if (inFlight.current) return;
        inFlight.current = true;
        setBusy(true);
        setError("");
        try {
            if (action === "cancel") await cancelBooking(cancelling, reason, token);
            else await rescheduleBooking(selected, slot, token);
            setCancelling(null);
            showList();
            setPage(1);
            setRevision((value) => value + 1);
            setNotice(action === "cancel" ? "Your appointment has been cancelled." : "Your appointment has been rescheduled.");
        } catch (failure) {
            setError(bookingError(failure));
        } finally {
            inFlight.current = false;
            setBusy(false);
        }
    }

    const info = selected ? bookingPresentation(selected) : null;
    const details = selected
        ? [
              ["Appointment ID", selected.appointment_id || selected._id],
              ["Status", statusLabel(selected.status)],
              ["Patient", info.patient],
              ...(info.patientPhone ? [["Patient Mobile", info.patientPhone]] : []),
              ["Doctor", info.doctorName],
              ...(info.qualification ? [["Qualification", info.qualification]] : []),
              ["Clinic", info.clinic],
              ["Date", bookingDate(selected.appointment_date)],
              ["Time", selected.start_time && selected.end_time ? `${displayTime(selected.start_time)} – ${displayTime(selected.end_time)}` : "Not provided"],
              ["Consultation Type", selected.consulting_type || "Not provided"],
              ["Amount", selected.amount == null ? "Not provided" : currency(selected.amount)],
              ...(selected.coupon_code ? [["Coupon", selected.coupon_code]] : []),
              ["Payment", Number(selected.payment_status) === 1 ? "Paid" : "Pay on Visit"]
          ]
        : [];

    return (
        <>
            <dialog
                ref={dialog}
                className={styles.dialog}
                aria-labelledby="booking-history-title"
                onCancel={(event) => {
                    event.preventDefault();
                    if (!inFlight.current && !cancelling) {
                        if (stage === "list") onClose();
                        else showList();
                    }
                }}
            >
                <div className={styles.content} aria-busy={busy}>
                    <div className={styles.heading}>
                        <h2 ref={heading} tabIndex={-1} id="booking-history-title">
                            {stage === "reschedule" ? "Reschedule Appointment" : stage === "details" ? "Appointment Details" : "Booking History"}
                        </h2>
                        <button type="button" className={styles.close} aria-label="Close booking history" disabled={busy} onClick={closeHistory}>
                            ×
                        </button>
                    </div>
                    {stage === "list" ? (
                        <>
                            <nav className={styles.tabs} aria-label="Filter bookings by status">
                                {HISTORY_TABS.map((tab) => (
                                    <button
                                        key={tab.label}
                                        type="button"
                                        className={status === tab.status ? styles.activeTab : ""}
                                        aria-pressed={status === tab.status}
                                        disabled={busy}
                                        onClick={() => {
                                            setStatus(tab.status);
                                            setPage(1);
                                            setError("");
                                            setNotice("");
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                            {loading && (
                                <p className={styles.message} role="status">
                                    Loading your bookings…
                                </p>
                            )}
                            {!loading && result.error && (
                                <div className={styles.error} role="alert">
                                    <p>{result.error}</p>
                                    <button type="button" className={styles.outline} onClick={() => setRevision((value) => value + 1)}>
                                        Retry
                                    </button>
                                </div>
                            )}
                            {!loading && !result.error && !list.length && (
                                <p className={styles.message}>No {status == null ? "" : `${statusLabel(status).toLowerCase()} `}appointments found.</p>
                            )}
                            <div className={styles.cards}>
                                {list.map((appointment) => (
                                    <BookingCard key={appointment._id} appointment={appointment} busy={busy} onAction={openAction} />
                                ))}
                            </div>
                            {!loading && !result.error && (page > 1 || result.hasNext) && (
                                <div className={styles.pagination}>
                                    <button type="button" className={styles.outline} disabled={page === 1 || busy} onClick={() => setPage((value) => value - 1)}>
                                        Previous
                                    </button>
                                    <span>Page {page}</span>
                                    <button type="button" className={styles.outline} disabled={!result.hasNext || busy} onClick={() => setPage((value) => value + 1)}>
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button type="button" className={styles.back} disabled={busy} onClick={showList}>
                                ← Back to Booking History
                            </button>
                            <div className={styles.selectedSummary}>
                                <AppointmentSummary appointment={selected} />
                            </div>
                            {stage === "reschedule" ? (
                                <>
                                    <p className={styles.rescheduleHelp}>Choose a new available date and time with the same doctor and clinic.</p>
                                    <DateTimeSelection
                                        key={selected._id}
                                        doctorId={info.doctorId}
                                        availabilityId={selected.availability_id}
                                        selectedSlot={slot}
                                        onSelect={setSlot}
                                    />
                                    <div className={styles.rescheduleActions}>
                                        <button type="button" className={styles.primary} disabled={busy || !slot || slot.booked} onClick={() => updateBooking("reschedule")}>
                                            {busy ? "Saving…" : "Confirm Reschedule"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <dl className={styles.details}>
                                        {details.map(([label, value]) => (
                                            <div key={label}>
                                                <dt>{label}</dt>
                                                <dd>{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    {selected.description && (
                                        <section className={styles.note}>
                                            <h3>Appointment Notes</h3>
                                            <p>{selected.description}</p>
                                        </section>
                                    )}
                                    {Array.isArray(selected.documents) && selected.documents.some((item) => item.file || item.fileUrl) && (
                                        <section className={styles.note}>
                                            <h3>Documents</h3>
                                            {selected.documents
                                                .filter((item) => item.file || item.fileUrl)
                                                .map((item, index) => (
                                                    <a
                                                        key={index}
                                                        href={historyFileUrl(item.fileUrl || item.file, "uploads/appointment/documents")}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {item.name || `Document ${index + 1}`}
                                                    </a>
                                                ))}
                                        </section>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {notice && (
                        <p className={styles.success} role="status">
                            {notice}
                        </p>
                    )}
                    {error && !cancelling && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </dialog>
            {cancelling && (
                <CancellationDialog
                    appointment={cancelling}
                    busy={busy}
                    error={error}
                    onClose={() => {
                        setCancelling(null);
                        setError("");
                    }}
                    onConfirm={(reason) => updateBooking("cancel", reason)}
                />
            )}
        </>
    );
}
