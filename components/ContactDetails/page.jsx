"use client";

import Image from "next/image";
import { useState } from "react";
import mapImage from "../../public/images/contact/map.png";
import styles from "./contact-details.module.css";

function ContactIcon({ type }) {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {type === "phone" ? <><path d="m5 3 4 4-2 3a14 14 0 0 0 7 7l3-2 4 4c-2 5-8 2-13-3S0 5 5 3Z" /><path d="M15 3a7 7 0 0 1 6 6M15 7a3 3 0 0 1 2 2" /></>
          : type === "address" ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>
          : <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>}
      </svg>
    </span>
  );
}

export default function ContactDetails() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("Online submission is not connected yet. Your message has not been sent. Please contact us by phone or email.");
  }

  return (
    <section className={styles.section} aria-labelledby="contact-details-title">
      <div className={styles.container}>
        <header className={styles.heading}>
          <h2 id="contact-details-title">Contact Us</h2>
          <p>Get in touch with our team. We’re here to help you with any questions about our services</p>
        </header>
        <div className={styles.columns}>
          <form className={styles.card} onSubmit={handleSubmit} aria-labelledby="contact-form-title">
            <h3 id="contact-form-title">Contact Us</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="contact-first-name">First Name</label>
                <input id="contact-first-name" name="firstName" autoComplete="given-name" placeholder="Enter your first name" required maxLength={100} />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-last-name">Last Name</label>
                <input id="contact-last-name" name="lastName" autoComplete="family-name" placeholder="Enter your last name" required maxLength={100} />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-phone">Phone Number</label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" required maxLength={30} />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Email Address</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required maxLength={254} />
              </div>
              <div className={`${styles.field} ${styles.message}`}>
                <label htmlFor="contact-message">Your Message</label>
                <textarea id="contact-message" name="message" placeholder="Leave a message" rows={4} required maxLength={5000} />
              </div>
            </div>
            <button className={`btn ${styles.submit}`} type="submit">Submit</button>
            <p className={styles.status} role="status">{status}</p>
          </form>

          <div className={styles.information}>
            <section className={styles.card} aria-labelledby="contact-information-title">
              <h3 id="contact-information-title">Contact Information</h3>
              <address className={styles.contacts}>
                <div className={styles.contactItem}>
                  <ContactIcon type="phone" />
                  <div><h4>Phone</h4><a href="tel:+917085448780">+91 70854 48780</a></div>
                </div>
                <div className={styles.contactItem}>
                  <ContactIcon type="email" />
                  <div><h4>Email</h4><a href="mailto:info@wellcareclinic.com">info@wellcareclinic.com</a></div>
                </div>
                <div className={`${styles.contactItem} ${styles.address}`}>
                  <ContactIcon type="address" />
                  <div><h4>Address</h4><p>Shop 214, Aahirini Market, 2nd Floor, Action<br className={styles.addressBreak} /> Area I, Newtown, West Bengal 700102</p></div>
                </div>
              </address>
            </section>
            <section className={`${styles.card} ${styles.hoursCard}`} aria-labelledby="opening-hours-title">
              <h3 id="opening-hours-title">Opening Hours</h3>
              <dl className={styles.hours}>
                <div><dt>Monday - Friday</dt><dd>08:00 AM - 07:00 PM</dd></div>
                <div><dt>Saturday</dt><dd>09:00 AM - 05:00 PM</dd></div>
                <div><dt>Sunday</dt><dd>Closed</dd></div>
              </dl>
            </section>
          </div>
        </div>
        <div className={styles.map}>
          <Image src={mapImage} alt="Map showing Care-n-Cure locations in the Kolkata and Newtown area"
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1425px) 80vw, 1140px" />
        </div>
      </div>
    </section>
  );
}
