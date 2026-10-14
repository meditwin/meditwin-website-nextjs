import ProfileForm from "./ProfileForm";
import ProfileAccess from "./ProfileAccess";
import styles from "../register/register.module.css";

export const metadata = { title: "Complete Your Profile" };

export default function CompleteProfilePage() {
  return <main className={styles.page}>
    <ProfileAccess>
      <section className={styles.content} aria-labelledby="profile-heading">
        <h1 id="profile-heading">Complete Your Profile</h1>
        <ProfileForm />
      </section>
    </ProfileAccess>
  </main>;
}
