import Image from "next/image";
import contactBanner from "../../public/images/contact/contact-banner.jpg";
import styles from "./contact-banner.module.css";

export default function ContactBanner() {
  return (
    <section className={styles.banner} aria-labelledby="contact-page-title">
      <Image
        src={contactBanner}
        alt="Healthcare professional writing notes beside a laptop"
        fill
        preload
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <h1 id="contact-page-title" className={styles.title}>Contact Us</h1>
    </section>
  );
}
