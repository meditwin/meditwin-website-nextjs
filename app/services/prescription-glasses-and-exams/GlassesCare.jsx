import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/eye-exam/eye-exam1.webp";
import glasses from "../../../public/images/testing/spectacle.png";
import styles from "./glasses-care.module.css";

const benefits = [
  "Corrects nearsightedness and farsightedness.",
  "Fixes blurred vision from severe astigmatism.",
  "Stops daily headaches from harsh screen glare.",
  "Offers a large selection of durable frames.",
  "Saves you a trip to an outside glasses store.",
];

export default function GlassesCare() {
  return (
    <section className={styles.section} aria-label="Prescription glasses, vision exams and fitting">
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
            <h2>Prescription Glasses and Exams</h2>
            <p>
              Prescription glasses correct your blurry vision and reduce daily eye strain. Care-n-Cure cuts custom lenses for patients in Newtown right inside our clinic. Dr. Sayantan Ghosh conducts a visual test to determine the exact prescription for nearsightedness, farsightedness or astigmatism.
            </p>
            <p>
              We stop the headaches caused by reading or staring at screens. You pick your frames directly from our in-house optical shop after your eye exam. You leave the building with a clear solution for your vision without traveling to a different store to buy your glasses.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Glass Fitting</h2>
            <p>
              Dr. Ghosh tests your vision using a digital phoropter. We measure the exact curve of your eye and your reading distance. You pick a frame from our shop downstairs. We cut the prescription lenses and fit them into your chosen frames before you leave.
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
              src={glasses}
              alt="Prescription spectacles and frames"
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
