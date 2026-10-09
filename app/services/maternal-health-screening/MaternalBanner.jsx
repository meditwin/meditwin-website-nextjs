import Image from "next/image";
import maternalBanner from "../../../public/images/maternal/maternal-banner.jpg";
import styles from "./maternal-banner.module.css";

export default function MaternalBanner() {
  return (
    <section className={styles.banner} aria-labelledby="maternal-title">
      <Image
        src={maternalBanner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="maternal-title">Maternal Health Screening</h1>
      </div>
    </section>
  );
}
