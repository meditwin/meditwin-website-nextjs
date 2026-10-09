import Image from "next/image";
import banner from "../../../public/images/maternal/maternal-banner.jpg";
import styles from "./cycle-banner.module.css";

export default function CycleBanner() {
  return (
    <section className={styles.banner} aria-labelledby="cycle-title">
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
        <h1 id="cycle-title">Cycle Management and PCOS</h1>
      </div>
    </section>
  );
}
