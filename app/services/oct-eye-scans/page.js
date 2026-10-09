import OctBanner from "./OctBanner";
import OctCare from "./OctCare";
import OctRelatedServices from "./OctRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./oct-eye-scan.module.css";

export const metadata = {
  title: "OCT Eye Scan",
  description: "OCT retina examination and scanning at Care-N-Cure in Newtown with Dr. Sayantan Ghosh.",
};

export default function OctEyeScanPage() {
  return (
    <main className={styles.main}>
      <OctBanner />
      <OctCare />
      <OctRelatedServices />
      <DoctorTalk />
    </main>
  );
}
