import UvEyewearBanner from "./UvEyewearBanner";
import UvEyewearCare from "./UvEyewearCare";
import UvEyewearRelatedServices from "./UvEyewearRelatedServices";
import DoctorTalk from "../../../components/DoctorTalk/page";
import styles from "./polarized-uv-eyewear.module.css";

export const metadata = {
  title: "Polarized UV Eyewear",
  description: "Polarized UV eyewear and prescription sunglasses with Dr. Sayantan Ghosh at the Care-n-Cure optical shop in Newtown.",
};

export default function PolarizedUvEyewearPage() {
  return (
    <main className={styles.main}>
      <UvEyewearBanner />
      <UvEyewearCare />
      <UvEyewearRelatedServices />
      <DoctorTalk />
    </main>
  );
}
