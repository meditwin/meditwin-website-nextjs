import Image from "next/image";
import teamBanner from "../../public/images/teams/team-banner.jpg";
import styles from "./gallery-banner.module.css";

export default function GalleryBanner() {
  return (
    <section className={styles.banner} aria-labelledby="gallery-page-title">
      <Image
        src={teamBanner}
        alt="A group of healthcare professionals"
        fill
        preload
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <h1 id="gallery-page-title" className={styles.title}>Gallery</h1>
    </section>
  );
}
