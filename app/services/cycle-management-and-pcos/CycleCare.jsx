import Image from "next/image";
import Link from "next/link";
import care from "../../../public/images/maternal/maternal-left.jpg";
import treatment from "../../../public/images/maternal/maternal-right.jpg";
import styles from "./cycle-care.module.css";

const benefits = [
  "Finds out the real medical cause of missed periods.",
  "Uses a specific drug to manage symptoms of PCOS.",
  "Stops extreme pelvic pain and heavy bleeding.",
  "A blood test done precisely will check your hormones.",
  "Lays out a clear plan for your reproductive system.",
];

export default function CycleCare() {
  return (
    <section className={styles.section} aria-label="Cycle management and PCOS treatment">
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
            <h2>Cycle Management and PCOS</h2>
            <p>
              Cycle management deals with the root cause of missed periods, heavy bleeding and severe pelvic pain. Newtown patients with PCOS and irregular cycles can get these diagnostic checks at Care-n-Cure. Dr. Arunima Haldar reviews your symptoms directly to find the exact medical issue.
            </p>
            <p>
              We stop guessing and run the right hormone tests. You get a targeted medical plan instead of generic advice to lose weight. We focus on fixing the pain and regulating your menstrual cycle to protect your long-term reproductive health.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Irregular Cycles Treatment</h2>
            <p>
              You sit down with Dr. Haldar to discuss your exact symptoms. She checks your medical history and orders specific blood work to look at your hormone levels. We use those lab results to prescribe medication that regulates your cycle and stops severe physical cramping.
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
