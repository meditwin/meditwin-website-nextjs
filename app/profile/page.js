"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, authLoading, authError, refreshUser } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/login");
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || !isAuthenticated || !user) {
        return <main style={{ minHeight: "60vh", padding: "60px 24px", textAlign: "center" }}>
            <p role="status">{authError || "Loading profile…"}</p>
            {isAuthenticated && authError && <button type="button" onClick={() => refreshUser().catch(() => {})}>Retry Loading Profile</button>}
        </main>;
    }

    return <main style={{ minHeight: "60vh" }}><UserProfile onClose={() => router.replace("/booking")} /></main>;
}
