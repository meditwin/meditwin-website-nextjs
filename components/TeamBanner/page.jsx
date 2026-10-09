import Image from "next/image";
import teamBanner from "../../public/images/teams/team-banner.jpg";
import styles from "./team-banner.module.css";

export default function TeamBanner() {
  return (
    <section className={styles.banner} aria-labelledby="team-page-title">
      <Image src={teamBanner} alt="A group of healthcare professionals"
        fill preload sizes="100vw" className={styles.image} />
      <div className={styles.overlay} aria-hidden="true" />
      <h1 id="team-page-title" className={styles.title}>Our Teams</h1>
    </section>
  );
}
