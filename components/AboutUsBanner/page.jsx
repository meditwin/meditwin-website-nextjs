import Image from "next/image";
import aboutUsBanner from "../../public/images/about/about-us-banner.jpg";
import styles from "./about-us-banner.module.css";

export default function AboutUsBanner() {
  return (
    <section className={styles.banner} aria-labelledby="about-us-title">
      <Image
        src={aboutUsBanner}
        alt="Care-n-Cure clinic reception and waiting area"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="about-us-title">About Us</h1>
      </div>
    </section>
  );
}
