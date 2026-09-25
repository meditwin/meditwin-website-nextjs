import Image from "next/image";
import Link from "next/link";
import aboutImage from "../../public/images/about/about-care.png";
import "./about.css";

const statistics = [
  {
    value: "10+",
    label: "Years Medical Experience",
  },
  {
    value: "1000+",
    label: "Happy Patients",
  },
  {
    value: "In-House",
    label: "Optical Store",
  },
];

const brands = [
  { image: "prime.png", name: "Prime Lenses" },
  { image: "ko.png", name: "Knight Optical" },
  { image: "ova.png", name: "Nova Eyewear" },
  { image: "gkb.png", name: "GKB Opticals" },
  { image: "lomb.png", name: "Bausch + Lomb" },
  { image: "zes.png", name: "ZEISS" },
];

export default function About() {
  return (
    <section id="about" className="medi-about" aria-labelledby="medi-about-title">
      <div className=  "container-xxl  medi-about-container">
        <div className="medi-about-card">
          <div className="medi-about-copy">
            <h2 id="medi-about-title">About Care - N - Care</h2>
            <p>
              Going to the doctor usually means waiting an hour to speak to someone for five minutes. We run things differently at Care-n-Cure. You sit down with the doctors, explain what hurts and we figure out how to fix it without rushing you out the door. 
              <br />
              We manage everything from routine pregnancy checkups to deep retinal scans. You get major medical care without leaving the Rajarhat-Newtown area. 
            </p>
            <Link href="#" className="btn medi-about-more">Learn More</Link>
            <dl className="medi-about-statistics">
              {statistics.map(({ value, label }) => (
                <div className="medi-about-statistic" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="medi-about-photo">
            <Image src={aboutImage} alt="The Care-n-Cure team at the clinic"
              fill sizes="(max-width: 767px) calc(100vw - 80px), (max-width: 1099px) 46vw, 50vw" />
          </div>
        </div>
        <ul className="medi-about-brands" aria-label="Optical brands">
          {brands.map(({ image, name }) => (
            <li className="medi-about-brand" key={name}>
              <Image src={`/images/about/${image}`} alt={name} width={100} height={64} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
