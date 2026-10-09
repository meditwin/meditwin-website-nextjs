import MaternalBanner from "./MaternalBanner";
import MaternalCare from "./MaternalCare";
import MaternalRelatedServices from "./MaternalRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./maternal-health-screening.module.css";

export const metadata = {
  title: "Maternal Health Screening",
  description: "Maternal health screening and pregnancy progress checks at Care-N-Cure in Newtown with Dr. Arunima Haldar.",
};

export default function MaternalHealthScreeningPage() {
  return (
    <main className={styles.main}>
      <MaternalBanner />
      <MaternalCare />
      <MaternalRelatedServices />
      <DoctorTalk />
    </main>
  );
}
