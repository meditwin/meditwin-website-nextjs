import Image from "next/image";
import banner from "../../../public/images/maternal/maternal-banner.jpg";
import styles from "./prenatal-banner.module.css";

export default function PrenatalBanner() {
  return (
    <section className={styles.banner} aria-labelledby="prenatal-title">
      <Image
        src={banner}
        alt="Prenatal and postpartum medical care"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="prenatal-title">Prenatal and Postpartum Care</h1>
      </div>
    </section>
  );
}
