import GlassesBanner from "./GlassesBanner";
import GlassesCare from "./GlassesCare";
import GlassesRelatedServices from "./GlassesRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./prescription-glasses-and-exams.module.css";

export const metadata = {
  title: "Prescription Glasses and Exams",
  description: "Prescription glasses, vision exams and frame fitting with Dr. Sayantan Ghosh at Care-n-Cure in Newtown.",
};

export default function PrescriptionGlassesAndExamsPage() {
  return (
    <main className={styles.main}>
      <GlassesBanner />
      <GlassesCare />
      <GlassesRelatedServices />
      <DoctorTalk />
    </main>
  );
}
