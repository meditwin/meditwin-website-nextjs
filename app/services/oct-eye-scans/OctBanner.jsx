import Image from "next/image";
import octBanner from "../../../public/images/oct/oct-eye-scan-banner.jpg";
import styles from "./oct-banner.module.css";

export default function OctBanner() {
  return (
    <section className={styles.banner} aria-labelledby="oct-title">
      <Image
        src={octBanner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="oct-title">OCT Eye Scan</h1>
      </div>
    </section>
  );
}
