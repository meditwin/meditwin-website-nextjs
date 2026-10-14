"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";
import { availabilityParams, parseAvailabilityPage, availableDoctors } from "./doctors";
import styles from "./doctor-selection.module.css";

export default function DoctorSelection({ medicalId, departmentId, selectedDoctor, onSelect }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                const filters = { medicalId, departmentId };
                const now = new Date();
                const params = availabilityParams(filters, now);
                const records = [];
                let page = 1;
                let lastPage = 1;
                do {
                    const { data } = await axios.get(`${MEDICAL_API_URL}/availability/`, { params: { ...params, page }, signal: controller.signal, timeout: 30000 });
                    const batch = parseAvailabilityPage(data);
                    records.push(...batch);
                    lastPage = Number(data.totalPages) || (data.total != null ? Math.ceil(Number(data.total) / params.limit) : batch.length === params.limit ? page + 1 : page);
                    page += 1;
                } while (page <= lastPage && !controller.signal.aborted);
                if (!controller.signal.aborted) setDoctors(availableDoctors(records, MEDICAL_API_URL, filters, now));
            } catch (failure) {
                if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || "Unable to load available doctors.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [medicalId, departmentId]);

    return (
        <div>
            {loading && (
                <p className={styles.notice} role="status">
                    Loading available doctors...
                </p>
            )}
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && doctors.length === 0 && (
                <p className={styles.notice} role="status">
                    No doctors are currently available{medicalId || departmentId ? " for your selection clinic please try another clinic" : ""}.
                </p>
            )}
            <div className={styles.cards} role="group" aria-label="Choose a doctor">
                {doctors.map((doctor) => (
                    <article key={doctor.id} className={`${styles.card} ${selectedDoctor?.id === doctor.id ? styles.selected : ""}`}>
                        <div className={styles.imageWrap}>
                            {doctor.image && (
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 575px) 90vw, (max-width: 850px) 45vw, 340px"
                                    className={styles.image}
                                    onError={(event) => {
                                        event.currentTarget.style.visibility = "hidden";
                                    }}
                                />
                            )}
                        </div>
                        <div className={styles.details}>
                            <h3>{doctor.name}</h3>
                            <p>
                                {doctor.specialist}
                                {doctor.specialist && doctor.experience != null ? " | " : ""}
                                {doctor.experience != null ? `${doctor.experience} Years Experience` : ""}
                            </p>
                            {doctor.qualification && <p>{doctor.qualification}</p>}
                            {doctor.consultationFee != null && <p>₹{doctor.consultationFee} Consultation fees</p>}
                            <button
                                type="button"
                                className={styles.selectButton}
                                aria-pressed={selectedDoctor?.id === doctor.id}
                                aria-label={`Select ${doctor.name}`}
                                onClick={() => onSelect(doctor)}
                            >
                                {selectedDoctor?.id === doctor.id ? "Selected" : "Select Doctor"}
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
