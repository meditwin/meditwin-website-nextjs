"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./gallery-showcase.module.css";

const galleryImages = [
  { src: "/images/gallery/img1.jpg", alt: "Care-n-Cure Clinic gallery image 1" },
  { src: "/images/gallery/img2.jpg", alt: "Care-n-Cure Clinic gallery image 2" },
  { src: "/images/gallery/img3.jpg", alt: "Care-n-Cure Clinic gallery image 3" },
  { src: "/images/gallery/img4.jpg", alt: "Care-n-Cure Clinic gallery image 4" },
  { src: "/images/gallery/img5.jpg", alt: "Care-n-Cure Clinic gallery image 5" },
  { src: "/images/gallery/img6.png", alt: "Care-n-Cure Clinic gallery image 6" },
  { src: "/images/gallery/img7.png", alt: "Care-n-Cure Clinic gallery image 7" },
  { src: "/images/gallery/img8.png", alt: "Care-n-Cure Clinic gallery image 8" },
  { src: "/images/gallery/img9.png", alt: "Care-n-Cure Clinic gallery image 9" },
  { src: "/images/gallery/img10.jpeg", alt: "Care-n-Cure Clinic gallery image 10" },
  { src: "/images/gallery/img11.jpeg", alt: "Care-n-Cure Clinic gallery image 11" },
  { src: "/images/gallery/img12.jpeg", alt: "Care-n-Cure Clinic gallery image 12" },
  { src: "/images/gallery/img13.jpeg", alt: "Care-n-Cure Clinic gallery image 13" },
  { src: "/images/gallery/img14.jpeg", alt: "Care-n-Cure Clinic gallery image 14" },
  { src: "/images/gallery/img15.jpeg", alt: "Care-n-Cure Clinic gallery image 15" },
  { src: "/images/gallery/img16.jpeg", alt: "Care-n-Cure Clinic gallery image 16" },
  { src: "/images/gallery/img17.jpeg", alt: "Care-n-Cure Clinic gallery image 17" },
  { src: "/images/gallery/img18.jpeg", alt: "Care-n-Cure Clinic gallery image 18" },
];

export default function GalleryShowcase() {
  const [visibleCount, setVisibleCount] = useState(9);

  return (
    <section
      className={styles.section}
      aria-labelledby="gallery-showcase-title"
    >
      <div className={`container ${styles.container}`}>
        <header className={styles.header}>
          <h2 id="gallery-showcase-title">
            A Glimpse Into Care-n-Cure
          </h2>

          <p>
            Explore moments from Care-n-Cure Clinic, where expert healthcare
            meets compassionate service. Take a look at our clinic, facilities,
            medical care, and the welcoming environment we create for every
            patient.
          </p>
        </header>

        <div id="gallery-showcase-images" className={styles.grid}>
          {galleryImages.slice(0, visibleCount).map((image, index) => (
            <div className={styles.card} key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.image}
                sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) 45vw, 350px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        {galleryImages.length > 9 && (
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              className={styles.loadMore}
              aria-expanded={visibleCount > 9}
              aria-controls="gallery-showcase-images"
              onClick={() => setVisibleCount(visibleCount > 9 ? 9 : galleryImages.length)}
            >
              {visibleCount > 9 ? "Show Less" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
