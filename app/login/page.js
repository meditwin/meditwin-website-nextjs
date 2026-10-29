import Image from "next/image";
import logo from "../../public/images/logo/medi-logo.png";
import LoginForm from "./LoginForm";
import LoginAccess from "./LoginAccess";
import styles from "./login.module.css";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <LoginAccess>
    <main className={styles.page} data-login-page>
      <section className={styles.card} aria-labelledby="login-heading">
        <Image
          src={logo}
          alt="Care-n-Cure Wellness"
          className={styles.logo}
          sizes="190px"
          preload
        />
        <h1 id="login-heading" className={styles.heading}>Login</h1>
        <p className={styles.subtitle}>Your Digital Healthcare Companion</p>
        <LoginForm />
        <p className={styles.note}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2 3 6v6c0 5.5 9 10 9 10s9-4.5 9-10V6l-9-4Z" />
            <path d="m8 12 3 3 5-6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>We will send you an OTP to verify your email</span>
        </p>
      </section>
    </main>
    </LoginAccess>
  );
}
