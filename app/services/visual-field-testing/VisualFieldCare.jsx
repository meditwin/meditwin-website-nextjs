import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/visualfield/Visual-field-test-for-Glaucoma.jpg";
import phaco from "../../../public/images/visualfield/glucoma-test.jpeg";
import styles from "./visual-field-care.module.css";

const benefits = [
  "Maps the exact limits of your side vision.",
  "Finds early Glaucoma symptoms before you lose your sight.",
  "Checks if high eye pressure is causing nerve damage.",
  "Takes just a fe minutes for each eye.",
  "Needs no eye drops or physical contact with the machine.",
];

export default function VisualFieldCare() {
  return (
    <section className={styles.section} aria-label="Visual field testing and side vision mapping">
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
            <h2>Visual Field Testing for Glaucoma</h2>
            <p>
              A visual field test measures how wide you can see without moving your eyes. Care-N-Cure runs this exam to check your peripheral vision. It helps us find hidden blind spots you might not notice on your own.
            </p>
            <p>
              Sr. Syantan Ghosh uses this test to catch Glaucoma early. This disease ruins your side vision overtime before it impacts your central sight. We map your full field of vision directly at our Action Area I clinic.
            </p>
          </div>
        </div>

        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Side Vision Mapping</h2>
            <p>
              You sit and look into a bowl-shaped machine. You stare straight ahead at a fixed spot. Small lights flash in different corners of the bowl. You press a handheld button every time you see a light blink. The machine records which flashes you miss.
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
