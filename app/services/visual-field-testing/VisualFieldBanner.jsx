import Image from "next/image";
import visualFieldBanner from "../../../public/images/visualfield/visual-field-test.jpg";
import styles from "./visual-field-banner.module.css";

export default function VisualFieldBanner() {
  return (
    <section className={styles.banner} aria-labelledby="visual-field-title">
      <Image
        src={visualFieldBanner}
        alt="Patient receiving an advanced eye examination"
        className={styles.image}
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="visual-field-title">Visual Field Testing</h1>
      </div>
    </section>
  );
}
