import Image from "next/image";
import aboutCareImage from "../../public/images/about/about-care-n-cure.webp";
import styles from "./about-care.module.css";

const statistics = [
  
  { value: "10+", label: "Years Experience" },
  { value: "1000+", label: "Happy Patients" },
  { value: "2", label: "Specialized Doctors" },
  { value: "1", label: "In-House Optical Store" },
];

export default function AboutCare() {
  return (
    <section className={styles.section} aria-labelledby="about-care-title">
      <div className={`container ${styles.container}`}>
        <header className={styles.header}>
          <h2 id="about-care-title">About Care -N- Care?</h2>
          <p>
            Dr. Sayantan Ghosh and Dr. Arunima Haldar built this clinic to bring proper medical care to Action Area I. We treat complex eye diseases and manage women's health under one roof in Newtown.
          </p>
        </header>

        <div className={styles.imageWrapper}>
          <Image
            src={aboutCareImage}
            alt="Care-n-Cure clinic pharmacy and reception team"
            className={styles.image}
            fill
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 720px, 1140px"
          />
        </div>

        <dl className={styles.statistics}>
          {statistics.map(({ value, label }) => (
            <div className={styles.statistic} key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
