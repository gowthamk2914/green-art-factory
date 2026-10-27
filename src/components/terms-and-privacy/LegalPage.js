"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LAST_UPDATED = "October 2026";
const CONTACT_EMAIL = "info@greenartfactory.com"; // replace with your real email

/* Each block = one section of the page. Edit the text here only. */
const TERMS = [
  {
    id: "terms-acceptance",
    title: "Acceptance of Terms",
    body: [
      "By accessing or using the Green Art Factory website, or by engaging our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of them, please do not use our website or services.",
    ],
  },
  {
    id: "terms-services",
    title: "Our Products & Services",
    body: [
      "Green Art Factory designs, supplies and installs moss walls, green walls, bespoke artificial trees, indoor landscapes, planters, water features and related biophilic solutions for residential and commercial spaces.",
      "Images, descriptions and specifications shown on this website are for general guidance. Because many of our products are handcrafted from natural materials, colours, textures and finishes may vary slightly from what is shown.",
    ],
  },
  {
    id: "terms-quotations",
    title: "Quotations & Orders",
    body: [
      "All quotations are prepared according to the project details you provide and remain valid for the period stated on the quotation. An order is confirmed only after written acceptance of our quotation and receipt of any advance payment requested.",
      "Custom and bespoke work begins once the design, size and specifications have been approved by you in writing.",
    ],
  },
  {
    id: "terms-payments",
    title: "Pricing & Payments",
    body: [
      "Prices are stated on the quotation and may exclude applicable taxes, delivery and installation unless mentioned otherwise. Payment terms, including any advance or milestone payments, will be set out in the quotation or contract for each project.",
    ],
  },
  {
    id: "terms-delivery",
    title: "Delivery & Installation",
    body: [
      "Delivery and installation timelines are estimates and may be affected by site readiness, approvals, material availability or other factors beyond our control. You are responsible for ensuring safe access to the site and any permissions needed for the work.",
    ],
  },
  {
    id: "terms-care",
    title: "Care & Maintenance",
    body: [
      "Preserved and artificial products are low maintenance but not maintenance free. To retain their appearance, they should be kept away from direct water, strong sunlight and excessive humidity, unless we advise otherwise. Care guidance is provided with your installation.",
    ],
  },
  {
    id: "terms-changes-cancel",
    title: "Changes & Cancellations",
    body: [
      "Requests to change or cancel an order should be made in writing as early as possible. Custom or made-to-order items that are already in production may not be cancellable, and costs already incurred may be charged.",
    ],
  },
  {
    id: "terms-warranty",
    title: "Warranty & Liability",
    body: [
      "We take care to deliver work of high quality. Any warranty offered will be stated in your quotation or contract. Our liability is limited to the value of the products or services supplied, and we are not liable for indirect or consequential losses, to the extent permitted by law.",
    ],
  },
  {
    id: "terms-ip",
    title: "Intellectual Property",
    body: [
      "All content on this website, including text, images, videos, logos and designs, belongs to Green Art Factory or its licensors and may not be copied, reproduced or used without our written permission.",
    ],
  },
  {
    id: "terms-law",
    title: "Governing Law",
    body: [
      "These Terms and Conditions are governed by the laws of the United Arab Emirates. Any dispute will be subject to the jurisdiction of the competent courts of the UAE.",
    ],
  },
];

const PRIVACY = [
  {
    id: "privacy-collect",
    title: "Information We Collect",
    body: [
      "We collect information that you give us directly, such as your name, email address, mobile number and project details when you submit an enquiry through our contact form or message us on WhatsApp.",
      "We may also collect basic technical information, such as your browser type, device and pages visited, to help us understand how our website is used.",
    ],
  },
  {
    id: "privacy-use",
    title: "How We Use Your Information",
    body: [
      "We use your information to respond to your enquiries, prepare quotations, deliver our products and services, improve our website, and share updates about our work where you have agreed to receive them.",
    ],
  },
  {
    id: "privacy-sharing",
    title: "Sharing of Information",
    body: [
      "We do not sell your personal information. We may share it only with trusted partners who help us run our business, such as hosting, communication or delivery providers, or where required by law. These parties are expected to protect your information.",
    ],
  },
  {
    id: "privacy-cookies",
    title: "Cookies & Analytics",
    body: [
      "Our website may use cookies and similar technologies to keep the site working properly and to understand visitor activity. You can control or delete cookies through your browser settings, though some features may not work as intended.",
    ],
  },
  {
    id: "privacy-third",
    title: "Third-Party Services",
    body: [
      "Our website may embed or link to third-party services such as YouTube videos, WhatsApp and Cloudinary-hosted media. These services have their own privacy policies, and we encourage you to review them.",
    ],
  },
  {
    id: "privacy-security",
    title: "Data Security & Retention",
    body: [
      "We take reasonable steps to protect your information from unauthorised access, loss or misuse. We keep your information only for as long as needed for the purposes described above or as required by law.",
    ],
  },
  {
    id: "privacy-rights",
    title: "Your Rights",
    body: [
      "You may request access to the personal information we hold about you, ask us to correct or delete it, or withdraw your consent to marketing communications at any time by contacting us.",
    ],
  },
  {
    id: "privacy-children",
    title: "Children’s Privacy",
    body: [
      "Our website and services are not directed at children, and we do not knowingly collect personal information from anyone under the age of 18.",
    ],
  },
  {
    id: "privacy-changes",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the date it was last updated.",
    ],
  },
];

function LegalSection({ section, index }) {
  return (
    <article id={section.id} className="gaf-legal-block">
      <h3 className="gaf-legal-block-title">
        <span className="gaf-legal-block-no">
          {String(index + 1).padStart(2, "0")}
        </span>
        {section.title}
      </h3>
      {section.body.map((p, i) => (
        <p key={i} className="gaf-legal-text">
          {p}
        </p>
      ))}
    </article>
  );
}

export default function TermsAndPrivacyPage() {
  const [activeId, setActiveId] = useState("terms");

  // Highlight the side menu item for whichever section is on screen
  useEffect(() => {
    const ids = [
      "terms",
      ...TERMS.map((s) => s.id),
      "privacy",
      ...PRIVACY.map((s) => s.id),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const inTerms = activeId === "terms" || activeId.startsWith("terms-");

  return (
    <>
      <div className="breadcrumb container">
        <Link href="/" className="breadcrumb-item">
          Home
        </Link>

        <i className="bi bi-chevron-right breadcrumb-arrow"></i>

        <Link href="/terms-and-privacy" className="breadcrumb-item active">
          Terms &amp; Privacy
        </Link>
      </div>

      <section className="gaf-legal-section">
        <div className="gaf-legal-inner">
          {/* Heading */}
          <header className="gaf-legal-header">
            <span className="gaf-legal-eyebrow">Legal</span>
            <h1 className="gaf-legal-title">Terms &amp; Privacy</h1>
            <p className="gaf-legal-intro">
              Please read these terms and our privacy policy carefully. They
              explain how you may use our website and services, and how we
              look after your information.
            </p>
            {/* <p className="gaf-legal-updated">Last updated: {LAST_UPDATED}</p> */}
          </header>

          {/* Quick switch between the two parts */}
          <div className="gaf-legal-switch">
            <a
              href="#terms"
              onClick={goTo("terms")}
              className={`gaf-legal-switch-btn ${
                inTerms ? "gaf-legal-switch-btn--active" : ""
              }`}
            >
              Terms &amp; Conditions
            </a>
            <a
              href="#privacy"
              onClick={goTo("privacy")}
              className={`gaf-legal-switch-btn ${
                !inTerms ? "gaf-legal-switch-btn--active" : ""
              }`}
            >
              Privacy Policy
            </a>
          </div>

          <div className="gaf-legal-layout">
            {/* Sticky side menu */}
            <aside className="gaf-legal-sidebar">
              <p className="gaf-legal-sidebar-heading">Terms &amp; Conditions</p>
              <ul className="gaf-legal-sidebar-list">
                {TERMS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={goTo(s.id)}
                      className={`gaf-legal-sidebar-link ${
                        activeId === s.id ? "gaf-legal-sidebar-link--active" : ""
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>

              <p className="gaf-legal-sidebar-heading">Privacy Policy</p>
              <ul className="gaf-legal-sidebar-list">
                {PRIVACY.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={goTo(s.id)}
                      className={`gaf-legal-sidebar-link ${
                        activeId === s.id ? "gaf-legal-sidebar-link--active" : ""
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Content */}
            <div className="gaf-legal-content">
              <div id="terms" className="gaf-legal-card">
                <span className="gaf-legal-badge">Part 1</span>
                <h2 className="gaf-legal-heading">
                  Terms <span className="gaf-legal-accent">&amp; Conditions</span>
                </h2>
                {TERMS.map((s, i) => (
                  <LegalSection key={s.id} section={s} index={i} />
                ))}
              </div>

              <div id="privacy" className="gaf-legal-card">
                <span className="gaf-legal-badge">Part 2</span>
                <h2 className="gaf-legal-heading">
                  Privacy <span className="gaf-legal-accent">Policy</span>
                </h2>
                {PRIVACY.map((s, i) => (
                  <LegalSection key={s.id} section={s} index={i} />
                ))}
              </div>

              {/* Contact */}
              <div className="gaf-legal-contact">
                <div>
                  <h3 className="gaf-legal-contact-title">
                    Questions about these terms?
                  </h3>
                  <p className="gaf-legal-contact-text">
                    Reach out and our team will be happy to help.
                    <br />
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                </div>
                <Link href="/contact" className="gaf-legal-contact-btn">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}