import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/lens/lens1.jpg";
import contactLenses from "../../../public/images/testing/Contact_lense.webp";
import styles from "./contact-lens-care.module.css";

const benefits = [
  "Measures your exact eye curve for a safe fit.",
  "Checks your tear film to stop severe dryness.",
  "Finds the right daily or monthly disposable brand.",
  "Teaches you safe ways to insert and remove contacts.",
  "Prevents painful cornea scratches and hidden eye infections.",
];

export default function ContactLensCare() {
  return (
    <section className={styles.section} aria-label="Contact lens measurements and fitting">
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.imageFrame}>
            <Image
              src={clearerVision}
              alt="Patient receiving an eye examination with a slit lamp"
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 40vw, 558px"
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h2>Contact Lens Fitting</h2>
            <p>
              A contact lens fitting measures your eye surface to find the exact brand and shape for your daily wear. Care-n-Cure runs these specific measurements in Newtown to make sure your lenses do not scratch your eyes. Dr. Sayantan Ghosh checks your tear production and cornea curve.
            </p>
            <p>
              Wearing the wrong contacts causes severe dryness and dangerous eye infections. We prescribe daily or monthly disposable lenses that fit your lifestyle. You get clear vision without the hassle of glasses falling down your face during heavy exercise.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Contact Lenses Fitting</h2>
            <p>
              We measure your cornea using a keratometer to find the exact base curve. Dr. Ghosh checks your tear film to prevent severe dry eyes. We place trial lenses on your eyes to check the fit. We then teach you how to insert and remove them safely.
            </p>
            <ul className={styles.benefits}>
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M13.5 7.3A5.5 5.5 0 1 1 10 2.9" />
                    <path d="m5 7.5 2.5 2.5L14 3.5" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
            <Link href="/contact" className={`btn ${styles.book}`}>Book Now</Link>
          </div>
          <div className={styles.imageFrame}>
            <Image
              src={contactLenses}
              alt="Contact lenses for daily wear"
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 40vw, 558px"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
