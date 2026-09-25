"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import "./services.css";

const categories = [
  { id: "diagnostic", label: "Diagnostic Services" },
  { id: "ophthalmology", label: "Ophthalmology Eye Care" },
  { id: "gynaecology", label: "Gynecological Care" },
  { id: "optical", label: "Optical Services" },
];

const defaultServices = {
  "diagnostic": [
    {
      "title": "OCT Eye Scans",
      "image": "/images/testing/OCT-Scan.png",
      "description": "Detailed retina imaging to catch hidden eye diseases early on.",
      "href": "/services/oct-eye-scans"
    },
    {
      "title": "Regular medical checkups.",
      "image": "/images/testing/package.jpg",
      "description": "Basic tests to monitor the mother?s health and general health.",
      "href": "/services/medical-checkups"
    },
    {
      "title": "Testing Vision in the Field",
      "image": "/images/testing/specialize.png",
      "description": "Mapping your vision to detect Glaucoma fast.",
      "href": "/services/visual-field-testing"
    }
  ],
  "ophthalmology": [
    {
      "title": "Cataract Screening",
      "image": "/images/testing/cataract-screening.webp",
      "description": "We assess the severity of the cataract and plan the surgery.",
      "href": "/services/cataract-screening"
    },
    {
      "title": "Treatment of Glaucoma",
      "image": "/images/testing/glucoma.jpg",
      "description": "Check your eye pressure to prevent long-term vision loss.",
      "href": "/services/glaucoma-treatment"
    },
    {
      "title": "Diabetic Retinopathy",
      "image": "/images/testing/diabetic-retinopathy.webp",
      "description": "Checking retina blood vessels to protect your vision.",
      "href": "/services/diabetic-retinopathy"
    }
  ],
  "gynaecology": [
    {
      "title": "Pregnancy Support",
      "image": "/images/testing/pregnancy.jpg",
      "description": "Medical care from your first trimester through postpartum recovery.",
      "href": "/services/pregnancy-support"
    },
    {
      "title": "Menstrual Health",
      "image": "/images/testing/package.jpg",
      "description": "Real help for irregular cycles, PCOS and pelvic pain.",
      "href": "/services/menstrual-health"
    },
    {
      "title": "Routine Gynecology Exams",
      "image": "/images/testing/specialize.png",
      "description": "Pap smears and preventative screenings for everyday reproductive health.",
      "href": "/services/gynecology-exams"
    }
  ],
  "optical": [
    {
      "title": "Spectacles",
      "image": "/images/testing/spectacle.png",
      "description": "Prescription frames and high quality lenses for your everyday wear.",
      "href": "/services/spectacles"
    },
    {
      "title": "Contact Lenses",
      "image": "/images/testing/Contact_lense.webp",
      "description": "Fitting and supply for daily or monthly contact lenses.",
      "href": "/services/contact-lenses"
    },
    {
      "title": "UV Sunglasses",
      "image": "/images/testing/uv-glass.jpg",
      "description": "Eyewear built to block out harmful sun rays.",
      "href": "/services/uv-sunglasses"
    }
  ]
};

export default function Services({ servicesByCategory = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const category = categories[activeIndex];
  const cards = servicesByCategory[category.id] ?? defaultServices[category.id];

  function handleTabKey(event, index) {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + categories.length) % categories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = categories.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section id="services" className="medi-services-section" aria-labelledby="medi-services-title">
      <div className=  "container-xxl  medi-services-container">
        <h2 id="medi-services-title">Medical Care for Your Eyes and Body</h2>
        <p className="medi-services-intro">We do not just run tests and send you away. We diagnose the issue and build a treatment plan that fits your life.</p>
        <div className="medi-services-tabs" role="tablist" aria-label="Service categories">
          {categories.map((item, index) => (
            <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }}
              id={`service-tab-${item.id}`} type="button" role="tab"
              aria-selected={activeIndex === index} aria-controls={`service-panel-${item.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              className={`medi-service-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)} onKeyDown={(event) => handleTabKey(event, index)}>
              {item.label}
            </button>
          ))}
        </div>
        {categories.map((item) => (
          <div key={item.id} id={`service-panel-${item.id}`} role="tabpanel"
            aria-labelledby={`service-tab-${item.id}`} hidden={category.id !== item.id} tabIndex={0}>
            {category.id === item.id && (cards.length ? (
              <div className="medi-services-grid">
                {cards.map((card) => (
                  <article className="medi-service-card" key={card.href}>
                    <Image src={card.image} alt="" fill sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) 46vw, 33vw" />
                    <div className="medi-service-card-content">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <Link href={card.href} className="medi-service-details" aria-label={`View details: ${card.title}`}>
                        View Details <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="medi-services-empty">
                <h3>{item.label}</h3>
                <p>Details for this category will be available soon.</p>
              </div>
            ))}
          </div>
        ))}
        <div className="text-center medi-services-footer">
          <Link href="#" className="btn medi-services-all">View All Services</Link>
        </div>
      </div>
    </section>
  );
}
