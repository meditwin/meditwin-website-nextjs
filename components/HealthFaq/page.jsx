import Link from "next/link";
import "./health-faq.css";

const faqs = [
  { question: "When is the clinic open?", answer: "We open everyday from 6 PM to 8:30 PM. This lets you come in after work." },
  { question: "Where are you located?", answer: "We are on the second floor of Aahirini Market in Action Area I, Newtown." },
  { question: "Do you sell glasses?", answer: "Yes. We run an in-house optical store with frames, lenses, and sunglasses." },
  { question: "Do I need an appointment?", answer: "We take walk-ins, but booking ahead saves you from waiting in the lobby." },
  { question: "What does the OCT scanner do?", answer: "It takes a fast, painless picture of your retina layers to spot eye diseases early." },
];

export default function HealthFaq() {
  return (
    <div className="medi-health-faq">
      <section className="medi-health-cta" aria-labelledby="medi-health-title">
        <div className=  "container-xxl  medi-health-container">
          <h2 id="medi-health-title">Fix Your Health Issues</h2>
          <p>Stop ignoring the pain or blurry vision. Let our doctors figure out what is wrong and get you back on track.</p>
          <Link href="#" className="btn medi-health-book">Book Appointment</Link>
        </div>
      </section>
      <section className="medi-faq" aria-labelledby="medi-faq-title">
        <div className=  "container-xxl  medi-health-container">
          <h2 id="medi-faq-title">FAQs</h2>
          <div className="medi-faq-list">
            {faqs.map(({ question, answer }) => (
              <details className="medi-faq-item" key={question}>
                <summary>{question}<span className="medi-faq-toggle" aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
