"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./user-menu.module.css";

export default function UserMenu({ onNavigate }) {
    const router = useRouter();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const container = useRef(null);
    const trigger = useRef(null);

    useEffect(() => {
        function outside(event) {
            if (!container.current?.contains(event.target)) setOpen(false);
        }
        document.addEventListener("pointerdown", outside);
        return () => document.removeEventListener("pointerdown", outside);
    }, []);

    function showView(nextView) {
        setOpen(false);
        onNavigate?.();
        router.push(nextView === "profile" ? "/profile" : "/booking-history");
    }

    function handleLogout() {
        logout();
        setOpen(false);
        onNavigate();
        router.replace("/");
    }

    return (
        <>
        <div
            ref={container}
            className={styles.account}
            onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setOpen(true);
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setOpen(false);
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape" && open) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false);
                    trigger.current?.focus();
                }
            }}
        >
            <button
                ref={trigger}
                type="button"
                className={styles.trigger}
                aria-label="User account"
                aria-expanded={open}
                aria-controls="user-account-options"
                onClick={() => setOpen((current) => !current)}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                </svg>
            </button>
            {open && (
                <div className={styles.dropdown} id="user-account-options">
                    <ul className={styles.options}>
                        <li>
                            <button type="button" onClick={() => showView("profile")}>
                                My Profile
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={() => showView("history")}>
                                Booking History
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
        </>
    );
}
