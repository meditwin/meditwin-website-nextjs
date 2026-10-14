"use client";

import Image from "next/image";
import { useRef } from "react";
import team1 from "../../public/images/teams/team1.png";
import team2 from "../../public/images/teams/team2.png";
import team3 from "../../public/images/teams/team3.png";
import team4 from "../../public/images/teams/team4.png";
import team5 from "../../public/images/teams/team5.png";
import "./team.css";

const members = [
  { name: "Dr. Sayantan Ghosh", specialty: "Ophthalmology", image: team1 },
  { name: "Dr. Arunima Haldar", specialty: "Gynaecologist", image: team2 },
  { name: "Dr. Falguni Bhattacharyya", specialty: "Ophthalmology", image: team3 },
  { name: "Dr Archana Garai", specialty: "Paediatrics", image: team4 },
  { name: "Dr. Suman Ganguly", specialty: "Dermatology ", image: team5 },
];

export default function Team() {
  const slider = useRef(null);

  function slide(direction) {
    const track = slider.current;
    if (!track) return;
    const card = track.querySelector(".medi-team-card");
    if (!card) return;
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    const end = track.scrollWidth - track.clientWidth;
    const left = direction > 0 && track.scrollLeft >= end - 2
      ? 0
      : direction < 0 && track.scrollLeft <= 2
        ? end
        : track.scrollLeft + direction * distance;
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <section id="team" className="medi-team" aria-labelledby="medi-team-title">
      <div className=  "container-xxl  medi-team-container">
        <h2 id="medi-team-title">The People Treating You</h2>
        <p className="medi-team-intro">
          Our medical staff focuses on giving you solid healthcare in Newtown. Meet the people who run the clinic.
        </p>
        <div className="medi-team-slider">
        <div className="medi-team-grid" ref={slider} role="region" aria-label="Team members" tabIndex={0}>
          {members.map((member) => (
            <article className="medi-team-card" key={member.name}>
              <Image src={member.image} alt={member.name} fill
                sizes="(max-width: 575px) calc(100vw - 40px), (max-width: 991px) calc((100vw - 68px) / 2), 25vw" />
              <div className="medi-team-card-copy">
                <h3>{member.name}</h3>
                <p>{member.specialty}</p>
              </div>
            </article>
          ))}
        </div>
          <button type="button" className="medi-team-arrow medi-team-arrow-left" aria-label="Previous team member" onClick={() => slide(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button type="button" className="medi-team-arrow medi-team-arrow-right" aria-label="Next team member" onClick={() => slide(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
