import Image from "next/image";
import Link from "next/link";
import care from "../../../public/images/screening/screening1.jpg";
import treatment from "../../../public/images/screening/screening2.png";
import styles from "./screenings-care.module.css";

const benefits = [
  "Checks your cervix for early signs of disease.",
  "Tests for hidden infections that cause pelvic pain.",
  "Tracks the baseline health of your reproductive organs.",
  "Uses a private room for your physical exam.",
  "Delivers lab results directly with a clear explanation.",
];

export default function ScreeningsCare() {
  return (
    <section className={styles.section} aria-label="Preventative screenings and gynecological exams">
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.imageFrame}>
            <Image
              src={care}
              alt="Gynecological health consultation"
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 40vw, 558px"
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h2>Preventative Screenings</h2>
            <p>
              Screenings are tests to check for hidden diseases and infections in your reproductive system. Care-n-Cure performs these annual exams in Newtown to catch problems early. Dr. John Arunima Haldar herself conducts physical examinations and laboratory tests.
            </p>
            <p>
              Regular checkups prevent small problems from becoming permanent damage. We do pap smears, pelvic exams, check for common infections. You get straight answers about your body in a private setting. We build a clear record of your health to keep your reproductive system safe for the future.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>How We Run Gynecological Exams</h2>
            <p>
              Dr. Haldar performs a physical pelvic exam in a closed private room. She takes a quick swab for a Pap smear to look for early cervical cell changes. We send the tissue samples to a lab and call you directly when the exact results come back.
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
              src={treatment}
              alt="Gynecological examination and treatment"
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
