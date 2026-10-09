import Image from "next/image";
import blogBanner from "../../public/images/blogs/blog-banner.jpg";
import styles from "./blog-detail-banner.module.css";

export default function BlogDetailBanner({ title = "Nameless Art School" }) {
  return (
    <section className={styles.banner} aria-labelledby="blog-detail-title">
      <Image
        src={blogBanner}
        alt="Laptop, stethoscope, glasses, and notebook on a desk"
        fill
        preload
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <h1 id="blog-detail-title" className={styles.title}>{title}</h1>
    </section>
  );
}
