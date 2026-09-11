"use client";

const WHY_CHOOSE_US_ITEMS = [
  {
    display_no: "01",
    title: "Nature, Reimagined",
    description:
      "We recreate the beauty of natural trees with meticulous artistry, capturing every detail from bark texture to leaf variation.",
  },
  {
    display_no: "02",
    title: "Bespoke Designs",
    description:
      "Every installation is custom-designed to fit the exact scale, style, and character of the space it inhabits.",
  },
  {
    display_no: "03",
    title: "Premium Craftsmanship",
    description:
      "Skilled artisans hand-finish every piece using premium, commercial-grade materials for lasting quality.",
  },
  {
    display_no: "04",
    title: "Low Maintenance",
    description:
      "No watering, pruning, or specialized care needed \u2014 enjoy permanent greenery with effortless upkeep.",
  },
  {
    display_no: "05",
    title: "Sustainable Living",
    description:
      "Our materials and processes are chosen with a long-term view toward reducing environmental impact.",
  },
];

function WhyChooseUsItem({ display_no, title, description }) {
  return (
    <div className="projectDetailWhyChooseUsItem">
      <span className="projectDetailWhyChooseUsNumber">{display_no}</span>
      <div className="projectDetailWhyChooseUsText">
        <h3 className="projectDetailWhyChooseUsItemTitle">{title}</h3>
        <p className="projectDetailWhyChooseUsItemDescription">{description}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailWhyChooseUs() {
  return (
    <section className="projectDetailWhyChooseUsSection" aria-label="Why choose us">
      <div className="projectDetailWhyChooseUsCard">
        <h2 className="projectDetailWhyChooseUsTitle">Why Choose Us?</h2>

        <div className="projectDetailWhyChooseUsList">
          {WHY_CHOOSE_US_ITEMS.map((item) => (
            <WhyChooseUsItem key={item.display_no} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}