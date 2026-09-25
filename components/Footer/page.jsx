import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo/medi-logo.png";
import "./footer.css";

const quickLinks = [
  ["About", "#about"], ["Services", "#services"], ["Team", "#team"],
  ["Gallery", "#gallery"], ["Blog", "#blog"], ["Contact Us", "#contact"],
  ["Terms & Conditions", "/terms-and-conditions"], ["Privacy Policy", "/privacy-policy"],
];
const services = [
  ["Diagnostic Services", "#services"],
  ["Ophthalmology Care", "#services"],
  ["Gynaecological Care", "#services"],
  ["Optical Services", "#services"],
];

function SocialIcon({ name }) {
  if (name === "LinkedIn") return <span className="medi-footer-social-letter">in</span>;
  if (name === "Facebook") return <span className="medi-footer-social-letter">f</span>;
  if (name === "X") return <span className="medi-footer-social-x">𝕏</span>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

function ContactIcon({ type }) {
  return <span className="medi-footer-contact-icon" aria-hidden="true">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {type === "address" && <><path d="M18 9c0 5-6 10-6 10S6 14 6 9a6 6 0 1 1 12 0Z" /><circle cx="12" cy="9" r="2" /><path d="M7 18c-5 3 15 4 10 0" /></>}
      {type === "phone" && <><path d="m4 3 4-1 3 6-3 2a15 15 0 0 0 6 6l2-3 6 3-1 4c-1 4-9 0-13-4S0 4 4 3Z" /><path d="M15 3a8 8 0 0 1 6 6M15 7a4 4 0 0 1 2 2" /></>}
      {type === "email" && <><rect x="2" y="5" width="20" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>}
    </svg>
  </span>;
}

export default function Footer({ socialLinks = {} }) {
  return (
    <footer className="medi-footer">
      <div className=  "container-xxl  medi-footer-container">
        <div className="medi-footer-grid">
          <div className="medi-footer-brand">
            <Link href="/" aria-label="Care-n-Cure Wellness home"><Image src={logo} alt="Care-n-Cure Wellness" className="medi-footer-logo" sizes="150px" /></Link>
            <p>Care-n-Cure Wellness handles eye care and gynecology in Newtown, West Bengal. Honest medical advice from local doctors.</p>
            <ul className="medi-footer-socials" aria-label="Social media">
              {["LinkedIn", "X", "Instagram", "Facebook"].map((name) => (
                <li key={name}>
                  {socialLinks[name] ? (
                    <a href={socialLinks[name]} target="_blank" rel="noopener noreferrer" className="medi-footer-social" aria-label={`${name} (opens in a new tab)`}><SocialIcon name={name} /></a>
                  ) : (
                    <span className="medi-footer-social" role="img" aria-label={`${name} profile not yet provided`}><SocialIcon name={name} /></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer quick links">
            <h2>Quick Links</h2>
            <ul className="medi-footer-links">{quickLinks.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Footer services">
            <h2>Services</h2>
            <ul className="medi-footer-links">{services.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
          <div className="medi-footer-contact">
            <h2>Contact With Us</h2>
            <address>
              <div className="medi-footer-contact-row"><ContactIcon type="address" /><span>Shop 214, Aahirini Market, 2 nd floor, street 214, Action Area I, Newtown, West Bengal 700156</span></div>
              <a className="medi-footer-contact-row" href="tel:+917085448780"><ContactIcon type="phone" /><span>+91 98301 75488</span></a>
              <a className="medi-footer-contact-row" href="mailto:info@wellcareclinic.com"><ContactIcon type="email" /><span>carencureresearchlab@gmail.com</span></a>
            </address>
          </div>
        </div>
        <div className="medi-footer-bottom"><p>Copyright © {new Date().getFullYear()} Meditwin. All Rights Reserved.</p></div>
      </div>
    </footer>
  );
}
