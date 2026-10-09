import Image from "next/image";
import banner from "../../../public/images/glucoma/glucoma-banner.png";
import styles from "./glaucoma-banner.module.css";

export default function GlaucomaBanner() {
  return (
    <section className={styles.banner} aria-labelledby="glaucoma-title">
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
        <h1 id="glaucoma-title">Glaucoma Management</h1>
      </div>
    </section>
  );
}
