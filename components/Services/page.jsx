"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { serviceCategories, servicesByCategory } from "../../data/services";
import "./services.css";

export default function Services({ showViewAll = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  const category = serviceCategories[activeIndex];
  const cards = servicesByCategory[category.id];

  function handleTabKey(event, index) {
    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % serviceCategories.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + serviceCategories.length) %
        serviceCategories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = serviceCategories.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      id="services"
      className="medi-services-section"
      aria-labelledby="medi-services-title"
    >
      <div className="container-xxl medi-services-container">
        <h2 id="medi-services-title">
          Medical Care for Your Eyes and Body
        </h2>

        <p className="medi-services-intro">
          We do not just run tests and send you away. We diagnose the issue
          and build a treatment plan that fits your life.
        </p>

        <div
          className="medi-services-tabs"
          role="tablist"
          aria-label="Service categories"
        >
          {serviceCategories.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`service-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`service-panel-${item.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              className={`medi-service-tab${
                activeIndex === index ? " is-active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          id={`service-panel-${category.id}`}
          role="tabpanel"
          aria-labelledby={`service-tab-${category.id}`}
        >
          <div className="medi-services-grid">
            {cards.map((card) => (
              <article
                className="medi-service-card"
                key={card.slug}
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) 46vw, 33vw"
                />

                <div className="medi-service-card-content">
                  <h3>{card.title}</h3>

                  <p>{card.description}</p>

                  <Link
                    href={card.href}
                    className="medi-service-details"
                    aria-label={`View details: ${card.title}`}
                  >
                    View Details
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {showViewAll && (
          <div className="text-center medi-services-footer">
            <Link href="/services" className="btn medi-services-all">
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}