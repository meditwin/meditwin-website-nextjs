
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import styles from "./login.module.css";

export default function LoginForm() {
    const router = useRouter();
    const { sendLoginOtp, sendMobileOtp } = useAuth();

    const [method, setMethod] = useState("email");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const handleContinue = async (event) => {
        event.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            if (method === "mobile") {
                const data = await sendMobileOtp(mobile);

                sessionStorage.setItem(
                    "pending_mobile_login",
                    JSON.stringify({
                        mobile: data.mobile,
                        newuserstatus: data.newuserstatus
                    })
                );

                await Swal.fire({
                    icon: "success",
                    title: "OTP Sent!",
                    text: `An OTP has been sent to ${data.mobile}.`,
                    confirmButtonColor: "#c02cf2",
                    timer: 2000,
                    timerProgressBar: true
                });

                router.push("/mobile-otp");
                return;
            }

            // EXISTING EMAIL LOGIN
            const emailAddress = email.trim().toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
                throw new Error("Please enter a valid email address.");
            }

            await sendLoginOtp(emailAddress);

            await Swal.fire({
                icon: "success",
                title: "OTP Requested!",
                text: `An OTP has been requested for ${emailAddress}. Please check your inbox and spam folder.`,
                confirmButtonColor: "#c02cf2",
                timer: 2500,
                timerProgressBar: true
            });

            router.push(`/otp?email=${encodeURIComponent(emailAddress)}`);

        } catch (error) {
            const detail = error.response?.data?.detail;

            const errorMessage =
                error.response?.data?.message ||
                (Array.isArray(detail)
                    ? detail.map(item => item.msg).join(", ")
                    : typeof detail === "string" ? detail : null) ||
                error.message ||
                "Unable to send OTP.";

            await Swal.fire({
                icon: "error",
                title: "OTP Request Failed",
                text: errorMessage,
                confirmButtonColor: "#c02cf2"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleContinue}>

            <div
                className={styles.methodTabs}
                role="group"
                aria-label="Login method"
            >
                {[
                    ["email", "Email OTP"],
                    ["mobile", "Mobile OTP"]
                ].map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setMethod(value)}
                        disabled={loading}
                        aria-pressed={method === value}
                        className={styles.methodTab}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {method === "email" ? (
                <>
                    <label
                        htmlFor="login-email"
                        className={styles.label}
                    >
                        Email Address
                    </label>

                    <div className={styles.emailField}>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            disabled={loading}
                            required
                        />
                    </div>
                </>
            ) : (
                <>
                    <label
                        htmlFor="login-mobile"
                        className={styles.label}
                    >
                        Mobile Number
                    </label>

                    <div className={styles.emailField}>
                        <input
                            id="login-mobile"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(event) =>
                                setMobile(event.target.value)
                            }
                            disabled={loading}
                            required
                        />
                    </div>
                </>
            )}

            <button
                className={styles.continueButton}
                type="submit"
                disabled={loading}
            >
                {loading ? "Sending OTP..." : "Continue"}
            </button>

        </form>
    );
}
