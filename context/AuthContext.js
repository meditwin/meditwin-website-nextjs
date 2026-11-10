"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

import axios from "axios";
import { isProfileComplete, parseUserProfile } from "./profile";

const AuthContext = createContext(null);

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.carencurewellness.com").replace(/\/+$/, "");

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [profileChecked, setProfileChecked] = useState(false);
    const [authError, setAuthError] = useState("");

    const refreshUser = useCallback(async (accessToken) => {
        const activeToken = accessToken || sessionStorage.getItem("access_token");
        if (!activeToken) throw new Error("Please log in first.");
        setAuthError("");
        try {
            const { data } = await axios.get(API_BASE_URL + "/get-users-by-token", {
                headers: { Authorization: "Bearer " + activeToken }, timeout: 30000
            });
            const profile = parseUserProfile(data);
            if (sessionStorage.getItem("access_token") !== activeToken) throw new Error("Your session changed. Please log in again.");
            sessionStorage.setItem("user", JSON.stringify(profile));
            setUser(profile);
            setProfileChecked(true);
            return profile;
        } catch (error) {
            if (sessionStorage.getItem("access_token") !== activeToken) throw error;
            if ([401, 403].includes(error.response?.status)) {
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("user");
                setToken(null);
                setUser(null);
            }
            setProfileChecked(false);
            setAuthError(error.response?.data?.message || error.message || "Unable to load your profile.");
            throw error;
        }
    }, []);

    // Recheck the server profile before allowing booking access.
    useEffect(() => {
        let active = true;
        Promise.resolve().then(async () => {
            if (!active) return;
            const savedToken = sessionStorage.getItem("access_token");
            if (!savedToken) return;
            setToken(savedToken);
            try { await refreshUser(savedToken); } catch { /* The profile screen offers a retry. */ }
        }).finally(() => {
            if (active) setAuthLoading(false);
        });
        return () => { active = false; };
    }, [refreshUser]);

    // Save authenticated user in session storage.
    const saveAuthenticatedUser = useCallback((data, emailAddress) => {
        if (!data?.access_token) {
            throw new Error("Authentication token is missing.");
        }

        const userData = data.user && typeof data.user === "object" ? data.user : data;

        const loggedInUser = {
            _id: userData._id ?? null,
            name: userData.name ?? "",
            email: userData.email ?? emailAddress,
            mobile: userData.mobile ?? userData.mobile_no ?? "",
            user_role: userData.user_role ?? null,
            verification_status: userData.verification_status ?? 1,
            profile_image: userData.profile_image ?? null
        };

        sessionStorage.setItem("access_token", data.access_token);

        sessionStorage.setItem("user", JSON.stringify(loggedInUser));

        setProfileChecked(false);
        setToken(data.access_token);
        setUser(loggedInUser);

        return data;
    }, []);

    // ====================================
    // LOGIN - SEND OTP
    // ====================================

    const sendLoginOtp = useCallback(async (email) => {
        const emailAddress = email?.trim().toLowerCase();

        if (!emailAddress) {
            throw new Error("Email address is required.");
        }

        const response = await axios.post(
            `${API_BASE_URL}/users/login/`,
            {
                email: emailAddress
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        const data = response.data;

        if (data?.status !== "success") {
            throw new Error(data?.message || "Unable to send OTP.");
        }

        return data;
    }, []);

    // ====================================
    // LOGIN - VERIFY OTP
    // ====================================

    const verifyLoginOtp = useCallback(
        async (email, otp) => {
            const emailAddress = email?.trim().toLowerCase();
            const otpValue = String(otp ?? "").trim();

            if (!emailAddress) {
                throw new Error("Email address is required.");
            }

            if (!/^\d{6}$/.test(otpValue)) {
                throw new Error("Please enter a valid 6-digit OTP.");
            }

            const response = await axios.post(`${API_BASE_URL}/user/login-verify-otp`, null, {
                params: {
                    user_email: emailAddress,
                    otp: Number(otpValue)
                },
                timeout: 30000
            });

            const data = response.data;

            if (data?.status !== "success") {
                throw new Error(data?.message || "Invalid or expired OTP.");
            }

            saveAuthenticatedUser(data, emailAddress);
            try {
                const profile = await refreshUser(data.access_token);
                return { ...data, user: profile, needsProfileCompletion: !isProfileComplete(profile) };
            } catch {
                // OTP succeeded; keep the session and let the profile screen retry.
                return { ...data, needsProfileCompletion: true };
            }
        },
        [saveAuthenticatedUser, refreshUser]
    );


    // ====================================
    // MOBILE LOGIN - SEND OTP
    // ====================================

    const sendMobileOtp = useCallback(async (mobile) => {
        const input = String(mobile || "").replace(/\D/g, "");

        const digits =
            input.length === 12 && input.startsWith("91")
                ? input.slice(2)
                : input;

        if (!/^[6-9]\d{9}$/.test(digits)) {
            throw new Error("Enter a valid 10-digit Indian mobile number.");
        }

        const normalizedMobile = `${digits}`;

        const { data } = await axios.post(
            `${API_BASE_URL}/users/login/`,
            { mobile: normalizedMobile },
            { timeout: 30000 }
        );

        if (data?.status !== "success") {
            throw new Error(data?.message || "Unable to send mobile OTP.");
        }

        return {
            ...data,
            mobile: normalizedMobile,
            newuserstatus: Boolean(data.newuserstatus)
        };
    }, []);

    // ====================================
    // MOBILE LOGIN - VERIFY OTP
    // ====================================

    const verifyMobileOtp = useCallback(
        async (mobile, otp) => {
            const otpValue = String(otp ?? "").trim();

            if (!/^\d{4,9}$/.test(otpValue)) {
                throw new Error("Enter a valid OTP.");
            }

            const { data } = await axios.post(
                `${API_BASE_URL}/user/login-verify-otp`,
                null,
                {
                    params: {
                        mobile,
                        otp: otpValue
                    },
                    timeout: 30000
                }
            );

            if (data?.status !== "success" || !data?.access_token) {
                throw new Error(
                    data?.message || "Invalid or expired OTP."
                );
            }

            saveAuthenticatedUser(data);

            try {
                const profile = await refreshUser(data.access_token);

                return {
                    ...data,
                    user: profile,
                    needsProfileCompletion: !isProfileComplete(profile)
                };
            } catch {
                return {
                    ...data,
                    needsProfileCompletion: true
                };
            }
        },
        [saveAuthenticatedUser, refreshUser]
    );


    // ====================================
    // COMPLETE PROFILE - UPDATE THE VERIFIED ACCOUNT
    // ====================================

    const completeProfile = useCallback(async (formData) => {
        if (!token || !(formData instanceof FormData)) throw new Error("Please log in first.");
        const payload = JSON.parse(formData.get("user_data") || "{}");
        formData.set(
            "user_data",
            JSON.stringify({
                ...payload,
                ...(user?.email ? { email: user.email } : {}),
                user_role: 4,
                verification_status: 1
            })
        );

        const { data } = await axios.put(API_BASE_URL + "/users", formData, {
            headers: { Authorization: "Bearer " + token }, timeout: 60000
        });
        if (data?.status !== "success") throw new Error(data?.message || data?.error || "Unable to save your profile.");
        const profile = await refreshUser(token);
        if (!isProfileComplete(profile)) throw new Error("Your profile is still incomplete. Please check the required details.");
        return profile;
    }, [token, user, refreshUser]);

    // ====================================
    // LOGOUT
    // ====================================

    const logout = useCallback(() => {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");

        setProfileChecked(false);
        setAuthError("");
        setToken(null);
        setUser(null);
    }, []);

    // ====================================
    // AUTH CONTEXT VALUES
    // ====================================

    const value = useMemo(
        () => ({
            user,
            token,
            authLoading,

            isAuthenticated: Boolean(token),

            sendLoginOtp,
            verifyLoginOtp,
            sendMobileOtp,
            verifyMobileOtp,

            completeProfile,
            refreshUser,
            profileChecked,
            authError,
            needsProfileCompletion: !isProfileComplete(user),

            logout
        }),
        [user, token, authLoading, sendLoginOtp, verifyLoginOtp, sendMobileOtp, verifyMobileOtp, completeProfile, refreshUser, profileChecked, authError, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ====================================
// CUSTOM AUTH HOOK
// ====================================

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
