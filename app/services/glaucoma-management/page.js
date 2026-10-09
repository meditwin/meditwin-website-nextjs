import GlaucomaBanner from "./GlaucomaBanner";
import GlaucomaCare from "./GlaucomaCare";
import RelatedEyeServices from "../../../components/RelatedEyeServices/page";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./glaucoma-management.module.css";

export const metadata = {
  title: "Glaucoma Management",
  description: "Glaucoma management, eye pressure checks and regular follow-up care with Dr. Sayantan Ghosh at Care-n-Cure in Newtown.",
};

export default function GlaucomaManagementPage() {
  return (
    <main className={styles.main}>
      <GlaucomaBanner />
      <GlaucomaCare />
      <RelatedEyeServices currentService="glaucoma-treatment" />
      <DoctorTalk />
    </main>
  );
}
