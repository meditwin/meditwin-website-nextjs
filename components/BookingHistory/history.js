import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";

export const HISTORY_TABS = [
    { label: "All", status: null },
    { label: "Upcoming", status: 2 },
    { label: "Cancelled", status: 3 },
    { label: "Completed", status: 4 }
];
export const HISTORY_PAGE_SIZE = 6;

function options(token, extra = {}) {
    if (!token) throw new Error("Please log in to view your bookings.");
    return { headers: { Authorization: `Bearer ${token}` }, timeout: 30000, ...extra };
}

function success(data) {
    if (data?.status !== "success") throw new Error(data?.message || data?.error || "Unable to load your booking. Please try again.");
    return data.data;
}

export function canManage(appointment) {
    return ![3, 4].includes(Number(appointment.status));
}

export function statusLabel(status) {
    return { 1: "Pending", 2: "Upcoming", 3: "Cancelled", 4: "Completed" }[Number(status)] || "Pending";
}

export async function fetchBookings({ userId, token, status, page, signal }) {
    if (!userId) throw new Error("Please log in to view your bookings.");
    const params = { user_id: userId, limit: HISTORY_PAGE_SIZE };
    if (status != null) params.status = status;
    const { data } = await axios.get(`${MEDICAL_API_URL}/appointments/${page}`, options(token, { params, signal }));
    const records = success(data);
    if (!Array.isArray(records)) throw new Error("The booking history response was incomplete.");
    const totalPages = Number(data.totalPages ?? data.total_pages) || (data.total != null ? Math.ceil(Number(data.total) / HISTORY_PAGE_SIZE) : null);
    return {
        records: records.filter((item) => String(item.user_id) === String(userId)),
        hasNext: totalPages != null ? page < totalPages : records.length === HISTORY_PAGE_SIZE
    };
}

export async function fetchBooking(appointment, userId, token) {
    const { data } = await axios.get(`${MEDICAL_API_URL}/appointment/${appointment._id}`, options(token));
    const record = success(data);
    if (!record?._id || String(record.user_id) !== String(userId)) throw new Error("This booking is not available for your account.");
    // The detail endpoint returns the raw appointment; keep the list's doctor and clinic lookups.
    return { ...appointment, ...record };
}

export async function cancelBooking(appointment, reason, token) {
    if (!canManage(appointment)) throw new Error("This appointment can no longer be cancelled.");
    const trimmedReason = reason.trim();
    if (!trimmedReason) throw new Error("Please enter a reason for cancellation.");
    const { data } = await axios.post(`${MEDICAL_API_URL}/appointment/${appointment._id}/status`, { status: 3, reason: trimmedReason }, options(token));
    return success(data);
}

export async function rescheduleBooking(appointment, slot, token) {
    if (!canManage(appointment)) throw new Error("This appointment can no longer be rescheduled.");
    if (!slot || slot.booked || String(slot.availabilityId) !== String(appointment.availability_id)) throw new Error("Please choose an available time for this appointment.");
    const payload = { appointment_date: slot.date, start_time: slot.startTime.slice(0, 5), end_time: slot.endTime.slice(0, 5) };
    if (
        payload.appointment_date === appointment.appointment_date &&
        payload.start_time === appointment.start_time?.slice(0, 5) &&
        payload.end_time === appointment.end_time?.slice(0, 5)
    )
        throw new Error("Please choose a different appointment time.");
    const form = new FormData();
    form.append("appointment_data", JSON.stringify(payload));
    const { data } = await axios.put(`${MEDICAL_API_URL}/appointment/${appointment._id}`, form, options(token));
    return success(data);
}

export function historyFileUrl(value, folder) {
    if (!value) return "";
    const path = String(value).replace(/\\/g, "/");
    if (/^https?:\/\//i.test(path)) return path;
    const relative = path.replace(/^\/+/, "");
    return `${MEDICAL_API_URL}/${relative.startsWith("uploads/") ? relative : `${folder}/${relative}`}`;
}

export function bookingPresentation(appointment) {
    const doctor = appointment.doctor || {};
    const details = doctor.doctor_details || doctor.profetional_details || doctor;
    const medical = appointment.medical || {};
    const address = "Shop 214, Aahirini Market, 2 nd floor, street 214, Action Area I, Newtown, West Bengal 700156";
    const patient = appointment.patient_details || {};
    return {
        doctorId: doctor._id || appointment.doctor_id,
        doctorName: doctor.name || appointment.doctor_name || "Doctor information unavailable",
        image: historyFileUrl(doctor.imageUrl || doctor.profile_image, "uploads/users"),
        specialty: details.specialization || appointment.doctor_specialization || "",
        qualification: details.qualification || "",
        clinic: medical.name || appointment.medical_name || details.hospital_or_clinic || "Clinic information unavailable",
        address,
        patient: patient.patient_name || patient.name || "Not provided",
        patientPhone: patient.phone || patient.mobile || "",
        prescriptionUrl: historyFileUrl(appointment.prescription?.fileUrl || appointment.prescription?.file, "uploads/appointment/prescriptions")
    };
}

export function bookingDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function bookingError(failure) {
    const detail = failure.response?.data?.detail;
    return (
        failure.response?.data?.message ||
        (Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : typeof detail === "string" ? detail : "") ||
        failure.message ||
        "Unable to update your booking. Please try again."
    );
}
