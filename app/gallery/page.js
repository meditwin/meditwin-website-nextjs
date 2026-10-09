import GalleryBanner from "../../components/GalleryBanner/page";
import GalleryShowcase from "../../components/GalleryShowcase/page";
import styles from "./gallery.module.css";

export const metadata = {
  title: "Gallery",
  description: "Explore the gallery of Care-n-Cure Clinic in Newtown, West Bengal.",
};

export default function GalleryPage() {
  return (
    <main className={styles.main}>
      <GalleryBanner />
      <GalleryShowcase />
    </main>
  );
}
