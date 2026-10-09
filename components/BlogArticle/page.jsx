import Image from "next/image";
import blogImage from "../../public/images/blogs/blog1.png";
import styles from "./blog-article.module.css";

// Placeholder article copy matches the supplied layout until final copy is available.
const paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempus vestibulum consequat. Maecenas luctus eu semper erat faucibus porta eget. Donec mattis integer tortor id diam. Duis pretium commodo, aliquet habitasse consectetur id congue. Nam suspendisse semper ornare consectetur sed. Elit in mauris fermentum donec et ultrices. Viverra nunc tempor facilisis nulla. Nulla habitant ut sollicitudin commodo faucibus nunc malesuada consectetur habitant.";

export default function BlogArticle() {
  return (
    <article className={styles.article} aria-labelledby="article-heading">
      <header className={styles.header}>
        <h2 id="article-heading">Nameless Art School</h2>
        <p>{paragraph}</p>
      </header>
      <div className={styles.hero}>
        <Image src={blogImage} alt="Nameless Art School poster featuring pencil sketches and craft classes"
          fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1425px) 80vw, 1140px" />
      </div>
      <blockquote className={styles.quote}>
        <span aria-hidden="true" className={styles.quoteMark}>“</span>
        <p>Lorem ipsum dolor sit amet consectetur. Quis fames accumsan a tristique. Aliquam semper congue maecenas et aliquet. Condimentum lectus id elit in iaculis pharetra vulputate. Turpis pharetra integer mauris et adipiscing sit eget in eu.</p>
      </blockquote>
      <section aria-labelledby="article-section-heading">
        <h2 id="article-section-heading">Nameless Art School</h2>
        <p>{paragraph}</p>
        <div className={styles.images}>
          <div className={styles.imageFrame}>
            <Image src={blogImage} alt="Nameless Art School class poster with painting examples"
              fill sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 1425px) 40vw, 558px" />
          </div>
          <div className={styles.imageFrame}>
            <Image src={blogImage} alt="Art school poster showing pencil, watercolor, and oil painting classes"
              fill sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 1425px) 40vw, 558px" />
          </div>
        </div>
        <p>{paragraph}</p>
        <p>{paragraph}</p>
      </section>
    </article>
  );
}
