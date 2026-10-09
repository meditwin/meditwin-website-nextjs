import Image from "next/image";
import Link from "next/link";
import { servicesByCategory } from "../../../data/services";
import styles from "./uv-eyewear-related-services.module.css";

export default function UvEyewearRelatedServices() {
  const related = servicesByCategory.optical.filter(
    (service) => service.slug !== "uv-sunglasses"
  );

  return (
    <section className={styles.section} aria-labelledby="uv-eyewear-related-services-title">
      <div className={styles.container}>
        <h2 id="uv-eyewear-related-services-title">Our Related Optical Services</h2>
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
