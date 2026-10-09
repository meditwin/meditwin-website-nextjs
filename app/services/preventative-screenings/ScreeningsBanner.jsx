import Image from "next/image";
import banner from "../../../public/images/screening/screening-banner.webp";
import styles from "./screenings-banner.module.css";

export default function ScreeningsBanner() {
  return (
    <section className={styles.banner} aria-labelledby="screenings-title">
      <Image
        src={banner}
        alt="Gynecological care and consultation"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="screenings-title">Preventative Screenings</h1>
      </div>
    </section>
  );
}
