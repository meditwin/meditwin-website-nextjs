"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import blogImage from "../../public/images/blogs/blog1.png";
import styles from "./blog-insights.module.css";

// The supplied design repeats the same article in six positions.
const defaultArticles = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Nameless Art School",
  description: "Experienced artist Rajib Sur Roy (Gold Medalist, Government Art College)",
}));

export default function BlogInsights({ heading = "Insights for Better Vision and Wellness", limit = 6 }) {
  const articles = defaultArticles.slice(0, limit);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const id = useId();

  function goTo(index) {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!card) return;
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function syncSlide() {
    const track = trackRef.current;
    if (!track) return;
    const origin = track.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    Array.from(track.children).forEach((card, index) => {
      const delta = Math.abs(card.getBoundingClientRect().left - origin);
      if (delta < distance) {
        distance = delta;
        nearest = index;
      }
    });
    setActive(nearest);
  }

  return (
    <section className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.container}>
        <h2 id={`${id}-heading`}>{heading}</h2>
        <div className={styles.grid} id={`${id}-cards`} ref={trackRef} onScroll={syncSlide}>
          {articles.map((article, index) => (
            <article className={styles.card} key={article.id} aria-label={`Article ${index + 1} of ${articles.length}`}>
              <div className={styles.imageFrame}>
                <Image src={blogImage} alt="Nameless Art School art class poster"
                  fill sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 767px) 45vw, (max-width: 1425px) 26vw, 371px" />
              </div>
              <div className={styles.copy}>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <Link href="/blog/nameless-art-school" className={`btn ${styles.more}`} aria-label={`Learn more about ${article.title}`}>
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.controls}>
          <button type="button" aria-label="Previous article" aria-controls={`${id}-cards`}
            disabled={active === 0} onClick={() => goTo(active - 1)}>&#8592;</button>
          <span aria-live="polite" aria-atomic="true">{active + 1} / {articles.length}</span>
          <button type="button" aria-label="Next article" aria-controls={`${id}-cards`}
            disabled={active === articles.length - 1} onClick={() => goTo(active + 1)}>&#8594;</button>
        </div>
      </div>
    </section>
  );
}
