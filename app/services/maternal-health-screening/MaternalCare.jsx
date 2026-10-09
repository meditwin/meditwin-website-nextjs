import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/maternal/maternal-left.jpg";
import phaco from "../../../public/images/maternal/maternal-right.jpg";
import styles from "./maternal-care.module.css";

const benefits = [
  "Tracks the baby’s size at every appointment.",
  "Catches high blood pressure fast.",
  "Finds low iron levels so you stop feeling exhausted.",
  "Gives you time to ask the doctor about body pain.",
  "Builds a medical record for your delivery day.",
];

export default function MaternalCare() {
  return (
    <section className={styles.section} aria-label="Maternal health screening and pregnancy progress">
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
            <h2>Maternal Health Screening</h2>
            <p>
              A maternal health screening monitors the mother and the baby during pregnancy. Care-N-Cure runs these checks to catch problems before they turn into emergencies. We check how your baby is growing and test the levels in your blood.
            </p>
            <p>
              Dr. Arunima Haldar handles your visits. You talk to her directly about your symptoms. We follow your progress from the first positive pregnancy test until it is time to deliver the baby. Overall you get to have a smooth preganncy with everything at once place.
            </p>
          </div>
        </div>

        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Pregnancy Progress Check</h2>
            <p>
              You meet with Dr. Haldar at our Action Area I clinic. She checks your blood pressure and weighs you. She listens to the baby’s heart rate. Sometimes we take a blood sample to look for low iron or high blood sugar and we also review lab ultrasound reports.
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
            <Link href="#" className={`btn ${styles.book}`}>Book Now</Link>
          </div>
          <div className={styles.imageFrame}>
            <Image
              src={phaco}
              alt="Cataract procedure performed in an operating room"
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
