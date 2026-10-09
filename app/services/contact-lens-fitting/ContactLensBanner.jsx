import Image from "next/image";
import banner from "../../../public/images/lens/lens-banner.webp";
import styles from "./contact-lens-banner.module.css";

export default function ContactLensBanner() {
  return (
    <section className={styles.banner} aria-labelledby="contact-lens-title">
      <Image
        src={banner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="contact-lens-title">Contact Lens Fitting</h1>
      </div>
    </section>
  );
}
