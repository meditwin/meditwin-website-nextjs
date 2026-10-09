import Image from "next/image";
import missionImage from "../../public/images/about/our-mission.jpg";
import visionImage from "../../public/images/about/our-vission.jpg";
import styles from "./mission-vision.module.css";

export default function MissionVision() {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.row}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={missionImage}
                            alt="Care-n-Cure Clinic mission"
                            fill
                            className={styles.image}
                            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 45vw, 520px"
                        />
                    </div>

                    <div className={styles.content}>
                        <h2>Our Mission</h2>

                        <p>
                            Our job is to give you honest medical answers. We opened this clinic to fix the broken patient experience. You deserve a doctor who actually looks at
                            your chart and explains your diagnosis. Dr. Ghosh focuses on protecting your vision with eye exams and treatment plans. Dr. Haldar handles maternal
                            health and reproductive care with privacy and respect. We want every patient in Rajarhat-Newtown to walk out of our doors with a clear solution to their
                            health problem.
                        </p>
                    </div>
                </div>

                <div className={`${styles.row} ${styles.reverseRow}`}>
                    <div className={styles.content}>
                        <h2>Our Vision</h2>

                        <p>
                            We want to be the first place you call when your vision blurs or you need a routine checkup. We plan to keep upgrading our diagnostic tools so you never
                            have to travel far for advanced medical tests. We aim to run a local clinic where families feel safe, respected and heard for years to come.
                        </p>
                    </div>

                    <div className={styles.imageWrapper}>
                        <Image
                            src={visionImage}
                            alt="Care-n-Cure Clinic vision and patient care"
                            fill
                            className={styles.image}
                            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 45vw, 520px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
