import Image from "next/image";

/* Replace with your real files in /public */
const ROWS = [
  {
    id: "mission",
    heading: "Our Mission",
    paragraph:
      "Our mission is to empower businesses with innovative digital solutions that drive sustainable growth and long-term success. We combine creativity, technology, and strategic thinking to build impactful products and experiences. By understanding every client's unique goals, we deliver solutions that are reliable, scalable, and future-ready. We are committed to maintaining the highest standards of quality, transparency, and collaboration in every project. Through continuous innovation and customer-focused excellence, we strive to create lasting value for businesses worldwide.",
    image: "/images/mission-img.png",
    reverse: false,
  },
  {
    id: "vision",
    heading: "Our Vision",
    paragraph:
      "Our vision is to become a trusted global leader in digital innovation, transforming the way businesses grow and connect in a technology-driven world. We envision a future where creativity and technology work seamlessly together to solve complex challenges. By embracing innovation and continuous improvement, we aim to deliver solutions that inspire progress and create meaningful impact. We strive to build lasting partnerships founded on trust, excellence, and shared success. Our goal is to shape a smarter, more connected future for businesses and communities alike.",
    image: "/images/vision-img.png",
    reverse: true,
  },
];

function MissionVisionRow({ row }) {
  return (
    <div className={`gaf-mv-row ${row.reverse ? "gaf-mv-row--reverse" : ""}`}>

      <div className="gaf-mv-panel">
        <p className="gaf-mv-paragraph">{row.paragraph}</p>
              <div className="gaf-mv-circle">
        <Image
          src={row.image}
          alt={row.heading}
          fill
          sizes="(max-width: 768px) 260px, 380px"
          className="gaf-mv-circle-img"
        />
      </div>
      </div>

      <div className="gaf-mv-heading-wrap">
        <h2 className="gaf-mv-heading">{row.heading}</h2>
      </div>
    </div>
  );
}

export default function MissionVision() {
  return (
    <section className="gaf-mv-section">
      {ROWS.map((row) => (
        <MissionVisionRow key={row.id} row={row} />
      ))}
    </section>
  );
}