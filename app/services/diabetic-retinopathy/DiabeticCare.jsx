import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/diabetic/diabetic1.jpg";
import phaco from "../../../public/images/diabetic/diabetic2.webp";
import styles from "./diabetic-care.module.css";

const benefits = [
  "Finds leaking blood vessels inside your retina.",
  "Stops high blood sugar from causing sudden blindness.",
  "Checks for swelling in your macula.",
  "Sets a strict timeline for your future eye checks.",
  "Connects your eye health directly to your diabetes plan.",
];

export default function DiabeticCare() {
  return (
    <section className={styles.section} aria-label="Diabetic retinopathy care and treatment">
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
            <h2>Diabetic Retinopathy</h2>
            <p>
              Diabetic retinopathy care protects your eyes from high blood sugar damage. Care-n-Cure runs these specific exams in Newtown for patients with diabetes. Dr. Sayantan Ghosh looks directly at your retina blood vessels.
            </p>
            <p>
              Diabetes ruins the tiny vessels in your eyes over time. We track the bleeding and swelling before it causes sudden blindness. You get a direct plan to save your vision. With complete care in one place the treatment becomes easier and you get the best diabetic retinopathy care.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>How We Manage Diabetic Eye Damage</h2>
            <p>
              We put drops in your eyes to widen the pupils. Dr. Ghosh uses a bright light and a special lens to inspect your retina. He looks for leaking vessels or swelling. We set up a treatment plan to stop the bleeding and protect your sight.
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
              src={phaco}
              alt="Eye procedure performed in an operating room"
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
