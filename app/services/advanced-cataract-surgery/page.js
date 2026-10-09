import CataractBanner from "../../../components/CataractBanner/page";
import CataractCare from "../../../components/CataractCare/page";
import RelatedEyeServices from "../../../components/RelatedEyeServices/page";
import DocorTalk from "../../../components/DoctorTalk/page";
import styles from "./advanced-cataract-surgery.module.css";

export const metadata = {
  title: "Advanced Cataract Surgery",
  description:
    "Learn about advanced cataract surgery and vision-restoration care at Care-n-Cure Clinic.",
};

export default function AdvancedCataractSurgeryPage() {
  return (
    <main className={styles.main}>
      <CataractBanner />
      <CataractCare />
      <RelatedEyeServices />
      <DocorTalk />
    </main>
  );
}
