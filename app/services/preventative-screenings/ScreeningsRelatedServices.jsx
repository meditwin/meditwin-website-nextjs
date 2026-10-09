import Image from "next/image";
import Link from "next/link";
import { servicesByCategory } from "../../../data/services";
import styles from "./screenings-related-services.module.css";

export default function ScreeningsRelatedServices() {
  const related = servicesByCategory.gynaecology.filter(
    (service) => service.slug !== "gynecology-exams"
  );

  return (
    <section className={styles.section} aria-labelledby="screenings-related-services-title">
      <div className={styles.container}>
        <h2 id="screenings-related-services-title">Our Related Gynecological Care Services</h2>
        <div className={styles.grid}>
          {related.map((service) => (
            <article className={styles.card} key={service.slug}>
              <Image
                src={service.image}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 767px) 45vw, (max-width: 1425px) 26vw, 371px"
              />
              <div className={styles.content}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={service.href} className={styles.details} aria-label={`View details about ${service.title}`}>
                  View Details <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
