"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Replace with your real files in /public */
const ROWS = [
  {
    id: "mission",
    heading: "Our Mission",
    paragraph:
      "Our mission is to deliver exceptional craftsmanship and innovative designs that redefine green installations. We aim to promote the benefits of biophilic design, enhancing wellbeing, productivity, and aesthetic appeal in every space we create. Committed to sustainability, we provide long-lasting, eco-conscious solutions that are tailored to each client’s unique vision. Above all, we strive to maintain the highest standards of quality and service, guiding every project seamlessly from concept to completion and beyond.",
    image: "/images/mission-img.png",
    reverse: false,
  },
  {
    id: "vision",
    heading: "Our Vision",
    paragraph:
      "Green Art Factory is more than just a vision—it’s a movement that celebrates the harmony between nature, design, and innovation. Every project we undertake reflects our passion for creating spaces that breathe life, inspire creativity, and promote sustainability. And at the heart of this movement are our people. Each team member plays a vital role in shaping environments that connect humans with nature in meaningful ways.",
    image: "/images/vision-img.png",
    reverse: true,
  },
];

function MissionVisionRow({ row }) {
  const rowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Progressive enhancement: no IntersectionObserver support just
    // shows the content immediately, no animation gate.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`gaf-mv-row ${row.reverse ? "gaf-mv-row--reverse" : ""} ${
        isVisible ? "gaf-mv-row--visible" : ""
      }`}
    >

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