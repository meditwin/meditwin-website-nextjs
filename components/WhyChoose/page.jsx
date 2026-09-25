import Image from "next/image";
import doctorImage from "../../public/images/choose/choose1.jpg";
import "./why-choose.css";

const features = [
  { id: "expert", title: "Experienced Doctors", description: "Dr. Ghosh and Dr. Haldar have years of specialized training." },
  { id: "schedule", title: "Modern Tech", description: "We use tools like the OCT scanner for better diagnostics." },
  { id: "results", title: "Evening Hours", description: "Our clinic runs from 6 PM to 8:30 PM everyday." },
  { id: "care", title: "Optical Store", description: "Pick up your new glasses before you walk out." },
];

function FeatureIcon({ type }) {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === "expert" && <>
        <path d="m12 27-3 10 6-3 3 4 3-10M25 27l3 10 3-4 6 1-5-10" />
        <circle cx="21" cy="16" r="13" /><circle cx="21" cy="16" r="9" />
        <path d="m21 10 2 4 4 .5-3 3 .7 4.5-3.7-2-3.7 2 .7-4.5-3-3 4-.5Z" />
      </>}
      {type === "schedule" && <>
        <path d="M18 34H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v9M3 13h30" />
        <rect x="8" y="2" width="4" height="8" rx="2" /><rect x="24" y="2" width="4" height="8" rx="2" />
        <circle cx="28" cy="28" r="10" /><path d="M28 22v6h4" />
      </>}
      {type === "results" && <>
        <path d="M36 20a17 17 0 1 1-17-17" strokeWidth="2.7" />
        <path d="m11 18 8 8L36 8" strokeWidth="2.7" />
      </>}
      {type === "care" && <>
        <circle cx="21" cy="9" r="6" /><path d="M15 8c4 0 6-3 6-3s2 4 6 4M11 26v-4c0-4 4-7 10-7s10 3 10 7v3M17 16l4 6 4-6M21 22v4" />
        <path d="m3 30 4-5 8 3h8c4 0 4 4 0 4h-6m-9 3 5 2 11-1 12-7c2-2 0-4-2-3l-8 3M2 30l6 7 4-3-6-7Z" />
      </>}
    </svg>
  );
}

export default function WhyChoose() {
  return (
    <section className="medi-why-choose" aria-labelledby="medi-why-choose-title">
      <div className=  "container-xxl  medi-why-choose-container">
        <h2 id="medi-why-choose-title">Why Patients Trust Care-n-Cure</h2>
        <p className="medi-why-choose-intro">
          Finding a good doctor takes trial and error. We make it easy. We explain your diagnosis in plain English, tell you what happens next and make sure you feel comfortable before you leave the room.
        </p>
        <div className="medi-why-choose-grid">
          {features.map((feature) => (
            <article className={`medi-why-choose-card medi-why-choose-${feature.id}`} key={feature.id}>
              <FeatureIcon type={feature.id} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
          <div className="medi-why-choose-photo">
            <Image src={doctorImage} alt="Doctor writing notes at a clinic desk" fill
              sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) calc(100vw - 48px), 33vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
