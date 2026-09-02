import Image from "next/image";

/* Replace with your real logo file in /public */
const LOGO_IMAGE = "/images/gaf-footer-logo.png";

const NAV_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products-list" },
  { label: "Contact us", href: "/contact" },
];

const CONTACT_INFO = [
  {
    id: "address",
    icon: "pin",
    text: "Floristics Garden Street, Al Warsan, Dubai, UAE",
    href: null,
  },
  {
    id: "phone",
    icon: "phone",
    text: "(+971) 56 9588 315",
    href: "tel:+971569588315",
  },
  {
    id: "email",
    icon: "mail",
    text: "info@greenartfactory.com",
    href: "mailto:info@greenartfactory.com",
  },
];

const SOCIAL_LINKS = [
  { id: "facebook", icon: "facebook", href: "https://facebook.com" },
  { id: "x", icon: "x", href: "https://x.com" },
  { id: "instagram", icon: "instagram", href: "https://instagram.com" },
  { id: "whatsapp", icon: "whatsapp", href: "https://wa.me/971569588315" },
];

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="white" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4.5c0 8.3 6.7 15 15 15 .7 0 1.3-.5 1.4-1.2l.5-3a1.5 1.5 0 0 0-1-1.7l-3.4-1.2a1.5 1.5 0 0 0-1.6.4l-1 1.1a11.4 11.4 0 0 1-5.3-5.3l1.1-1a1.5 1.5 0 0 0 .4-1.6L8.9 3.6a1.5 1.5 0 0 0-1.7-1l-3 .5A1.5 1.5 0 0 0 3 4.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
      <path d="M4 6.5 12 13l8-6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialIcon({ type }) {
  switch (type) {
    case "facebook":
      return (
       <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="#fff" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
</svg>

      );
    case "x":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
	<path d="M0 0h16v16H0z" fill="none" />
	<path fill="#fff" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z" />
</svg>

      );
    case "instagram":
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" />
          <circle cx="17.3" cy="6.7" r="1" fill="white" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="#fff" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
</svg>

      );
    default:
      return null;
  }
}

function ContactIcon({ type }) {
  if (type === "pin") return <PinIcon />;
  if (type === "phone") return <PhoneIcon />;
  if (type === "mail") return <MailIcon />;
  return null;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="gaf-footer">
      <div className="gaf-footer-top">
        <div className="gaf-footer-brand">
          <div className="gaf-footer-logo-row">
            <span className="gaf-footer-logo-badge">
              <Image
                src={LOGO_IMAGE}
                alt="Green Art Factory logo"
                width={64}
                height={64}
                className="gaf-footer-logo-img"
              />
            </span>
            <h2 className="gaf-footer-brand-name">Green Art Factory</h2>
          </div>
          <p className="gaf-footer-brand-desc">
            As a leading Interior Landscape and Biophilic Design company in
            Dubai, UAE, we specialize in Preserved Moss Walls, Living Green
            Walls, Vertical Gardens, and bespoke greenery solutions that
            bring beauty, wellness, and sustainability to every space.
          </p>
        </div>

        <nav className="gaf-footer-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="gaf-footer-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="gaf-footer-contact">
          <ul className="gaf-footer-contact-list">
            {CONTACT_INFO.map((item) =>
              item.href ? (
                <li key={item.id} className="gaf-footer-contact-item">
                  <span className="gaf-footer-contact-icon">
                    <ContactIcon type={item.icon} />
                  </span>
                  <a href={item.href} className="gaf-footer-contact-text">
                    {item.text}
                  </a>
                </li>
              ) : (
                <li key={item.id} className="gaf-footer-contact-item">
                  <span className="gaf-footer-contact-icon">
                    <ContactIcon type={item.icon} />
                  </span>
                  <span className="gaf-footer-contact-text">{item.text}</span>
                </li>
              )
            )}
          </ul>

          <div className="gaf-footer-social-row">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.id}
                className="gaf-footer-social-icon"
              >
                <SocialIcon type={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="gaf-footer-divider" />

      <div className="gaf-footer-bottom">
        <p className="gaf-footer-copyright">
          Copyright © {year}{" "}
          <a href="/" className="gaf-footer-copyright-link">
            Green Art Factory
          </a>{" "}
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}