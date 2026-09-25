"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import insightImage from "../../public/images/vision/vission1.png";
import "./insights.css";

// The supplied reference repeats the same article in all three positions.
const defaultArticles = [1, 2, 3].map((id) => ({
  id,
  title: "Nameless Art School",
  description: "Experienced artist Rajib Sur Roy (Gold Medalist, Government Art College)",
  image: insightImage,
  href: "/blog/nameless-art-school",
}));

export default function Insights({ articles = defaultArticles }) {
  const [start, setStart] = useState(0);
  const visible = articles.length
    ? Array.from({ length: Math.min(3, articles.length) }, (_, index) => articles[(start + index) % articles.length])
    : [];

  function move(direction) {
    setStart((index) => (index + direction + articles.length) % articles.length);
  }

  return (
    <section className="medi-insights" aria-labelledby="medi-insights-title">
      <div className=  "container-xxl  medi-insights-container">
        <h2 id="medi-insights-title">Medical Advice and News</h2>
        <p className="medi-insights-intro">Read our notes on eye care, women’s health, and clinic updates.</p>
        
        <div className="medi-insights-carousel" role="region" aria-roledescription="carousel" aria-label="Latest insights">
          <button type="button" className="medi-insights-arrow medi-insights-previous" aria-label="Previous insight" aria-controls="medi-insights-grid" disabled={articles.length < 2} onClick={() => move(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 5-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div id="medi-insights-grid" className="medi-insights-grid">
            {visible.map((article) => (
              <article className="medi-insight-card" key={article.id}>
                <div className="medi-insight-image">
                  <Image src={article.image} alt={article.title} fill sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) 42vw, 33vw" />
                </div>
                <div className="medi-insight-copy">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <Link href="#" className="btn medi-insight-more" aria-label={`Learn more about ${article.title}`}>Learn More</Link>
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="medi-insights-arrow medi-insights-next" aria-label="Next insight" aria-controls="medi-insights-grid" disabled={articles.length < 2} onClick={() => move(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 5 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="visually-hidden" aria-live="polite" aria-atomic="true">{articles.length ? `First insight: ${(start % articles.length) + 1} of ${articles.length}` : "No insights available."}</span>
        </div>
      </div>
    </section>
  );
}
