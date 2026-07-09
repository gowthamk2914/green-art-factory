import Image from "next/image";

const IMAGE = "/images/core-values.jpg";

const VALUES = [
  {
    title: "Quality First",
    description:
      "We deliver exceptional craftsmanship and premium greenery with meticulous attention to every detail.",
  },
  {
    title: "Sustainability",
    description:
      "We embrace eco-friendly practices and create greener spaces that support a healthier environment.",
  },
  {
    title: "Customer Commitment",
    description:
      "We build lasting relationships through reliable service, transparent communication, and personalized solutions.",
  },
];

export default function CoreValues() {
  return (
    <section className="gaf-cv-section">
      <h2 className="gaf-cv-title">Core Values</h2>

      <div className="gaf-cv-row">
        <div className="gaf-cv-panel">
          <p className="gaf-cv-intro">
            Our core values shape every project we create and every
            relationship we build. We are committed to quality,
            sustainability, innovation, and exceptional craftsmanship. Every
            green space reflects our passion for nature and attention to
            detail. We believe in creating lasting value through trust,
            reliability, and excellence. Together, these principles inspire
            beautiful environments that thrive for years to come.
          </p>

          <ol className="gaf-cv-list">
            {VALUES.map((value, i) => (
              <li key={value.title} className="gaf-cv-list-item">
                <span className="gaf-cv-list-title">
                  <span className="gaf-cv-list-number">{i + 1}.</span>{" "}
                  {value.title}
                </span>
                <span className="gaf-cv-list-desc">{value.description}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="gaf-cv-image-wrap">
          <Image
            src={IMAGE}
            alt="Core values"
            fill
            sizes="(max-width: 900px) 100vw, 620px"
            className="gaf-cv-image"
          />
        </div>
      </div>
    </section>
  );
}