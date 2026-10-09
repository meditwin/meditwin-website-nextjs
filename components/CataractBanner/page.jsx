import Image from "next/image";
import cataractBanner from "../../public/images/catarac/catarac-banner.jpg";
import styles from "./cataract-banner.module.css";

export default function CataractBanner() {
  return (
    <section className={styles.banner} aria-labelledby="cataract-title">
      <Image
        src={cataractBanner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="cataract-title">Advanced Cataract Surgery</h1>
      </div>
    </section>
  );
}
