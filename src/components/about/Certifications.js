import Image from "next/image";

const CERT_PHOTO = "/images/certification-frame.png";
const PLANT_PHOTO = "/images/certifications-plants.jpg";

const CERTIFICATIONS = [
  {
    id: "iso-9001",
    badge: "/images/iso-1.jpg",
    title: "ISO 9001:2015",
    subtitle: "Quality Management System",
    description:
      "Recognized for maintaining the highest standards in quality management and customer satisfaction.",
  },
  {
    id: "iso-14001",
    badge: "/images/iso-2.jpg",
    title: "ISO 14001:2015",
    subtitle: "Environmental Management",
    description:
      "Certified for our commitment to environmental protection and sustainable practices.",
  },
  {
    id: "iso-45001",
    badge: "/images/iso-3.jpg",
    title: "ISO 45001:2018",
    subtitle: "Occupational Health & Safety",
    description:
      "Ensuring a safe and healthy workplace through internationally recognized standards.",
  },
];

const FEATURES = [
  {
    id: "trusted",
    icon: "leaf",
    title: "Trusted Standards",
    description: "Globally recognized certifications.",
  },
  {
    id: "quality",
    icon: "shield",
    title: "Quality Assured",
    description: "Excellence in every project we deliver.",
  },
  {
    id: "sustainable",
    icon: "sprout",
    title: "Sustainable Impact",
    description: "Creating greener spaces for a better tomorrow.",
  },
  {
    id: "confidence",
    icon: "people",
    title: "Client Confidence",
    description: "Building trust through transparency and care.",
  },
];

function LeafSilhouette() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#5a5f4d">
      <path d="M20 4C10 4 4 10 4 18c0 .5.5 1 1 1 8 0 14-6 14-14 0-.5-.4-1-1-1Z" />
    </svg>
  );
}

function FeatureIcon({ type }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };
  switch (type) {
    case "leaf":
      return (
        <svg {...common}>
          <path
            d="M20 4C10 4 4 10 4 18c0 .5.5 1 1 1 8 0 14-6 14-14 0-.5-.4-1-1-1Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sprout":
      return (
        <svg {...common}>
          <path
            d="M12 21V9a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v3M12 12a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v3"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" stroke="white" strokeWidth="1.8" />
          <path
            d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 8a3 3 0 1 1 0 6M21 20c0-2.8-1.8-5-4-5.8"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function CertCard({ cert }) {
  return (
    <div className="gaf-cert-card">
      <span className="gaf-cert-badge">
        <Image src={cert.badge} alt={cert.title} width={44} height={44} />
      </span>

      <div className="gaf-cert-card-text">
        <h3 className="gaf-cert-card-title">{cert.title}</h3>
        <p className="gaf-cert-card-subtitle">{cert.subtitle}</p>
        <p className="gaf-cert-card-desc">{cert.description}</p>
      </div>

      <span className="gaf-cert-card-leaf">
        <LeafSilhouette />
      </span>
    </div>
  );
}

export default function Certifications() {
  return (
    <section className="gaf-cert-section">
      <h2 className="gaf-cert-title">Certifications</h2>

      <div className="gaf-cert-grid">
        <div className="gaf-cert-media">
          <div className="gaf-cert-image-wrap gaf-cert-image-wrap--tall">
            <Image
              src={CERT_PHOTO}
              alt="Green Art Factory certificate"
              fill
              sizes="(max-width: 900px) 100vw, 30vw"
              className="gaf-cert-image"
            />
          </div>
          <div className="gaf-cert-image-wrap gaf-cert-image-wrap--short">
            <Image
              src={PLANT_PHOTO}
              alt="Plants"
              fill
              sizes="(max-width: 900px) 100vw, 30vw"
              className="gaf-cert-image"
            />
          </div>
        </div>

        <div className="gaf-cert-list">
          {CERTIFICATIONS.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </div>

        <div className="gaf-cert-copy">
          <h3 className="gaf-cert-heading">
            Certified Excellence.
            <br />
            <span className="gaf-cert-heading-accent">
              Sustainable Commitment.
            </span>
          </h3>
          <p className="gaf-cert-paragraph">
            Our certifications reflect our unwavering commitment to the
            highest standards of quality, sustainability, and safety in every
            project we undertake. Every process is guided by
            industry-recognized best practices, ensuring exceptional
            craftsmanship, environmental responsibility, and long-lasting
            results. We continuously strive to create healthier, greener
            spaces while maintaining excellence, innovation, and reliability
            in every detail.
          </p>
        </div>
      </div>

      <div className="gaf-cert-features">
        {FEATURES.map((feature, i) => (
          <div className="gaf-cert-feature" key={feature.id}>
            <span className="gaf-cert-feature-icon">
              <FeatureIcon type={feature.icon} />
            </span>
            <div className="gaf-cert-feature-text">
              <h4 className="gaf-cert-feature-title">{feature.title}</h4>
              <p className="gaf-cert-feature-desc">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}