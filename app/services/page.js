import ServicesBanner from "../../components/ServicesBanner/page";
// import ServicesCatalog from "../../components/ServicesCatalog/page";
import Services from "../../components/Services/page";
import AppointmentSteps from "../../components/AppointmentSteps/page";
import Testimonials from "../../components/Testimonials/page";
import styles from "./services.module.css";

export const metadata = {
  title: "Our Services",
  description:
    "Explore eye care, gynecology, diagnostic, and optical services at Care-n-Cure Clinic.",
};

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <ServicesBanner />
      {/* <ServicesCatalog /> */}
      <Services showViewAll={false} />
      <AppointmentSteps />
      <Testimonials />
    </main>
  );
}
