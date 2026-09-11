"use client";

const HIGHLIGHTS = [
  {
    title: "Bespoke Artificial Olive Trees",
    description: "Five Trees, Each 4m Tall With Mature, Realistic Trunks.",
  },
  {
    title: "Trunk Craftsmanship",
    description:
      "Carefully Selected And Treated Trunks For Authentic Appearance And Durability.",
  },
  {
    title: "Detailed Planning",
    description: "Sketch Drawings Prepared And Approved Before Production.",
  },
  {
    title: "Safe Transport & Handling",
    description: "Coordinated Road Transport From UAE To KSA.",
  },
  {
    title: "Secure Installation",
    description: "Cement And Gypsum Anchoring For Long-Term Stability.",
  },
  {
    title: "Corporate Lobby Integration",
    description: "Designed To Harmonize With Head Office Interior Aesthetics.",
  },
];

function HighlightBullet() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="projectDetailKeyHighlightsBulletIcon"
    >
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function HighlightItem({ title, description }) {
  return (
    <div className="projectDetailKeyHighlightsItem">
      <span className="projectDetailKeyHighlightsBullet" aria-hidden="true">
        <HighlightBullet />
      </span>
      <div className="projectDetailKeyHighlightsText">
        <h3 className="projectDetailKeyHighlightsItemTitle">{title}</h3>
        <p className="projectDetailKeyHighlightsItemDescription">{description}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailKeyHighlights() {
  return (
    <section className="projectDetailKeyHighlightsSection" aria-label="Key highlights">
      <div className="projectDetailKeyHighlightsCard">
        <h2 className="projectDetailKeyHighlightsTitle">Key Highlights</h2>

        <div className="projectDetailKeyHighlightsGrid">
          {HIGHLIGHTS.map((highlight) => (
            <HighlightItem key={highlight.title} {...highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}