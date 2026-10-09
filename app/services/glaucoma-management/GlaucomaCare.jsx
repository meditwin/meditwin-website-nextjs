import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/glucoma/glucoma1.webp";
import phaco from "../../../public/images/glucoma/glucoma2.jpg";
import styles from "./glaucoma-care.module.css";

const benefits = [
  "Lowers your internal eye pressure with daily drops.",
  "Stops the disease from destroying your optic nerve.",
  "Saves your peripheral vision from permanent damage.",
  "Tests your nerve health regularly through pressure checks.",
  "Adjusts your medication if the pressure stays high.",
];

export default function GlaucomaCare() {
  return (
    <section className={styles.section} aria-label="Glaucoma management and treatment">
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
            <h2>Glaucoma Management</h2>
            <p>
              Glaucoma management stops high eye pressure from ruining your optic nerve. Care-n-Cure handles this treatment in Newtown to prevent permanent vision loss. Dr. Sayantan Ghosh will check your eye pressure when you come in. With his experience, he makes sure to tell you what’s actually up.
            </p>
            <p>
              Glaucoma steals your side vision slowly. We catch the pressure spikes early and give you a strict medical plan. You get daily eye drops or medications to protect your eyesight from further damage. We regularly follow up to ensure you are well looked after.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>Glaucoma Treatment</h2>
            <p>
              Dr. Ghosh runs a quick pressure test using a tonometer. He checks the nerve at the back of your eye for damage. If your pressure is high, he prescribes daily eye drops. We’ll monitor your progress with regular clinic visits to ensure the drops are working.
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
