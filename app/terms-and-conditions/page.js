import styles from "./terms-and-conditions.module.css";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the MediTwin platform and services.",
};

const sections = [
  {
    title: "1. About MediTwin",
    paragraphs: [
      "Medi Twin is a healthcare technology platform intended to facilitate access to healthcare-related services and information. Depending on the services available to you, the Platform may allow you to:",
    ],
    items: [
      "Create and manage a patient profile.",
      "Book doctor appointments.",
      "Book laboratory and diagnostic tests.",
      "Book eye-test appointments.",
      "Complete and submit health assessments/questionnaires.",
      "Upload medical reports, prescriptions, and other healthcare documents.",
      "Receive healthcare-related recommendations and information.",
      "View prescriptions and documents made available through the Platform.",
      "Receive hospital or healthcare-facility recommendations.",
      "View invoices generated for purchases or services.",
      "Communicate with MediTwin through available support channels.",
    ],
    after: [
      "The exact services available may vary by location, healthcare facility, service availability, and other operational factors.",
    ],
  },
  {
    title: "2. Eligibility and Account Registration",
    paragraphs: [
      "To use certain features of the Platform, you may be required to create an account.",
      "You agree to:",
    ],
    items: [
      "Provide accurate, complete, and current information.",
      "Keep your account information updated.",
      "Maintain the confidentiality of your login credentials.",
      "Not share your account credentials with another person.",
      "Notify Medi Twin promptly if you believe your account has been accessed without authorization.",
    ],
    after: [
      "You are responsible for activities performed through your account unless such activities result from a security failure attributable to Medi Twin.",
      "Medi Twin reserves the right to suspend or restrict an account where information is inaccurate, fraudulent, misleading, or where the account is used in violation of these Terms or applicable law.",
    ],
  },
  {
    title: "3. Healthcare Disclaimer",
    paragraphs: [
      "Medi Twin is intended to facilitate access to healthcare services and related information. Unless expressly stated otherwise, Medi Twin itself does not replace a qualified healthcare professional.",
      "Information displayed on the Platform should not be considered a substitute for:",
    ],
    items: [
      "Professional medical diagnosis.",
      "Medical examination.",
      "Emergency medical care.",
      "Individualized treatment prescribed by a qualified healthcare professional.",
    ],
    after: [
      "Healthcare decisions should be made in consultation with an appropriately qualified healthcare professional.",
      "If you are experiencing a medical emergency, please contact the appropriate emergency medical service or visit the nearest emergency facility immediately rather than relying on the Platform.",
    ],
  },
  {
    title: "4. Doctor Consultations and Appointments",
    paragraphs: [
      "The Platform may allow patients to schedule appointments with participating doctors or healthcare providers.",
      "Appointment availability is subject to the schedules and availability provided by the relevant healthcare provider.",
      "Medi Twin may facilitate appointment scheduling but does not guarantee:",
    ],
    items: [
      "The availability of a particular doctor.",
      "That an appointment will take place at the originally scheduled time.",
      "A particular medical outcome.",
      "The diagnosis or treatment provided by a healthcare professional.",
    ],
    after: [
      "Doctors and healthcare providers are responsible for the professional medical services they provide.",
      "Patients are responsible for arriving on time and providing accurate information during the consultation.",
    ],
  },
  {
    title: "5. Appointment Cancellation and Rescheduling",
    paragraphs: [
      "Appointments may be cancelled or rescheduled subject to the applicable cancellation and rescheduling policy of Medi Twin, the healthcare facility, or the relevant healthcare provider.",
      "Any applicable cancellation charges, refund conditions, or restrictions will be communicated to the patient where applicable.",
      "Medi Twin may also reschedule or cancel an appointment due to circumstances including doctor availability, operational issues, technical problems, emergencies, or other circumstances beyond its reasonable control.",
    ],
  },
  {
    title: "6. Health Assessment and Questionnaire",
    paragraphs: [
      "Medi Twin may provide health questionnaires or assessments to collect information about a patient's healthcare requirements.",
      "You agree to provide information that is accurate and complete to the best of your knowledge.",
      "You should disclose relevant medical information, including where applicable:",
    ],
    items: [
      "Existing medical conditions.",
      "Current symptoms.",
      "Previous treatments.",
      "Current medications.",
      "Allergies.",
      "Previous surgeries.",
      "Relevant diagnostic reports.",
      "Other information requested in the assessment.",
    ],
    after: [
      "Medi Twin may rely on the information submitted by you when processing your assessment.",
      "Incomplete, inaccurate, outdated, or misleading information may affect the review or recommendations provided.",
    ],
  },
  {
    title: "7. Medical Document Upload",
    paragraphs: ["The Platform may allow you to upload documents including:"],
    items: [
      "Medical reports.",
      "Diagnostic reports.",
      "Prescriptions.",
      "Imaging reports.",
      "Laboratory reports.",
      "Other healthcare-related documents.",
    ],
    after: [
      "You represent that you have the right to provide such documents and that uploading them does not knowingly violate the rights of another person.",
      "You are responsible for ensuring that documents uploaded by you are relevant and accurate.",
    ],
  },
  {
    title: "8. Hospital and Healthcare Recommendations",
    paragraphs: [
      "Based on information submitted through the Platform, Medi Twin may provide recommendations regarding hospitals, healthcare facilities, specialists, or healthcare services.",
      "Such recommendations are intended to assist patients in making informed decisions and should not be interpreted as a guarantee of:",
    ],
    items: [
      "Treatment success.",
      "Medical outcome.",
      "Admission.",
      "Availability of a particular doctor.",
      "Treatment cost.",
      "Treatment duration.",
      "Quality of a particular medical outcome.",
    ],
    after: [
      "Patients should independently confirm relevant details with the healthcare provider before proceeding with treatment.",
    ],
  },
  {
    title: "9. Laboratory Test Bookings",
    paragraphs: [
      "Medi Twin may allow patients to book laboratory and diagnostic tests.",
      "Depending on the selected service, patients may be able to choose:",
    ],
    items: [
      "Diagnostic test or package.",
      "Laboratory or collection centre.",
      "Home sample collection.",
      "Date and time.",
      "Patient details.",
    ],
    after: [
      "The availability of tests, collection slots, report delivery times, and other service details may vary.",
      "Patients must follow any preparation instructions provided for the selected test, including fasting or other requirements.",
      "Test reports are intended to support consultation with qualified healthcare professionals and should not be interpreted without appropriate medical context.",
    ],
  },
  {
    title: "10. Eye Test Appointments",
    paragraphs: [
      "Medi Twin may facilitate online booking for eye examinations and related services.",
      "Appointment availability is subject to the participating clinic or healthcare provider.",
      "Eye-test results, consultation notes, prescriptions, and treatment recommendations are provided by the relevant healthcare professionals or facilities.",
      "Medi Twin does not independently guarantee the accuracy or medical outcome of such professional services.",
    ],
  },
  {
    title: "11. Prescriptions and Medical Information",
    paragraphs: [
      "Where applicable, prescriptions or medication-related information may be uploaded or made available to the patient through the Platform following a consultation or healthcare service.",
      "Patients should use medicines strictly according to the instructions of their qualified healthcare professional.",
      "Medi Twin does not encourage self-medication or changes to prescribed treatment without professional medical advice.",
    ],
  },
  {
    title: "12. Payments",
    paragraphs: ["Payments may be required for:"],
    items: [
      "Doctor appointments.",
      "Laboratory tests.",
      "Eye-test services.",
    ],
    after: [
      "Payment processing may be handled through third-party payment service providers.",
      "You agree to provide accurate payment information and authorize the applicable payment provider to process your transaction.",
    ],
  },
  {
    title: "13. Invoices",
    paragraphs: ["Invoices generated through Medi Twin may include details such as:"],
    items: [
      "Invoice number.",
      "Invoice date.",
      "Patient name.",
      "Appointment details.",
      "Product/service details.",
      "Quantity.",
      "Applicable taxes.",
      "Discounts, where applicable.",
      "Total payable amount.",
      "Payment status.",
    ],
    after: [
      "Patients may be able to view, download, and print invoices through the mobile application.",
      "Patients should retain invoices for their records.",
    ],
  },
  {
    title: "14. Refunds",
    paragraphs: [
      "Refund eligibility will depend on the type of service or product purchased and the applicable refund or cancellation policy.",
      "Where applicable, refund conditions will be communicated to the patient before or at the time of purchase.",
      "Certain services, appointments, diagnostic tests may be non-refundable once the service has commenced, the appointment has been completed, or the product has been dispensed, subject to applicable law.",
      "Any refund will generally be processed through the original payment method or another permitted method.",
    ],
  },
  {
    title: "15. Privacy and Personal Information",
    paragraphs: [
      "Medi Twin may collect and process personal information and healthcare-related information in connection with the services provided through the Platform.",
      "Such information may include:",
    ],
    items: [
      "Name.",
      "Contact details.",
      "Date of birth or age.",
      "Appointment information.",
      "Health information.",
      "Medical reports.",
      "Prescriptions.",
      "Diagnostic reports.",
      "Payment and transaction information.",
    ],
    after: [
      "The collection, use, storage, and processing of information are governed by the Medi Twin Privacy Policy.",
      "By using the Platform, you acknowledge that you have reviewed the applicable Privacy Policy.",
    ],
  },
  {
    title: "16. Patient Responsibilities",
    paragraphs: ["You agree to:"],
    items: [
      "Provide truthful and accurate information.",
      "Keep your account information updated.",
      "Follow healthcare professionals' instructions.",
      "Follow preparation instructions for diagnostic tests.",
      "Attend appointments at the scheduled time.",
      "Protect your account credentials.",
      "Not misuse the Platform.",
      "Not upload unlawful, fraudulent, offensive, or malicious content.",
      "Not attempt to gain unauthorized access to the Platform or its systems.",
    ],
  },
  {
    title: "17. Prohibited Activities",
    paragraphs: ["You must not:"],
    items: [
      "Use the Platform for unlawful purposes.",
      "Create an account using another person's identity without authorization.",
      "Provide false medical information intentionally.",
      "Upload malicious software or harmful files.",
      "Attempt to interfere with the operation of the Platform.",
      "Attempt unauthorized access to another user's account.",
      "Copy, reproduce, modify, or commercially exploit Platform content without authorization.",
      "Use automated systems to access the Platform in a manner that may adversely affect its operation.",
      "Engage in fraudulent payment or transaction activities.",
    ],
  },
  {
    title: "18. Third-Party Services",
    paragraphs: ["Medi Twin may integrate with third-party services, including:"],
    items: ["Payment gateways.", "Communication providers."],
    after: [
      "Third-party services may have their own terms, policies, and privacy practices.",
      "Medi Twin is not responsible for the independent policies or actions of third-party service providers except to the extent required by applicable law.",
    ],
  },
  {
    title: "19. Platform Availability",
    paragraphs: [
      "Medi Twin aims to maintain reliable access to the Platform but does not guarantee uninterrupted or error-free availability.",
      "The Platform may occasionally be unavailable because of:",
    ],
    items: [
      "Scheduled maintenance.",
      "Technical problems.",
      "Software updates.",
      "Network failures.",
      "Third-party service interruptions.",
      "Security incidents.",
      "Circumstances beyond reasonable control.",
    ],
  },
  {
    title: "20. Intellectual Property",
    paragraphs: [
      "All intellectual property associated with the Medi Twin Platform, including where applicable:",
    ],
    items: [
      "Logos.",
      "Brand elements.",
      "Software.",
      "User interface designs.",
      "Text.",
      "Graphics.",
      "Images.",
      "Content.",
      "Database structures.",
    ],
    after: [
      "is owned by or licensed to Medi Twin and is protected by applicable intellectual property laws.",
      "You may use the Platform only for its intended personal and lawful purposes.",
    ],
  },
  {
    title: "21. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, Medi Twin shall not be responsible for losses arising from:",
    ],
    items: [
      "Decisions made solely on the basis of information displayed on the Platform.",
      "Medical outcomes resulting from treatment provided by healthcare professionals.",
      "Actions or omissions of independent healthcare providers.",
      "Unavailability of a third-party healthcare facility.",
      "Incorrect information submitted by a patient.",
      "Delays caused by third-party providers.",
      "Internet or telecommunications failures.",
      "Unauthorized access caused by the user's failure to protect account credentials.",
    ],
    after: [
      "Nothing in these Terms is intended to exclude or limit liability where such exclusion or limitation is prohibited by applicable law.",
    ],
  },
  {
    title: "22. Changes to Services",
    paragraphs: [
      "Medi Twin may add, modify, suspend, or discontinue features or services from time to time.",
      "Where changes materially affect users or their contractual rights, appropriate notice will be provided where required by applicable law.",
    ],
  },
  {
    title: "22. Changes to These Terms",
    paragraphs: [
      "Medi Twin may update these Terms periodically.",
      'The updated Terms will be published on the Platform with the revised "Last Updated" date.',
      "Your continued use of the Platform after the effective date of revised Terms constitutes acceptance of the updated Terms, to the extent permitted by applicable law.",
    ],
  },
  {
    title: "23. Suspension or Termination",
    paragraphs: ["Medi Twin may suspend or terminate access to an account where:"],
    items: [
      "The user violates these Terms.",
      "Fraudulent activity is suspected.",
      "The Platform is being misused.",
      "Required by law or regulatory authorities.",
      "Continued access presents a security or operational risk.",
    ],
    after: [
      "Users may discontinue use of the Platform at any time, subject to any outstanding obligations.",
    ],
  },
  {
    title: "24. Governing Law and Jurisdiction",
    paragraphs: [
      "These Terms shall be governed by the applicable laws of India.",
      "Subject to applicable law, disputes arising in connection with these Terms or the Platform shall be subject to the jurisdiction of the courts located in [Kolkata, West Bengal, India].",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={`container-xxl ${styles.container}`}>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </header>

      <div className={`container-xxl ${styles.container}`}>
        <article className={styles.content}>
          <div className={styles.introduction}>
            <p>
              Welcome to MediTwin. These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the Medi Twin website, mobile application, services, and related healthcare facilities (collectively, the &quot;Platform&quot;).
            </p>
            <p>
              By registering for an account, accessing the Platform, booking an appointment, purchasing a subscription, submitting a health assessment, booking a laboratory or eye test, purchasing a product, or otherwise using any Medi Twin service, you acknowledge that you have read, understood, and agreed to these Terms.
            </p>
            <p>If you do not agree with these Terms, please do not use the Platform.</p>
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

          <section className={`${styles.section} ${styles.contact}`}>
            <h2>28. Contact Us</h2>
            <p>If you have questions, concerns, or complaints regarding these Terms or the Medi Twin Platform, please contact us:</p>
            <address>
              <strong>MediTwin (CARE-N-CURE HEALTHCARE SOLUTIONS)</strong>
              <span>Email: <a href="mailto:carencureresearchlab@gmail.com">carencureresearchlab@gmail.com</a></span>
              <span>Phone: <a href="tel:+919830175488">+91 9830175488</a></span>
              <span>Address: Shop 214, Aahirini Market, 2 nd floor, street 214, Action Area I, Newtown, West Bengal 700156</span>
            </address>
            <p>For support-related queries, you may also use the Support &amp; Help section available within the Medi Twin application.</p>
          </section>

          <p className={styles.acceptance}>
            By using MediTwin, you acknowledge that you have read and understood these Terms &amp; Conditions and agree to be bound by them.
          </p>
        </article>
      </div>
    </main>
  );
}
