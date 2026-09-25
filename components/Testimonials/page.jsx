"use client";

import { useState } from "react";
import "./testimonials.css";

const testimonials = [
  { name: "Anita Sharma", detail: "New Mother (Gynecology)", quote: "The gynecology team provided incredible support throughout my pregnancy journey. The doctors were compassionate and attentive at every step." },
  { name: "Ravi Iyer", detail: "IT Professional (Ophthalmology)", quote: "I underwent LASIK eye surgery here and the results have been life-changing. I can now work long hours without glasses or strain." },
  { name: "Meera Banerjee", detail: "Housewife (Gynecology)", quote: "I received excellent treatment for my PCOD issues. The doctor explained everything with patience and guided me with the right treatment." },
];

function Arrow({ previous }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={previous ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const orderedTestimonials = testimonials.map((_, index) => testimonials[(startIndex + index) % testimonials.length]);

  function move(direction) {
    setStartIndex((index) => (index + direction + testimonials.length) % testimonials.length);
  }

  return (
    <section className="medi-testimonials" aria-labelledby="medi-testimonials-title">
      <div className=  "container-xxl  medi-testimonials-container">
        <h2 id="medi-testimonials-title">Word of Mouth</h2>
        <p className="medi-testimonials-intro">Real feedback from people who walked through our clinic doors.</p>
        <div className="medi-testimonials-carousel" role="region" aria-roledescription="carousel" aria-label="Patient testimonials">
          <button className="medi-testimonials-arrow medi-testimonials-previous" type="button" aria-label="Previous testimonial" aria-controls="medi-testimonials-cards" onClick={() => move(-1)}>
            <Arrow previous />
          </button>
          <div id="medi-testimonials-cards" className="medi-testimonials-grid">
            {orderedTestimonials.map((testimonial) => (
              <figure className="medi-testimonial-card" key={testimonial.name}>
                <div className="medi-testimonial-stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg key={index} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="m12 2 3.1 6.3 7 1-5.1 4.9 1.2 7L12 17.9l-6.2 3.3 1.2-7L1.9 9.3l7-1Z" />
                    </svg>
                  ))}
                </div>
                <blockquote><p>&quot;{testimonial.quote}&quot;</p></blockquote>
                <figcaption className="medi-testimonial-person">
                  <span className="medi-testimonial-avatar" aria-hidden="true">{testimonial.name[0]}</span>
                  <div><p className="medi-testimonial-name">{testimonial.name}</p><p className="medi-testimonial-detail">{testimonial.detail}</p></div>
                </figcaption>
              </figure>
            ))}
          </div>
          <button className="medi-testimonials-arrow medi-testimonials-next" type="button" aria-label="Next testimonial" aria-controls="medi-testimonials-cards" onClick={() => move(1)}>
            <Arrow />
          </button>
          <span className="visually-hidden" aria-live="polite" aria-atomic="true">First testimonial: {testimonials[startIndex].name}, {startIndex + 1} of {testimonials.length}.</span>
        </div>
      </div>
    </section>
  );
}
