import Image from "next/image";
import bookingBanner from "../../public/images/booking/booking-banner.jpg";
import styles from "./booking-banner.module.css";

export default function BookingBanner() {
    return (
        <section className={styles.banner} aria-labelledby="booking-heading">
            <Image src={bookingBanner} alt="Planning an appointment using a laptop calendar" fill preload sizes="100vw" className={styles.image} />
            <div className={styles.overlay} aria-hidden="true" />
            <h1 id="booking-heading" className={styles.title}>
                Book Appointment
            </h1>
        </section>
    );
}
