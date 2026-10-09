import Image from "next/image";
import banner from "../../../public/images/eye-exam/exam-banner.jpeg";
import styles from "./glasses-banner.module.css";

export default function GlassesBanner() {
  return (
    <section className={styles.banner} aria-labelledby="glasses-title">
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
        <h1 id="glasses-title">Prescription Glasses and Exams</h1>
      </div>
    </section>
  );
}
