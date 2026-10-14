"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";
import { clinicTime } from "../DoctorSelection/doctors";
import { calendarDays, displayTime, doctorSchedule } from "./slots";
import styles from "./date-time-selection.module.css";

export default function DateTimeSelection({ doctorId, medicalId, departmentId, selectedSlot, onSelect }) {
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(Boolean(doctorId));
    const [error, setError] = useState("");
    const [date, setDate] = useState("");
    const [month, setMonth] = useState(clinicTime().date.slice(0, 7));

    useEffect(() => {
        if (!doctorId) return;
        const controller = new AbortController();
        async function load() {
            try {
                const records = [];
                let page = 1;
                let lastPage = 1;
                do {
                    const params = { doctor_id: doctorId, date: clinicTime().date, limit: 100, page };
                    if (medicalId != null) params.medical_id = medicalId;
                    if (departmentId != null) params.department_id = departmentId;
                    const { data } = await axios.get(`${MEDICAL_API_URL}/availability/`, { params, signal: controller.signal, timeout: 30000 });
                    if (data.status !== "success" || !Array.isArray(data.data)) throw new Error(data.message || "Unable to load date and time availability.");
                    records.push(...data.data);
                    lastPage = Number(data.totalPages) || (data.total != null ? Math.ceil(Number(data.total) / params.limit) : data.data.length === params.limit ? page + 1 : page);
                    page += 1;
                } while (page <= lastPage && !controller.signal.aborted);
                if (controller.signal.aborted) return;
                const nextSchedule = doctorSchedule(records, { doctorId, medicalId, departmentId });
                const dates = Object.keys(nextSchedule).sort();
                const initialDate = dates.find((value) => nextSchedule[value].some((slot) => !slot.booked)) || dates[0] || "";
                setSchedule(nextSchedule);
                setDate(initialDate);
                if (initialDate) setMonth(initialDate.slice(0, 7));
            } catch (failure) {
                if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || "Unable to load date and time availability.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [doctorId, medicalId, departmentId]);

    function moveMonth(offset) {
        const [year, number] = month.split("-").map(Number);
        const value = new Date(year, number - 1 + offset, 1);
        setMonth(`${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`);
    }

    if (!doctorId) return <p className={styles.notice}>Please go back and select a doctor.</p>;
    if (loading) return <p className={styles.notice} role="status">Loading available dates and times...</p>;
    if (error) return <p className={styles.error} role="alert">{error}</p>;
    if (!Object.keys(schedule).length) return <p className={styles.notice}>No upcoming dates or times are available for this doctor. Please select another doctor.</p>;

    const monthDate = new Date(`${month}-01T12:00:00`);
    return (
        <div className={styles.dateTime}>
            <div className={styles.panels}>
                <div className={styles.panel}>
                    <div className={styles.calendarHeading}>
                        <h3 aria-live="polite">{monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
                        <div className={styles.monthControls}>
                            <button type="button" aria-label="Previous month" disabled={month <= clinicTime().date.slice(0, 7)} onClick={() => moveMonth(-1)}>‹</button>
                            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>›</button>
                        </div>
                    </div>
                    <div className={styles.calendar} role="group" aria-label="Choose an available date">
                        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => <span key={day} className={styles.weekday}>{day}</span>)}
                        {calendarDays(month).map((day) => (
                            <button key={day.date} type="button" disabled={!day.inMonth || !schedule[day.date]} className={`${styles.day} ${day.date === date ? styles.selectedDay : ""}`} aria-label={`${new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { dateStyle: "full" })}${schedule[day.date] ? "" : ", unavailable"}`} aria-pressed={day.date === date} onClick={() => { setDate(day.date); onSelect(null); }}>{String(day.day).padStart(2, "0")}</button>
                        ))}
                    </div>
                </div>
                <div className={styles.panel}>
                    <h3>Available Time Slots</h3>
                    <div className={styles.slots} role="group" aria-label="Choose an appointment time">
                        {(schedule[date] || []).map((slot) => (
                            <button key={slot.id} type="button" disabled={slot.booked} aria-pressed={selectedSlot?.id === slot.id} aria-label={`${displayTime(slot.startTime)} to ${displayTime(slot.endTime)}${slot.booked ? ", booked" : ", available"}`} title={`${displayTime(slot.startTime)} – ${displayTime(slot.endTime)}`} className={`${styles.slot} ${slot.booked ? styles.booked : selectedSlot?.id === slot.id ? styles.selectedSlot : ""}`} onClick={() => onSelect(slot)}>{slot.startTime.slice(0, 5)}-{slot.endTime.slice(0, 5)}</button>
                        ))}
                    </div>
                </div>
            </div>
            <p className={styles.note}><span aria-hidden="true" />Red slots are already booked. Please select the next available slot.</p>
            {selectedSlot && <div className={styles.summary} role="status"><span><span className={styles.summaryIcon} aria-hidden="true">▦</span>{new Date(`${selectedSlot.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span><span><span className={styles.summaryIcon} aria-hidden="true">◷</span>{displayTime(selectedSlot.startTime)}</span></div>}
        </div>
    );
}
