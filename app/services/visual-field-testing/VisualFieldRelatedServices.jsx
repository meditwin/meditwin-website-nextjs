"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { servicesByCategory } from "../../../data/services";
import styles from "./visual-field-related-services.module.css";

export default function VisualFieldRelatedServices({
  currentService = "visual-field-testing",
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  const related = servicesByCategory.diagnostic.filter(
    (service) => service.slug !== currentService
  );

  return (
    <section
      className={styles.section}
      aria-labelledby={`${id}-heading`}
    >
      <div className={styles.container}>
        <h2 id={`${id}-heading`}>
          Our Related Eye Care Services
        </h2>

        <div
          id={`${id}-cards`}
          className={styles.grid}
        >
          {related.map((service, index) => (
            <article
              className={styles.card}
              key={service.slug}
              hidden={!expanded && index >= 3}
            >
              <Image
                src={service.image}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 767px) 45vw, (max-width: 1425px) 26vw, 371px"
              />

              <div className={styles.content}>
                <h3>{service.slug === "oct-eye-scans" ? "OCT Retina Scan" : service.title.replace(/\.$/, "")}</h3>

                <p>{service.description}</p>

                <Link
                  href={service.href}
                  className={styles.details}
                  aria-label={`View details about ${service.title}`}
                >
                  View Details
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {related.length > 3 && (
          <div className={styles.actions}>
            <button
              type="button"
              className={`btn ${styles.toggle}`}
              aria-expanded={expanded}
              aria-controls={`${id}-cards`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "View All Services"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}