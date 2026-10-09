import ContactLensBanner from "./ContactLensBanner";
import ContactLensCare from "./ContactLensCare";
import ContactLensRelatedServices from "./ContactLensRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./contact-lens-fitting.module.css";

export const metadata = {
  title: "Contact Lens Fitting",
  description: "Contact lens fitting, cornea measurements and safe lens handling guidance with Dr. Sayantan Ghosh at Care-n-Cure in Newtown.",
};

export default function ContactLensFittingPage() {
  return (
    <main className={styles.main}>
      <ContactLensBanner />
      <ContactLensCare />
      <ContactLensRelatedServices />
      <DoctorTalk />
    </main>
  );
}
