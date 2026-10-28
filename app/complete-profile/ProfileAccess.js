"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProfileAccess({ children }) {
    const router = useRouter();
    const { authLoading, isAuthenticated, needsProfileCompletion, profileChecked, authError, refreshUser } = useAuth();
    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) router.replace("/login");
        else if (profileChecked && !needsProfileCompletion) router.replace("/booking");
    }, [authLoading, isAuthenticated, needsProfileCompletion, profileChecked, router]);

    if (authError)
        return (
            <div style={{ textAlign: "center" }}>
                <p role="alert">{authError}</p>
                <button
                    type="button"
                    onClick={() => {
                        refreshUser().catch(() => {});
                    }}
                >
                    Retry
                </button>
            </div>
        );
    if (authLoading || !isAuthenticated || !profileChecked || !needsProfileCompletion)
        return (
            <p role="status" style={{ textAlign: "center" }}>
                Loading your profile...
            </p>
        );
    return children;
}
