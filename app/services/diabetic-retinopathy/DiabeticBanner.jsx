import Image from "next/image";
import banner from "../../../public/images/diabetic/diabetic-banner.avif";
import styles from "./diabetic-banner.module.css";

export default function DiabeticBanner() {
  return (
    <section className={styles.banner} aria-labelledby="diabetic-retinopathy-title">
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
        <h1 id="diabetic-retinopathy-title">Diabetic Retinopathy</h1>
      </div>
    </section>
  );
}
