import BlogBanner from "../../components/BlogBanner/page";
import BlogInsights from "../../components/BlogInsights/page";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog",
  description: "Read articles and updates from Care-n-Cure Clinic.",
};

export default function BlogPage() {
  return (
    <main className={styles.main}>
      <BlogBanner />
      <BlogInsights />
    </main>
  );
}
