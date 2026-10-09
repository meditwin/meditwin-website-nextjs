import Image from "next/image";
import blogBanner from "../../public/images/blogs/blog-banner.jpg";
import styles from "./blog-banner.module.css";

export default function BlogBanner() {
  return (
    <section className={styles.banner} aria-labelledby="blog-page-title">
      <Image
        src={blogBanner}
        alt="Laptop, stethoscope, glasses, and notebook on a desk"
        fill
        preload
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <h1 id="blog-page-title" className={styles.title}>Blog</h1>
    </section>
  );
}
