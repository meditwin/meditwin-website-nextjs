"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MEDICAL_API_URL, parseMedicalClinics } from "./clinics";
import styles from "./clinic-selection.module.css";
import SupportedSpecialties from "../SupportedSpecialties/SupportedSpecialties";
import DoctorSelection from "../DoctorSelection/DoctorSelection";
import DateTimeSelection from "../DateTimeSelection/DateTimeSelection";

const steps = ["Select Clinic", "Supported Specialties", "Select Doctor", "Select Date & Time"];
const stepUrls = ["clinic", "specialties", "doctor", "date-time"];

function DetailIcon({ phone = false }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {phone ? (
                <path d="m5 3 4 1 1 5-3 2a15 15 0 0 0 6 6l2-3 5 1 1 4c0 2-2 3-4 2C9 20 4 15 3 7c-1-2 0-4 2-4Z" />
            ) : (
                <>
                    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                    <circle cx="12" cy="10" r="2" />
                </>
            )}
        </svg>
    );
}

export default function ClinicSelection({ clinics: suppliedClinics, onSelectClinic, onNext, onBack }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedId, setSelectedId] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const step = Math.max(0, stepUrls.indexOf(searchParams.get("step")));
    const [error, setError] = useState("");
    const [medicalClinics, setMedicalClinics] = useState([]);
    const [loading, setLoading] = useState(suppliedClinics === undefined);
    const [loadError, setLoadError] = useState("");
    const heading = useRef(null);
    const clinics = suppliedClinics ?? medicalClinics;
    const selectedClinic = clinics.find((clinic) => clinic.id === selectedId);
    const medicalId = selectedClinic?.id ?? searchParams.get("medical_id") ?? undefined;
    const departmentId = selectedDepartment?.id ?? searchParams.get("department_id") ?? undefined;

    useEffect(() => {
        if (suppliedClinics !== undefined) return;
        const controller = new AbortController();
        axios
            .get(`${MEDICAL_API_URL}/medical/`, { signal: controller.signal, timeout: 30000 })
            .then(({ data }) => {
                if (!controller.signal.aborted) setMedicalClinics(parseMedicalClinics(data));
            })
            .catch((failure) => {
                if (!controller.signal.aborted) setLoadError(failure.response?.data?.message || failure.message || "Unable to load clinics. Please try again later.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [suppliedClinics]);

    function navigateStep(nextStep, filters = {}) {
        setSelectedSlot(null);
        const params = new URLSearchParams(searchParams.toString());
        if (nextStep === 0) params.delete("step");
        else params.set("step", stepUrls[nextStep]);
        if (nextStep >= 2) {
            if (medicalId != null) params.set("medical_id", String(medicalId));
            if (departmentId != null) params.set("department_id", String(departmentId));
        }
        for (const [key, value] of Object.entries(filters)) {
            if (value == null) params.delete(key);
            else params.set(key, String(value));
        }
        const query = params.toString();
        router.push(`/booking${query ? `?${query}` : ""}`, { scroll: false });
        setError("");
        heading.current?.focus();
    }

    function selectClinic(clinic) {
        setSelectedDepartment(null);
        setSelectedDoctor(null);
        setSelectedId(clinic.id);
        setError("");
        navigateStep(1, { medical_id: clinic.id, department_id: null, doctor_id: null });
        heading.current?.focus();
        onSelectClinic?.(clinic);
    }

    function next() {
        if (step === 3) {
            if (!selectedSlot || selectedSlot.booked) {
                setError("Please select an available date and time to continue.");
                return;
            }
            if (onNext) {
                onNext(selectedClinic, selectedDepartment, selectedDoctor, selectedSlot);
                return;
            }
            return;
        }
        if (step === 0) {
            setSelectedDepartment(null);
            setSelectedDoctor(null);
            navigateStep(1, { department_id: null, doctor_id: null });
            setError("");
            heading.current?.focus();
            return;
        }
        if (step === 2) {
            if (!selectedDoctor) {
                setError("Please select a doctor to continue.");
                return;
            }
            navigateStep(3, { doctor_id: selectedDoctor.id });
            return;
        }
        if (!selectedDepartment) {
            setError("Please select a specialty to continue.");
            return;
        }
        if (onNext) {
            onNext(selectedClinic, selectedDepartment);
            return;
        }
        navigateStep(2);
        heading.current?.focus();
    }

    function back() {
        if (step > 0) {
            navigateStep(step - 1);
            setError("");
            heading.current?.focus();
        } else if (onBack) onBack();
        else router.push("/");
    }

    return (
        <section className={styles.section} aria-label="Appointment booking steps">
            <nav className={styles.stepBar} aria-label="Booking progress">
                <ol className={styles.steps}>
                    {steps.map((label, index) => (
                        <li
                            key={label}
                            className={`${styles.step} ${index === step ? styles.activeStep : index < step ? styles.completedStep : ""}`}
                            aria-current={index === step ? "step" : undefined}
                        >
                            {index <= 2 ? (
                                <button type="button" className={styles.stepButton} onClick={() => navigateStep(index)} aria-current={index === step ? "step" : undefined}>
                                    {label}
                                </button>
                            ) : (
                                label
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            <div className={styles.selection}>
                <div className={styles.container}>
                    <h2 ref={heading} tabIndex={-1} className={styles.heading}>
                        {steps[step]}
                    </h2>
                    {step === 0 ? (
                        <>
                            <div className={styles.clinics} role="group" aria-label="Choose a clinic">
                                {clinics.map((clinic, index) => (
                                    <article key={clinic.id} className={`${styles.clinic} ${selectedId === clinic.id ? styles.selected : ""}`}>
                                        <div className={styles.imageWrap}>
                                            {clinic.image && (
                                                <Image
                                                    src={clinic.image}
                                                    alt={clinic.name}
                                                    fill
                                                    sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 850px) 45vw, 340px"
                                                    className={styles.image}
                                                    unoptimized
                                                    onError={(event) => {
                                                        event.currentTarget.style.visibility = "hidden";
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.details}>
                                            <h3>{clinic.name}</h3>
                                            {clinic.mobile && (
                                                <p>
                                                    <DetailIcon phone />
                                                    <a href={`tel:${clinic.mobile.replace(/[^+\d]/g, "")}`}>{clinic.mobile}</a>
                                                </p>
                                            )}
                                            <button
                                                type="button"
                                                className={styles.selectButton}
                                                aria-pressed={selectedId === clinic.id}
                                                aria-label={`${selectedId === clinic.id ? "Selected" : "Select"} ${clinic.name}, option ${index + 1}`}
                                                onClick={() => selectClinic(clinic)}
                                            >
                                                {selectedId === clinic.id ? "Selected" : "Select Clinic"}
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            {loading && (
                                <p className={styles.notice} role="status">
                                    Loading clinics...
                                </p>
                            )}
                            {loadError && (
                                <p className={styles.error} role="alert">
                                    {loadError}
                                </p>
                            )}
                            {!loading && !loadError && clinics.length === 0 && (
                                <p className={styles.notice} role="status">
                                    No clinics are available at the moment.
                                </p>
                            )}
                        </>
                    ) : step === 1 ? (
                        <SupportedSpecialties
                            selectedDepartment={selectedDepartment}
                            onSelect={(department) => {
                                setSelectedDepartment(department);
                                setSelectedDoctor(null);
                                setError("");
                                navigateStep(1, { department_id: department.id, doctor_id: null });
                            }}
                        />
                    ) : step === 2 ? (
                        <DoctorSelection
                            key={`${medicalId || "all"}:${departmentId || "all"}`}
                            medicalId={medicalId}
                            departmentId={departmentId}
                            selectedDoctor={selectedDoctor}
                            onSelect={(doctor) => {
                                setSelectedDoctor(doctor);
                                setError("");
                            }}
                        />
                    ) : (
                        <DateTimeSelection
                            key={`${medicalId || "all"}:${departmentId || "all"}:${selectedDoctor?.id || searchParams.get("doctor_id") || "none"}`}
                            doctorId={selectedDoctor?.id || searchParams.get("doctor_id")}
                            medicalId={medicalId}
                            departmentId={departmentId}
                            selectedSlot={selectedSlot}
                            onSelect={(slot) => {
                                setSelectedSlot(slot);
                                setError("");
                            }}
                        />
                    )}
                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </div>
            <div className={`${styles.container} ${styles.actions}`}>
                <button type="button" className={styles.backButton} onClick={back}>
                    Back
                </button>
                <button
                    type="button"
                    className={styles.nextButton}
                    disabled={(step === 3 && !selectedSlot) || (step === 1 && !selectedDepartment) || (step === 2 && !selectedDoctor)}
                    onClick={next}
                >
                    Next
                </button>
            </div>
        </section>
    );
}
