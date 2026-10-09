import TeamBanner from "../../components/TeamBanner/page";
import Team from "../../components/Team/page";
import styles from "./team.module.css";

export const metadata = {
  title: "Our Teams",
  description: "Meet the team at Care-n-Cure Clinic in Newtown, West Bengal.",
};

export default function TeamPage() {
  return (
    <main className={styles.main}>
      <TeamBanner />
      <Team />
    </main>
  );
}
