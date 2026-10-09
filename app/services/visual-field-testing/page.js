import VisualFieldBanner from "./VisualFieldBanner";
import VisualFieldCare from "./VisualFieldCare";
import VisualFieldRelatedServices from "./VisualFieldRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./visual-field-testing.module.css";

export const metadata = {
  title: "Visual Field Testing for Glaucoma",
  description: "Visual field testing and side vision mapping for glaucoma at Care-N-Cure in Action Area I, Newtown.",
};

export default function VisualFieldTestingPage() {
  return (
    <main className={styles.main}>
      <VisualFieldBanner />
      <VisualFieldCare />
      <VisualFieldRelatedServices />
      <DoctorTalk />
    </main>
  );
}
