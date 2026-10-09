import BlogDetailBanner from "../../../components/BlogDetailBanner/page";
import BlogArticle from "../../../components/BlogArticle/page";
import BlogInsights from "../../../components/BlogInsights/page";
import styles from "../blog.module.css";

export const metadata = {
  title: "Nameless Art School",
  description: "Nameless Art School with experienced artist Rajib Sur Roy (Gold Medalist, Government Art College).",
};

export default function NamelessArtSchoolPage() {
  return (
    <main className={styles.main}>
      <BlogDetailBanner />
      <div style={{ background: "#fff" }}>
        <BlogArticle />
        <BlogInsights heading="Related Blogs" limit={3} />
      </div>
    </main>
  );
}
