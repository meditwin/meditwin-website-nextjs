import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/oct/oct-retina1webp.webp";
import phaco from "../../../public/images/oct/oct-retina2.png";
import styles from "./oct-care.module.css";

const benefits = [
  "Catches Glaucoma early by measuring your optic nerve.",
  "Finds muscular degeneration before you lose your sight.",
  "Checks your blood vessels for damage if you have diabetes.",
  "Take clear medical pictures without touching your eyeball.",
  "Give you direct answers during the exact same visit.",
];

export default function OctCare() {
  return (
    <section className={styles.section} aria-label="OCT retina examination and scanning">
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
            <h2>OCT Retina Examination</h2>
            <p>
              OCT scans produce detailed 3D images of the back of the eye. This machine is used at Care-N-Cure in Newtown to measure the thickness of your retina. It helps us see parts of your eye that a normal exam misses.
            </p>
            <p>
              Dr. Sayantan Ghosh looks at these pictures to catch eye problems before your vision gets blurry. You do not need to do anything to prepare for this test. We run the scan right inside our Action Area I clinic during your evening visit.
            </p>
          </div>
        </div>

        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>OCT Retina Scaning</h2>
            <p>
              You sit in front of the machine and rest your chin on a support pad. The scanner uses regular light waves to take pictures of your retina. The machine never touches your eye. The whole process takes about five minutes and does not hurt at all.
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
