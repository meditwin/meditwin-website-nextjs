import AboutUsBanner from "../../components/AboutUsBanner/page";
import AboutCare from "../../components/AboutCare/page";
import MissionVision from "../../components/MissionVision/page";
import WhyChoose from "../../components/WhyChoose/page";
import Team from "../../components/Team/page";
import DoctorTalk from "../../components/DoctorTalk/page";
import styles from "./about-us.module.css";

export const metadata = {
  title: "About Us",
  description: "Learn more about Care-n-Cure Clinic in Newtown, West Bengal.",
};

export default function AboutUsPage() {
  return (
    <main className={styles.main}>
      <AboutUsBanner />
      <AboutCare />
      <MissionVision />
      <WhyChoose />
      <Team />
      <DoctorTalk />
    </main>
  );
}