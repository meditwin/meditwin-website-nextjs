import DiabeticBanner from "./DiabeticBanner";
import DiabeticCare from "./DiabeticCare";
import RelatedEyeServices from "../../../components/RelatedEyeServices/page";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./diabetic-retinopathy.module.css";

export const metadata = {
  title: "Diabetic Retinopathy",
  description: "Diabetic retinopathy exams and retina care with Dr. Sayantan Ghosh at Care-n-Cure in Newtown.",
};

export default function DiabeticRetinopathyPage() {
  return (
    <main className={styles.main}>
      <DiabeticBanner />
      <DiabeticCare />
      <RelatedEyeServices currentService="diabetic-retinopathy" />
      <DoctorTalk />
    </main>
  );
}
