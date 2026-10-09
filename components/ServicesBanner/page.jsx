import Image from "next/image";
import servicesBanner from "../../public/images/about/about-us-banner.jpg";
import styles from "./services-banner.module.css";

export default function ServicesBanner() {
  return (
    <section className={styles.banner} aria-labelledby="services-title">
      <Image
        src={servicesBanner}
        alt="Care-n-Cure clinic reception and waiting area"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="services-title">Our Services</h1>
      </div>
    </section>
  );
}
