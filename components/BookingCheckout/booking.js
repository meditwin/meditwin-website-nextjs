import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";

export async function fetchPatients({ userId, token, signal }) {
    if (!userId || !token) throw new Error("Please log in to load saved patients.");
    const { data } = await axios.get(`${MEDICAL_API_URL}/users/${encodeURIComponent(userId)}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
        signal
    });
    if (data?.status !== "success" || !Array.isArray(data.data)) {
        throw new Error(data?.message || "Unable to load saved patients.");
    }
    return data.data.filter((item) => item?.id && item.patient_name);
}

export function consultationAmount(doctor) {
    const fee = doctor?.consultationFee;
    if (fee == null || String(fee).trim() === "" || !Number.isFinite(Number(fee)) || Number(fee) < 0) {
        throw new Error("The consultation fee is unavailable. Please choose another doctor or contact the clinic.");
    }
    return Number(fee);
}

export function appointmentPayload({ user, doctor, slot, patientId }) {
    if (!user?._id || !slot?.availabilityId || slot.booked) throw new Error("Please select an available appointment and log in again if needed.");
    const record = doctor.availability?.find((item) => String(item._id) === String(slot.availabilityId));
    const details = record?.doctor?.doctor_details || record?.doctor?.profetional_details;
    return {
        user_id: user._id,
        ...(patientId ? { patient_id: patientId } : {}),
        availability_id: slot.availabilityId,
        appointment_date: slot.date,
        start_time: slot.startTime.slice(0, 5),
        end_time: slot.endTime.slice(0, 5),
        amount: consultationAmount(doctor),
        ...(details?.consulting_type ? { consulting_type: details.consulting_type } : {}),
        payment_details: {},
        payment_status: 0
    };
}

export async function savePatient({ patient, photo, token, appointmentId }) {
    const details = Object.fromEntries(
        Object.entries(patient)
            .filter(([, value]) => value != null && String(value).trim() !== "")
            .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
    );
    const form = new FormData();
    form.append(
        "user_data",
        JSON.stringify({
            patient_details: [details],
            ...(appointmentId ? { appointment_id: appointmentId } : {})
        })
    );
    if (photo) form.append("patient_profile_images", photo);
    const { data } = await axios.put(`${MEDICAL_API_URL}/users`, form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000
    });
    if (data?.status !== "success") throw new Error(data?.message || data?.error || "Unable to save patient details.");
    const saved = data.patient_details?.at(-1);
    if (!saved?.id) throw new Error("The patient ID was not returned. Please contact the clinic before retrying.");
    return saved;
}

export async function createAppointment(payload, token) {
    const form = new FormData();
    form.append("appointment_data", JSON.stringify(payload));
    const { data } = await axios.post(`${MEDICAL_API_URL}/appointments/`, form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000
    });
    if (data?.status !== "success") throw new Error(data?.message || "Unable to book this appointment. Please try again.");
    if (!data.data?._id || !data.data?.appointment_id) throw new Error("The booking response was incomplete. Check your appointments before trying again.");
    return data.data;
}

export function currency(amount) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

export function clinicAddress() {
    return "Shop 214, Aahirini Market, 2 nd floor, street 214, Action Area I, Newtown, West Bengal 700156";
}

export async function downloadReceipt(rows, appointmentId) {
    const { downloadReceiptPdf } = await import("./receipt");
    await downloadReceiptPdf(rows, appointmentId);
}


export function patientProfileUrl(path) {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const baseUrl = new URL(
        process.env.NEXT_PUBLIC_API_URL
    ).origin;

    return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}