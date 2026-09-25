import Link from "next/link";
import "./appointment-steps.css";

const steps = [
  { title: "Book a Slot", description: "Call us or pick a time through the website." },
  { title: "Visit the Clinic", description: "Come to Action Area I during our evening shift." },
  { title: "Get Treated", description: "Talk to the doctor and grab your prescriptions downstairs." },
];

function StepIcon({ step }) {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {step === 0 && <><circle cx="17" cy="16" r="12" strokeWidth="3.5" /><path d="m26 25 10 11" strokeWidth="3.5" /></>}
      {step === 1 && <><path d="M19 33H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v9M3 13h30" /><rect x="8" y="2" width="4" height="8" rx="2" /><rect x="24" y="2" width="4" height="8" rx="2" /><circle cx="28" cy="28" r="10" /><path d="M28 22v6h4" /></>}
      {step === 2 && <><path d="m20 8-3-3C7-2-3 10 5 18l15 16 15-16C43 10 33-2 25 5l-8 8c-3 3 1 6 4 3l3-3 10 10M27 19l5 5c3 3-1 6-3 4l-6-6M23 22l5 5c3 3-1 6-3 4l-5-5M19 26l4 4c3 3-1 6-3 4" /><path d="m6 21 3-3c3-3 6 1 3 3l-3 3c-3 3-6-1-3-3Zm4 5 3-3c3-3 6 1 3 3l-3 3c-3 3-6-1-3-3Zm4 4 2-2c3-3 6 1 3 3l-2 2c-3 3-6-1-3-3Z" /></>}
    </svg>
  );
}

export default function AppointmentSteps() {
  return (
    <section className="medi-appointment-steps" aria-labelledby="medi-steps-title">
      <div className=  "container-xxl  medi-steps-container">
        <h2 id="medi-steps-title">How to See a Doctor</h2>
        <p className="medi-steps-intro">Getting medical help should not feel like solving a puzzle. Follow these steps to get into the clinic.</p>
        <ol className="medi-steps-grid">
          {steps.map(({ title, description }, index) => (
            <li className="medi-step-card" key={title}>
              <div className="medi-step-top"><StepIcon step={index} /><span className="medi-step-number" aria-hidden="true">{index + 1}</span></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <div className="text-center medi-steps-footer"><Link href="#" className="btn medi-steps-book">Book Appointment</Link></div>
      </div>
    </section>
  );
}
