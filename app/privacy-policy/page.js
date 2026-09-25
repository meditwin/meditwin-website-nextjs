import styles from "../terms-and-conditions/terms-and-conditions.module.css";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the MediTwin platform and services.",
};

const sections = [
  {
    title: "1. Scope of This Privacy Policy",
    paragraphs: ["This Privacy Policy applies to information collected through:"],
    items: [
      "Medi Twin mobile application.",
      "Medi Twin website.",
      "Patient account and profile services.",
      "Appointment booking services.",
      "Health assessment/questionnaire services.",
      "Laboratory test booking services.",
      "Eye-test appointment services.",
      "Hospital recommendation services.",
      "Prescription and medical-document services.",
      "Customer support and contact forms.",
      "Other services provided through the Medi Twin Platform.",
    ],
    after: [
      "This Privacy Policy does not necessarily apply to third-party websites, hospitals, laboratories, doctors, clinics, payment gateways, or other external services that may be accessible through the Platform. Those parties may have their own privacy policies.",
    ],
  },
  {
    title: "2. Personal Information We Collect",
    paragraphs: [
      "Depending on the services you use, Medi Twin may collect the following categories of information.",
      "This may include:",
    ],
    items: [
      "Full name.",
      "Date of birth or age.",
      "Gender.",
      "Mobile number.",
      "Email address.",
      "Residential address.",
      "City and state.",
      "Profile photograph, where provided.",
    ],
  },
  {
    title: "3. Healthcare Information",
    paragraphs: [
      "Because Medi Twin provides healthcare-related services, you may choose to provide information such as:",
    ],
    items: [
      "Medical history.",
      "Existing medical conditions.",
      "Current symptoms.",
      "Allergies.",
      "Current medications.",
      "Previous surgeries.",
      "Previous treatments.",
      "Family medical history.",
      "Diagnostic information.",
      "Laboratory reports.",
      "Medical prescriptions.",
      "Doctor consultation information.",
      "Eye-test information.",
      "Laboratory test information.",
      "Hospital recommendations.",
      "Other healthcare information submitted through questionnaires or forms.",
    ],
    after: [
      "We process such information only for the purposes for which it is collected or otherwise as permitted by applicable law.",
    ],
  },
  {
    title: "4. Health Questionnaires and Assessments",
    paragraphs: [
      "Medi Twin may allow patients to complete health questionnaires and assessments.",
      "The information may include details about:",
    ],
    items: [
      "Current symptoms.",
      "Medical history.",
      "Previous diagnoses.",
      "Treatment history.",
      "Medications.",
      "Lifestyle information.",
      "Diagnostic reports.",
      "Healthcare requirements.",
      "Preferred treatment objectives.",
    ],
    after: [
      "This information may be reviewed by authorized personnel or healthcare professionals, where applicable, to facilitate the services requested by you.",
      "You should provide accurate and complete information to the best of your knowledge.",
    ],
  },
  {
    title: "5. Medical Documents",
    paragraphs: ["The Platform may allow you to upload documents such as:"],
    items: [
      "Medical reports.",
      "Blood test reports.",
      "Diagnostic reports.",
      "X-rays and scans.",
      "Prescriptions.",
      "Consultation documents.",
      "Eye-test reports.",
      "Other supporting healthcare documents.",
    ],
    after: [
      "These documents may be used to facilitate healthcare assessment, appointment management, medical review, recommendations, and related services requested by you.",
    ],
  },
  {
    title: "6. Appointment Information",
    paragraphs: [
      "When you book an appointment through Medi Twin, we may collect and process information including:",
    ],
    items: [
      "Patient name.",
      "Patient ID.",
      "Doctor selected.",
      "Healthcare facility.",
      "Appointment date.",
      "Appointment time.",
      "Appointment type.",
      "Consultation details.",
      "Appointment status.",
      "Related payment information.",
    ],
    after: [
      "This information is used to process and manage your appointment and provide related notifications.",
    ],
  },
  {
    title: "7. Laboratory and Diagnostic Information",
    paragraphs: ["When you book laboratory or diagnostic services, we may collect:"],
    items: [
      "Selected test or health package.",
      "Laboratory or collection centre.",
      "Home collection address, where applicable.",
      "Appointment date and time.",
      "Patient information.",
      "Test-related instructions.",
      "Payment details.",
      "Test reports made available through the Platform.",
    ],
    after: [
      "Diagnostic reports may be made available through your Medi Twin account where supported by the relevant healthcare or diagnostic provider.",
    ],
  },
  {
    title: "8. Eye-Test Information",
    paragraphs: [
      "If you use the eye-test appointment services, we may collect and process:",
    ],
    items: [
      "Selected eye-test service.",
      "Appointment information.",
      "Clinic information.",
      "Relevant patient information.",
      "Eye-test reports.",
      "Consultation notes.",
      "Prescriptions, where applicable.",
    ],
  },
  {
    title: "9. Payment Information",
    paragraphs: [
      "Payments may be processed through third-party payment gateways.",
      "Depending on the payment method used, the payment service provider may collect information such as:",
    ],
    items: [
      "Payment transaction information.",
      "Payment method.",
      "Transaction ID.",
      "Payment status.",
      "Refund information.",
    ],
    after: [
      "Medi Twin may receive limited payment-related information necessary to confirm and manage transactions.",
      "We generally do not store complete card numbers, CVV numbers, or banking credentials on our own systems unless specifically required and legally permitted.",
    ],
  },
  {
    title: "10. How We Use Your Information",
    paragraphs: ["We may process your information for purposes including:"],
    items: [
      "Creating your account.",
      "Authenticating users.",
      "Maintaining your profile.",
      "Providing account-related services.",
      "Processing health assessments.",
      "Managing appointments.",
      "Facilitating diagnostic bookings.",
      "Providing access to prescriptions and reports.",
      "Facilitating hospital or healthcare recommendations.",
      "Sending appointment reminders.",
      "Sending booking confirmations.",
      "Notifying you when reports or recommendations become available.",
      "Sending invoice notifications.",
      "Responding to support requests.",
      "Sending important service-related communications.",
      "Maintaining and improving the Platform.",
      "Diagnosing technical issues.",
      "Monitoring service performance.",
      "Improving user experience.",
      "Preventing fraud.",
      "Protecting accounts.",
      "Detecting unauthorized activity.",
      "Complying with applicable legal and regulatory requirements.",
    ],
  },
  {
    title: "11. Collection and Processing Notice",
    paragraphs: [
      "Medi Twin aims to collect and process personal information for specific and identifiable purposes.",
      "Where required by applicable law, we will provide an appropriate notice describing:",
    ],
    items: [
      "The personal information being collected.",
      "The purpose for collecting",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={`container-xxl ${styles.container}`}>
          <h1>Privacy Policy</h1>
        </div>
      </header>

      <div className={`container-xxl ${styles.container}`}>
        <article className={styles.content}>
          <div className={styles.introduction}>
            <p>
              MediTwin (&quot;MediTwin&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to protecting the personal information and healthcare-related information you provide while using our website, mobile application, and related services.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, disclose, and protect your information when you access or use the Medi Twin platform (&quot;Platform&quot;).
            </p>
            <p>By using the Platform, you acknowledge that you have read and understood this Privacy Policy.</p>
          </div>

          {sections.map(({ title, paragraphs, items, after }) => (
            <section className={styles.section} key={title}>
              <h2>{title}</h2>
              {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {items && (
                <ul>
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {after?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
