"use client";

const PROCESS_STEPS = [
  {
    display_no: "01",
    title: "Our Challenge",
    description:
      "The client required a large-scale greenery feature for a high-traffic corporate lobby, where natural trees were impractical due to lighting constraints, maintenance demands, and long-term durability concerns \u2014 without sacrificing the authentic look and calming presence of real foliage.",
  },
  {
    display_no: "02",
    title: "Our Solution",
    description:
      "Green Art Factory designed and fabricated custom artificial olive trees, precisely scaled to the atrium's ceiling height and structural columns. Each tree was built using fire-retardant, UV-stable materials and hand-finished for realistic bark texture and leaf variation, delivering permanent greenery with zero upkeep.",
  },
  {
    display_no: "03",
    title: "Our Execution",
    description:
      "Installation was carried out in phases to align with the building's occupancy schedule. Our craftsmen assembled the tree structures on-site, layering foliage by hand to achieve natural density and asymmetry, followed by a final quality inspection against the architectural drawings.",
  },
];

function ProcessRow({ step, isAlt }) {
  return (
    <div
      className={`projectDetailProcessRow${isAlt ? " isAlt" : ""}`}
    >
      <div className="projectDetailProcessInner">
        <div className="projectDetailProcessHeadingCol">
          <span className="projectDetailProcessNumber">{step.display_no}</span>
          <h3 className="projectDetailProcessTitle">{step.title}</h3>
        </div>

        <p className="projectDetailProcessDescription">{step.description}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailProcess() {
  return (
    <section className="projectDetailProcessSection" aria-label="Project process">
      {PROCESS_STEPS.map((step, index) => (
        <ProcessRow key={step.display_no} step={step} isAlt={index % 2 === 1} />
      ))}
    </section>
  );
}