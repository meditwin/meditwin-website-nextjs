import ScreeningsBanner from "./ScreeningsBanner";
import ScreeningsCare from "./ScreeningsCare";
import ScreeningsRelatedServices from "./ScreeningsRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./preventative-screenings.module.css";

export const metadata = {
  title: "Preventative Screenings",
  description: "Preventative gynecological screenings, Pap smears and pelvic exams with Dr. Arunima Haldar at Care-n-Cure in Newtown.",
};

export default function PreventativeScreeningsPage() {
  return (
    <main className={styles.main}>
      <ScreeningsBanner />
      <ScreeningsCare />
      <ScreeningsRelatedServices />
      <DoctorTalk />
    </main>
  );
}
