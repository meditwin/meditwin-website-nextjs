import Image from "next/image";
import Link from "next/link";
import team1 from "../../public/images/teams/team1.png";
import team2 from "../../public/images/teams/team2.png";
import team3 from "../../public/images/teams/team3.png";
import team4 from "../../public/images/teams/team4.png";
import "./team.css";

const members = [
  { name: "Dr. Sayantan Ghosh", specialty: "Ophthalmology", image: team1 },
  { name: "Dr. Arunima Haldar", specialty: "Gynaecologist", image: team2 },
  { name: "Dr. Falguni Bhattacharyya", specialty: "Ophthalmology", image: team3 },
  { name: "Dr Archana Garai", specialty: "Paediatrics", image: team4 },
];

export default function Team() {
  return (
    <section id="team" className="medi-team" aria-labelledby="medi-team-title">
      <div className=  "container-xxl  medi-team-container">
        <h2 id="medi-team-title">The People Treating You</h2>
        <p className="medi-team-intro">
          Our medical staff focuses on giving you solid healthcare in Newtown. Meet the people who run the clinic.
        </p>
        <div className="medi-team-grid">
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
        <div className="text-center medi-team-footer">
          <Link href="#" className="btn medi-team-all">View All Team Members</Link>
        </div>
      </div>
    </section>
  );
}
