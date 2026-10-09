import ContactBanner from "../../components/ContactBanner/page";
import ContactDetails from "../../components/ContactDetails/page";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Care-n-Cure Clinic in Newtown, West Bengal.",
};

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <ContactBanner />
      <ContactDetails />
    </main>
  );
}
