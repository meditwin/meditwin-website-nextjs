"use client";

import Image from "next/image";
import { useState } from "react";
import instrumentImage from "../../public/images/tool/instrument1.png";
import "./instrument.css";

const defaultImages = [{ src: instrumentImage, alt: "Optical Coherence Tomography (OCT) machine" }];
const benefits = [
  "Catches eye diseases early.",
  "Tracks your treatment progress.",
  "Fast and totally painless.",
  "Detailed medical images.",
  "Custom treatment plans.",
];

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d={direction === "previous" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Instrument({ images = defaultImages }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length ? images : defaultImages;
  const currentIndex = activeIndex % slides.length;
  const canSlide = slides.length > 1;

  function changeSlide(offset) {
    setActiveIndex((index) => (index + offset + slides.length) % slides.length);
  }

  return (
    <section className="medi-instrument" aria-labelledby="medi-instrument-title">
      <div className=  "container-xxl  medi-instrument-container">
        <div className="medi-instrument-grid">
          <div className="medi-instrument-gallery" role="group" aria-label="Instrument images">
            <div className="medi-instrument-image">
              <Image src={slides[currentIndex].src} alt={slides[currentIndex].alt} fill
                sizes="(max-width: 767px) 75vw, (max-width: 1099px) 42vw, 55vw" />
            </div>
            <button type="button" className="medi-instrument-arrow medi-instrument-previous"
              aria-label="Previous instrument image" disabled={!canSlide} onClick={() => changeSlide(-1)}>
              <Arrow direction="previous" />
            </button>
            <button type="button" className="medi-instrument-arrow medi-instrument-next"
              aria-label="Next instrument image" disabled={!canSlide} onClick={() => changeSlide(1)}>
              <Arrow direction="next" />
            </button>
            <span className="visually-hidden" aria-live="polite" aria-atomic="true">
              Image {currentIndex + 1} of {slides.length}
            </span>
          </div>
          <div className="medi-instrument-copy">
            <h2 id="medi-instrument-title">Our Latest Instrument</h2>
            <p>Deep Retinal Imaging<br />We just brought in an Optical Coherence Tomography machine. This OCT scanner gives us a detailed, cross-section view of your retina so we can spot problems before they ruin your vision.</p>
            <h3>How the OCT scan helps:</h3>
            <ul>
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
                    <path d="M13 7.5v.5a5.5 5.5 0 1 1-3.2-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="m5 7 2.5 2.5L14 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
