"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginAccess({ children }) {
    const router = useRouter();
    const { authLoading, isAuthenticated, profileChecked, needsProfileCompletion } = useAuth();

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;
        router.replace(profileChecked && !needsProfileCompletion ? "/booking" : "/complete-profile");
    }, [authLoading, isAuthenticated, profileChecked, needsProfileCompletion, router]);

    if (authLoading || isAuthenticated) return null;
    return children;
}
