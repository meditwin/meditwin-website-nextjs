"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ophthalmologyServices } from "./ophthalmology-services";
import styles from "./service-catalog.module.css";

const categories = [
  { id: "diagnostic", label: "Diagnostic Services" },
  { id: "ophthalmology", label: "Ophthalmology Care" },
  { id: "gynaecology", label: "Gynaecological Care" },
  { id: "optical", label: "Optical Services" },
];

const services = {
  diagnostic: [
    {
      title: "OCT Eye Scans",
      image: "/images/testing/OCT-Scan.png",
      description: "Detailed retinal imaging that helps identify hidden eye conditions early.",
      slug: "oct-eye-scans",
    },
    {
      title: "Blood Testing",
      image: "/images/testing/blood-test.jpg",
      description: "Convenient diagnostic blood tests to support accurate treatment decisions.",
      slug: "blood-testing",
    },
    {
      title: "Visual Field Testing",
      image: "/images/testing/specialize.png",
      description: "Precise vision mapping to detect glaucoma and other field-of-view changes.",
      slug: "visual-field-testing",
    },
  ],
  ophthalmology: ophthalmologyServices,
  gynaecology: [
    {
      title: "Pregnancy Care",
      image: "/images/testing/pregnancy.jpg",
      description: "Thoughtful medical guidance from early pregnancy through postpartum recovery.",
      slug: "prenatal-and-postpartum-care",
    },
    {
      title: "Menstrual Health",
      image: "/images/testing/package.jpg",
      description: "Personalised support for irregular cycles, PCOS, and pelvic discomfort.",
      slug: "cycle-management-and-pcos",
    },
    {
      title: "Preventive Screening",
      image: "/images/testing/specialize.png",
      description: "Routine examinations and screenings that support long-term reproductive health.",
      slug: "preventative-screenings",
    },
  ],
  optical: [
    {
      title: "Prescription Spectacles",
      image: "/images/testing/spectacle.png",
      description: "Comfortable frames and quality prescription lenses for clear everyday vision.",
      slug: "prescription-glasses-and-exams",
    },
    {
      title: "Contact Lenses",
      image: "/images/testing/Contact_lense.webp",
      description: "Professional fitting and guidance for comfortable daily or monthly lenses.",
      slug: "contact-lens-fitting",
    },
    {
      title: "UV Protection Glasses",
      image: "/images/testing/uv-glass.jpg",
      description: "Protective eyewear designed to reduce exposure to harmful ultraviolet rays.",
      slug: "polarized-uv-eyewear",
    },
  ],
};

export default function ServicesCatalog() {
  const [activeIndex, setActiveIndex] = useState(1);
  const tabRefs = useRef([]);
  const activeCategory = categories[activeIndex];

  function selectTab(index) {
    setActiveIndex(index);
  }

  function handleTabKeyDown(event, index) {
    let nextIndex;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + categories.length) % categories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = categories.length - 1;
    else return;

    event.preventDefault();
    selectTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className={styles.section} aria-labelledby="services-catalog-title">
      <div className={`container ${styles.container}`}>
        <h2 id="services-catalog-title">
          <span>Find Your Specialist Precision Care for</span>
          <span>Every Need</span>
        </h2>

        <div className={styles.tabs} role="tablist" aria-label="Service categories">
          {categories.map((category, index) => (
            <button
              className={`${styles.tab}${activeIndex === index ? ` ${styles.activeTab}` : ""}`}
              id={`catalog-tab-${category.id}`}
              key={category.id}
              type="button"
              role="tab"
              aria-controls={`catalog-panel-${category.id}`}
              aria-selected={activeIndex === index}
              tabIndex={activeIndex === index ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div
          className={styles.panel}
          id={`catalog-panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`catalog-tab-${activeCategory.id}`}
          key={activeCategory.id}
        >
          <div className={styles.grid}>
            {services[activeCategory.id].map((service) => (
              <article className={styles.card} key={service.slug}>
                <Image
                  src={service.image}
                  alt=""
                  className={styles.cardImage}
                  fill
                  sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) 45vw, 350px"
                />
                <div className={styles.scrim} aria-hidden="true" />
                <div className={styles.cardContent}>
                  <h3>
                    {["advanced-cataract-surgery", "oct-eye-scans", "visual-field-testing", "glaucoma-management", "diabetic-retinopathy", "prenatal-and-postpartum-care", "cycle-management-and-pcos", "preventative-screenings", "prescription-glasses-and-exams", "contact-lens-fitting", "polarized-uv-eyewear"].includes(service.slug) ? (
                      <Link
                        href={`/services/${service.slug}`}
                        className={styles.titleLink}
                      >
                        {service.title}
                      </Link>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <p>{service.description}</p>
                  <Link
                    href={
                      ["advanced-cataract-surgery", "oct-eye-scans", "visual-field-testing", "glaucoma-management", "diabetic-retinopathy", "prenatal-and-postpartum-care", "cycle-management-and-pcos", "preventative-screenings", "prescription-glasses-and-exams", "contact-lens-fitting", "polarized-uv-eyewear"].includes(service.slug)
                        ? `/services/${service.slug}`
                        : "#"
                    }
                    className={styles.details}
                    aria-label={`View details about ${service.title}`}
                  >
                    View Details <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
