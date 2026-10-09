"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "../../public/images/logo/medi-logo.png";
import PlayStoreButton from "../PlayStoreButton/page";
import "./navbar.css";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  const closeMenus = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    function handlePointer(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="medi-header" ref={headerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeMenus();
    }}>
      <nav className="navbar navbar-expand-lg medi-navbar" aria-label="Main navigation">
        <div className=  "container-xxl  medi-navbar-container">
          <Link className="navbar-brand medi-brand" href="/" onClick={closeMenus} aria-label="Care-n-Cure Wellness home">
            <Image src={logo} alt="Care-n-Cure Wellness" className="medi-logo" preload sizes="150px" />
          </Link>

          <button ref={toggleRef} className="navbar-toggler medi-menu-toggle" type="button"
            aria-controls="medi-navigation" aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`medi-menu-icon${menuOpen ? " is-open" : ""}`} aria-hidden="true"><span /><span /><span /></span>
          </button>

          <div id="medi-navigation" className={`collapse navbar-collapse medi-navigation${menuOpen ? " show" : ""}`}>
            <ul className="navbar-nav medi-nav-links">
              {links.map(({ label, href }) => (
                <li className="nav-item" key={href}>
                  <Link href={href} className={`nav-link medi-nav-link${isActive(href) ? " active" : ""}`}
                    aria-current={isActive(href) ? "page" : undefined} onClick={closeMenus}>{label}</Link>
                </li>
              ))}
            </ul>
            <div className="medi-nav-actions">
              <PlayStoreButton onClick={closeMenus} />
              <Link href="#" className="btn medi-appointment" onClick={closeMenus}>Book Appointment</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
