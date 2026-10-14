"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function BookingAccess({ children }) {
    const router = useRouter();
    const { authLoading, isAuthenticated, needsProfileCompletion, profileChecked } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/");
        else if (!authLoading && (!profileChecked || needsProfileCompletion)) router.replace("/complete-profile");
    }, [authLoading, isAuthenticated, needsProfileCompletion, profileChecked, router]);

    if (authLoading || !isAuthenticated || !profileChecked || needsProfileCompletion)
        return (
            <p role="status" style={{ textAlign: "center", padding: "60px 20px" }}>
                Loading...
            </p>
        );
    return children;
}
