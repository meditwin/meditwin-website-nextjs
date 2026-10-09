import styles from "./play-store-button.module.css";

export default function PlayStoreButton({ onClick }) {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.carencurehealth.meditwin"
      className={styles.button}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Meditwin on Google Play (opens in a new tab)"
      onClick={onClick}
    >
      <svg width="22" height="24" viewBox="0 0 24 26" aria-hidden="true">
        <path fill="#34a853" d="M2 1.5 14 13 2 24.5Z" />
        <path fill="#4285f4" d="M2 1.5 17 10 14 13Z" />
        <path fill="#fbbc04" d="m17 10 5 2.8a.8.8 0 0 1 0 1.4L17 17l-3-4Z" />
        <path fill="#ea4335" d="M2 24.5 14 13l3 4Z" />
      </svg>
      <span className={styles.label}>
        <span className={styles.caption}>GET IT ON</span>
        <span className={styles.title}>Google Play</span>
      </span>
    </a>
  );
}
