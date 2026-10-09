import CycleBanner from "./CycleBanner";
import CycleCare from "./CycleCare";
import CycleRelatedServices from "./CycleRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./cycle-management-and-pcos.module.css";

export const metadata = {
  title: "Cycle Management and PCOS",
  description: "Cycle management and PCOS care for irregular periods, pelvic pain and hormone testing with Dr. Arunima Haldar at Care-n-Cure in Newtown.",
};

export default function CycleManagementAndPcosPage() {
  return (
    <main className={styles.main}>
      <CycleBanner />
      <CycleCare />
      <CycleRelatedServices />
      <DoctorTalk />
    </main>
  );
}
