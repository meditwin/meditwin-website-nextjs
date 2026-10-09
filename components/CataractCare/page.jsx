import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../public/images/catarac/clearer-vision.png";
import phaco from "../../public/images/catarac/phaco.png";
import styles from "./cataract-care.module.css";

const benefits = [
  "Measures the exact thickness of your cloudy eye lens.",
  "Checks how much vision you lose at night.",
  "Finds the right timeline for your lens surgery",
  "Takes measurements for your artificial replacement lens.",
  "Answers your direct questions about the surgery process.",
];

export default function CataractCare() {
  return (
    <section className={styles.section} aria-label="Cataract care and treatment">
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
            <h2>Clearer Vision. Better Quality of Life.</h2>
            <p>
              A cataract evaluation checks the cloudy lens inside your eye. Care-n-Cure runs this exam in Newtown to measure how much the cataract blocks your daily vision. Dr. Sayantan Ghosh handles the testing directly with the latest technology and methods.
            </p>
            <p>
              We check your visual sharpness and look at the lens structure. We tell you exactly how bad the clouding is and when you need surgery. You get straight facts about your eye health. Further, you can discuss how you wish to tackle it.
            </p>
          </div>
        </div>

        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Phacoemulsification</h2>
            <p>
              Dr. Ghosh uses a slit lamp microscope to look inside your eye. He measures the size and the thickness of the cataract. We measure your exact vision loss to plan the right time for surgical removal. You leave with a clear timeline.
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
