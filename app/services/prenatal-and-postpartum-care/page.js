import PrenatalBanner from "./PrenatalBanner";
import PrenatalCare from "./PrenatalCare";
import PrenatalRelatedServices from "./PrenatalRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./prenatal-and-postpartum-care.module.css";

export const metadata = {
  title: "Prenatal and Postpartum Care",
  description: "Prenatal and postpartum care with Dr. Arunima Haldar at Care-n-Cure in Newtown, from pregnancy through recovery after birth.",
};

export default function PrenatalAndPostpartumCarePage() {
  return (
    <main className={styles.main}>
      <PrenatalBanner />
      <PrenatalCare />
      <PrenatalRelatedServices />
      <DoctorTalk />
    </main>
  );
}
