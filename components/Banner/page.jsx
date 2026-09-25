"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import bannerImage from "../../public/images/banner/banner-img.png";
import "./banner.css";

export default function Banner({ storyUrl }) {
  function showStoryNotice() {
    Swal.fire({
      title: "Our story",
      text: "Our clinic story video will be available soon.",
      icon: "info",
      confirmButtonText: "Got it",
      confirmButtonColor: "#003eaa",
    });
  }

  return (
    <section className="medi-banner" aria-labelledby="medi-banner-title">
      <div className="medi-banner-background" aria-hidden="true">
        <Image src={bannerImage} alt="" fill preload sizes="100vw" className="medi-banner-image" />
      </div>
      <div className="medi-banner-overlay" aria-hidden="true" />
      <div className=  "container-xxl  medi-banner-content">
        <h1 id="medi-banner-title" className="medi-banner-title">
          Trusted Eye Care and Women’s
          <br className="medi-banner-break" /> Health Care in Newtown 

        </h1>
        <p className="medi-banner-description">
          Dr. Sayantan Ghosh (Eye Surgeon) and Dr. Arunima Haldar (Gynecologist) provide specialized medical care in Action Area I.<br />Visit our local New Town clinic for comprehensive eye care, women's health consultations, and clinical treatments.
        </p>
        <div className="d-flex justify-content-center flex-wrap medi-banner-actions">
          <Link href="#" className="btn medi-banner-appointment">
            Book Appointment
          </Link>
          {storyUrl ? (
            <a href="#" className="btn medi-banner-story">Watch Our Story</a>
          ) : (
            <button type="button" className="btn medi-banner-story" onClick={showStoryNotice}>
              Watch Our Story
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
