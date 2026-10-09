import Image from "next/image";
import Link from "next/link";
import clearerVision from "../../../public/images/catarac/clearer-vision.png";
import uvEyewear from "../../../public/images/testing/uv-glass.jpg";
import styles from "./uv-eyewear-care.module.css";

const benefits = [
  "Blocks dangerous UV rays from hitting your retina.",
  "Cuts severe glare while you drive a car.",
  "Prevents early cataracts caused by direct sun exposure.",
  "Fits your exact vision prescription into the dark lenses.",
  "Protects the skin around your eyes from burning.",
];

export default function UvEyewearCare() {
  return (
    <section className={styles.section} aria-label="Polarized UV eyewear and selection">
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
            <h2>Polarized UV Eyewear</h2>
            <p>
              Polarized UV eyewear blocks harsh sunlight and stops harmful rays from burning your retina. Care-n-Cure supplies medical-grade sunglasses directly from our Newtown optical shop. Dr. Sayantan Ghosh recommends proper UV protection to prevent early cataracts and permanent macula damage.
            </p>
            <p>
              Cheap sunglasses just make things dark and force your pupils to dilate, letting more dangerous radiation inside. We provide lenses that actually filter out the damaging light. You protect your long-term eye health while driving or spending time outside in the heavy afternoon sun.
            </p>
          </div>
        </div>
        <div className={`${styles.row} ${styles.treatment}`}>
          <div className={styles.content}>
            <h2>UV Eyewear Selection</h2>
            <p>
              We check your daily outdoor habits and light sensitivity. You try on different frames in our optical store. We test the lenses to confirm they block complete UV radiation. We can also add your exact vision prescription directly into the tinted sunglass lenses.
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
              src={uvEyewear}
              alt="UV protective sunglasses"
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
