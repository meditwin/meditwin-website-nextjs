"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";
import { parseDepartments } from "./departments";
import styles from "./supported-specialties.module.css";

export default function SupportedSpecialties({ selectedDepartment, onSelect }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cardsPerPage, setCardsPerPage] = useState(3);
    const track = useRef(null);
    const sliding = departments.length > 3;
    const emptySlots = sliding ? (cardsPerPage - departments.length % cardsPerPage) % cardsPerPage : 0;

    useEffect(() => {
        const element = track.current;
        if (!sliding || !element) return;
        function measure() {
            const firstCard = element.querySelector("button");
            if (!firstCard) return;
            const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
            const count = Math.max(1, Math.round((element.clientWidth + gap) / (firstCard.offsetWidth + gap)));
            setCardsPerPage(count);
        }
        const frame = requestAnimationFrame(measure);
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => { cancelAnimationFrame(frame); observer.disconnect(); };
    }, [sliding]);

    useEffect(() => {
        const controller = new AbortController();
        // All clinics share the departments returned by this endpoint.
        axios
            .get(`${MEDICAL_API_URL}/department/`, { signal: controller.signal, timeout: 30000 })
            .then(({ data }) => {
                if (!controller.signal.aborted) setDepartments(parseDepartments(data, MEDICAL_API_URL));
            })
            .catch((failure) => {
                if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || "Unable to load specialties.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    function slide(direction) {
        const element = track.current;
        if (!element) return;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
        const pageWidth = element.clientWidth + gap;
        const currentPage = Math.round(element.scrollLeft / pageWidth);
        const lastPage = Math.ceil(departments.length / cardsPerPage) - 1;
        const nextPage = Math.max(0, Math.min(lastPage, currentPage + direction));
        element.scrollTo({ left: nextPage * pageWidth, behavior: reducedMotion ? "instant" : "smooth" });
    }

    return (
        <div className={`${styles.specialties} ${sliding ? styles.carousel : ""}`}>
            {loading && (
                <p className={styles.notice} role="status">
                    Loading specialties...
                </p>
            )}
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && departments.length === 0 && (
                <p className={styles.notice} role="status">
                    No specialties are available at the moment.
                </p>
            )}
            <div ref={track} className={`${styles.cards} ${sliding ? styles.slider : ""}`} role="group" aria-label="Choose a specialty" tabIndex={sliding ? 0 : undefined}>
                {departments.map((department) => (
                    <button
                        key={department.id}
                        type="button"
                        className={`${styles.card} ${selectedDepartment?.id === department.id ? styles.selected : ""}`}
                        aria-pressed={selectedDepartment?.id === department.id}
                        onClick={() => onSelect(department)}
                    >
                        {department.image && (
                            <span className={styles.imageWrap}>
                                <Image
                                    src={department.image}
                                    alt={department.name}
                                    fill
                                    unoptimized
                                    sizes="48px"
                                    className={styles.image}
                                    onError={(event) => {
                                        event.currentTarget.style.visibility = "hidden";
                                    }}
                                />
                            </span>
                        )}
                        <span className={styles.name}>{department.name}</span>
                        <span className={styles.description}>{department.description}</span>
                    </button>
                ))}
                {Array.from({ length: emptySlots }, (_, index) => <div key={`empty-slot-${index}`} aria-hidden="true" />)}
            </div>
            {sliding && (
                <div className={styles.controls} aria-label="Slide specialties">
                    <button type="button" onClick={() => slide(-1)} aria-label="Previous specialties">
                        ‹
                    </button>
                    <button type="button" onClick={() => slide(1)} aria-label="Next specialties">
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}
