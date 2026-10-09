import Image from "next/image";
import Link from "next/link";
import care from "../../../public/images/maternal/maternal-left.jpg";
import treatment from "../../../public/images/maternal/maternal-right.jpg";
import styles from "./prenatal-care.module.css";

const benefits = [
  "Tracks the baby's weight and heart rate.",
  "Monitors the mother's blood pressure to stop complications.",
  "Sets a strict timeline for required blood tests.",
  "Checks your physical healing weeks after delivery.",
  "Gives you direct access to a local gynecologist.",
];

export default function PrenatalCare() {
  return (
    <section className={styles.section} aria-label="Prenatal and postpartum care and pregnancy management">
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.imageFrame}>
            <Image
              src={care}
              alt="Maternal health consultation"
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 40vw, 558px"
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h2>Prenatal and Postpartum Care</h2>
            <p>
              Prenatal and postpartum care tracks your physical health from a positive pregnancy test through delivery and your body&apos;s recovery. Care-n-Cure runs these medical checks in Newtown to keep you and the baby safe. Dr. Arunima Haldar manages your appointments directly.
            </p>
            <p>
              We monitor fetal growth and check your vital signs at every stage. We also guide your physical recovery after birth. You get clear medical facts about your body changes. You leave the clinic knowing exactly what to do next for your daily routine.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Pregnancy Management</h2>
            <p>
              You meet Dr. Haldar in our Action Area I clinic. She checks your blood pressure and the baby&apos;s heart rate. We set a schedule for ultrasounds and blood work. After birth, we check your healing progress and monitor your iron levels to stop extreme fatigue.
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
              alt="Pregnancy monitoring and maternal care"
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
