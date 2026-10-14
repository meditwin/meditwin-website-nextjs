import Image from "next/image";
import logo from "../../public/images/logo/medi-logo.png";
import loginStyles from "../login/login.module.css";
import styles from "./otp.module.css";
import OtpForm from "./OtpForm";

export const metadata = {
    title: "Enter OTP"
};

export default async function OtpPage({ searchParams }) {
    const { email } = await searchParams;

    const emailAddress = typeof email === "string" ? email.trim() : "";

    const recipient = emailAddress || "your email address";

    return (
        <main className={loginStyles.page}>
            <section className={loginStyles.card} aria-labelledby="otp-heading">
                <Image src={logo} alt="Care-n-Cure Wellness" className={loginStyles.logo} sizes="190px" preload />

                <h1 id="otp-heading" className={loginStyles.heading}>
                    Enter OTP
                </h1>

                <p className={styles.subtitle}>
                    Enter the 6-digit code sent to <span>{recipient}</span>
                </p>

                <OtpForm key={emailAddress} email={emailAddress} />
            </section>
        </main>
    );
}
