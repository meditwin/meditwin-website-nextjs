"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import loginStyles from "../login/login.module.css";
import styles from "./otp.module.css";

export default function OtpForm({ email }) {
    const router = useRouter();

    const { verifyLoginOtp, sendLoginOtp } = useAuth();

    const [digits, setDigits] = useState(Array(6).fill(""));
    const [seconds, setSeconds] = useState(60);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const inputs = useRef([]);

    // Countdown timer.
    useEffect(() => {
        if (seconds <= 0) return;

        const timeout = setTimeout(() => {
            setSeconds((value) => Math.max(0, value - 1));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [seconds]);

    function enterDigits(index, value) {
        const numbers = value.replace(/\D/g, "").slice(0, 6 - index);

        setMessage("");

        setDigits((current) => {
            const next = [...current];

            if (!numbers) {
                next[index] = "";
            } else {
                [...numbers].forEach((digit, offset) => {
                    next[index + offset] = digit;
                });
            }

            return next;
        });

        if (numbers) {
            inputs.current[Math.min(index + numbers.length, 5)]?.focus();
        }
    }

    // ====================================
    // VERIFY OTP
    // ====================================

    async function handleVerify(event) {
        event.preventDefault();

        if (loading) return;

        if (!email?.trim()) {
            setMessage("Email address is missing. Please return to the login page.");
            return;
        }

        const otp = digits.join("");

        if (!/^\d{6}$/.test(otp)) {
            setMessage("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const result = await verifyLoginOtp(email, otp);

            // AuthContext stores the token and user.
            router.replace(result.needsProfileCompletion ? "/complete-profile" : "/booking");
            router.refresh();
        } catch (error) {
            console.error("OTP verification error:", error);

            setMessage(error.response?.data?.message || error.message || "Unable to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    // ====================================
    // RESEND OTP
    // ====================================

    async function handleResend() {
        if (loading || seconds > 0) return;

        if (!email?.trim()) {
            setMessage("Email address is missing. Please return to login.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Your existing backend sends login OTP here.
            await sendLoginOtp(email);

            setDigits(Array(6).fill(""));
            setSeconds(60);

            inputs.current[0]?.focus();

            setMessage("A new OTP has been sent. Please check your email.");
        } catch (error) {
            console.error("Resend OTP error:", error);

            setMessage(error.response?.data?.message || error.message || "Unable to resend OTP.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleVerify}>
            <div className={styles.digits} role="group" aria-label="6-digit verification code">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(element) => {
                            inputs.current[index] = element;
                        }}
                        aria-label={`OTP digit ${index + 1}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={6}
                        required
                        value={digit}
                        disabled={loading}
                        onChange={(event) => enterDigits(index, event.target.value)}
                        onFocus={(event) => event.target.select()}
                        onPaste={(event) => {
                            event.preventDefault();

                            enterDigits(index, event.clipboardData.getData("text"));
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Backspace" && !digit && index > 0) {
                                inputs.current[index - 1]?.focus();
                            }

                            if (event.key === "ArrowLeft" && index > 0) {
                                inputs.current[index - 1]?.focus();
                            }

                            if (event.key === "ArrowRight" && index < 5) {
                                inputs.current[index + 1]?.focus();
                            }
                        }}
                    />
                ))}
            </div>

            <p className={styles.resendPrompt}>
                Didn&apos;t receive OTP?{" "}
                <button type="button" className={styles.resendButton} disabled={seconds > 0 || loading} onClick={handleResend}>
                    Resend OTP
                </button>
            </p>

            <button className={loginStyles.continueButton} type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className={styles.timer}>
                {seconds > 0 ? (
                    <>
                        Resend code in: <span>00:{String(seconds).padStart(2, "0")}</span>
                    </>
                ) : (
                    <span>You can resend the OTP now.</span>
                )}
            </p>

            {message && (
                <p className={styles.message} role="status" aria-live="polite">
                    {message}
                </p>
            )}
        </form>
    );
}
