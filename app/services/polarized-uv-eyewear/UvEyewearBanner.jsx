import Image from "next/image";
import banner from "../../../public/images/catarac/catarac-banner.jpg";
import styles from "./uv-eyewear-banner.module.css";

export default function UvEyewearBanner() {
  return (
    <section className={styles.banner} aria-labelledby="uv-eyewear-title">
      <Image
        src={banner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="uv-eyewear-title">Polarized UV Eyewear</h1>
      </div>
    </section>
  );
}
