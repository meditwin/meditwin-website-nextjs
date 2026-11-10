
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "../../public/images/logo/medi-logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import styles from "../login/login.module.css";
import otpStyles from "../otp/otp.module.css";

export default function MobileOtpPage() {
    const router = useRouter();

    const { verifyMobileOtp, sendMobileOtp } = useAuth();

    const [pending, setPending] = useState(null);
    const [digits, setDigits] = useState(Array(6).fill(""));
    const inputs = useRef([]);
    const otp = digits.join("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendAvailableAt, setResendAvailableAt] = useState(() => Date.now() + 30_000);
    const [secondsRemaining, setSecondsRemaining] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
            setSecondsRemaining(remaining);
            if (remaining === 0) clearInterval(timer);
        }, 250);

        return () => clearInterval(timer);
    }, [resendAvailableAt]);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(
                "pending_mobile_login"
            );

            const data = saved ? JSON.parse(saved) : null;

            if (!data?.mobile) {
                router.replace("/login");
                return;
            }

            setPending(data);
        } catch {
            router.replace("/login");
        }
    }, [router]);

    const enterDigits = (index, value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 6 - index);

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
    };

    const handleVerify = async (event) => {
        event.preventDefault();

        if (loading || !pending || !/^\d{6}$/.test(otp)) return;

        setLoading(true);

        try {
            const result = await verifyMobileOtp(
                pending.mobile,
                otp
            );

            sessionStorage.removeItem("pending_mobile_login");

            const needsRegistration =
                pending.newuserstatus ||
                result.needsProfileCompletion;

            router.replace(
                needsRegistration
                    ? "/complete-profile"
                    : "/booking"
            );

        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Invalid OTP. Please try again.",
                confirmButtonColor: "#c02cf2"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!pending || resending || loading || Date.now() < resendAvailableAt) return;

        setResending(true);

        try {
            const result = await sendMobileOtp(pending.mobile);

            const updatedPending = {
                mobile: result.mobile,
                newuserstatus:
                    pending.newuserstatus || result.newuserstatus
            };

            sessionStorage.setItem(
                "pending_mobile_login",
                JSON.stringify(updatedPending)
            );

            setPending(updatedPending);
            setDigits(Array(6).fill(""));
            setResendAvailableAt(Date.now() + 30_000);
            setSecondsRemaining(30);

            await Swal.fire({
                icon: "success",
                title: "OTP Sent",
                text: "A new OTP has been requested.",
                confirmButtonColor: "#c02cf2"
            });

        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Unable to Resend OTP",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Please try again.",
                confirmButtonColor: "#c02cf2"
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <Image src={logo} alt="Care-n-Cure Wellness" className={styles.logo} sizes="190px" preload />

                <h1 className={styles.heading}>
                    Verify Mobile
                </h1>

                <p className={styles.subtitle}>
                    Enter the OTP sent to {pending?.mobile || "your mobile"}
                </p>

                <form
                    className={styles.form}
                    onSubmit={handleVerify}
                >
                    {/* <label
                        htmlFor="mobile-otp"
                        className={styles.label}
                    >
                        Enter OTP
                    </label> */}

                    <div className={otpStyles.digits} role="group" aria-label="6-digit verification code">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                id={index === 0 ? "mobile-otp" : `mobile-otp-${index + 1}`}
                                ref={(element) => {
                                    inputs.current[index] = element;
                                }}
                                aria-label={`OTP digit ${index + 1}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                maxLength={6}
                                pattern="[0-9]"
                                value={digit}
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
                                disabled={loading}
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={styles.continueButton}
                        disabled={
                            loading ||
                            !pending ||
                            !/^\d{6}$/.test(otp)
                        }
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>

                <p className={styles.resendPrompt}>
                    <span>Didn&apos;t receive the OTP?</span>

                    <button
                        type="button"
                        className={styles.resendButton}
                        onClick={handleResend}
                        disabled={resending || loading || !pending || secondsRemaining > 0}
                    >
                        {resending ? "Resending..." : secondsRemaining > 0
                            ? `Resend in 00:${String(secondsRemaining).padStart(2, "0")}`
                            : "Resend OTP"}
                    </button>
                </p>

            </section>
        </main>
    );
}
