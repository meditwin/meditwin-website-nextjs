"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import styles from "./login.module.css";

export default function LoginForm() {
    const router = useRouter();
    const { sendLoginOtp } = useAuth();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleContinue = async (event) => {
        event.preventDefault();

        if (loading) return;

        const emailAddress = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
            await Swal.fire({
                icon: "warning",
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                confirmButtonColor: "#c02cf2"
            });
            return;
        }

        setLoading(true);

        try {
            await sendLoginOtp(emailAddress);

            await Swal.fire({
                icon: "success",
                title: "OTP Requested!",
                text: `An OTP has been requested for ${emailAddress}. Please check your inbox and spam folder.`,
                confirmButtonText: "Continue",
                confirmButtonColor: "#c02cf2",
                timer: 2500,
                timerProgressBar: true
            });

            router.push(
                `/otp?email=${encodeURIComponent(emailAddress)}`
            );
            
        } catch (error) {
            console.error("Login OTP error:", error);

            const detail = error.response?.data?.detail;

            const errorMessage =
                error.response?.data?.message ||
                (Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : typeof detail === "string" ? detail : null) ||
                error.message ||
                "Unable to request OTP. Please try again.";

            await Swal.fire({
                icon: "error",
                title: "OTP Request Failed",
                text: errorMessage,
                confirmButtonText: "Try Again",
                confirmButtonColor: "#c02cf2"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleContinue}>
            <label htmlFor="login-email" className={styles.label}>
                Email Address
            </label>

            <div className={styles.emailField}>
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <button className={styles.continueButton} type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Continue"}
            </button>

        </form>
    );
}
