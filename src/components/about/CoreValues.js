"use client";

import { useEffect, useRef, useState } from "react";
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
  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Subtle pointer-driven tilt on the image. Writes CSS custom
     properties directly to the DOM node instead of React state, so
     mousemove doesn't trigger re-renders. */
  const handlePointerMove = (e) => {
    const el = imageWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--gaf-cv-tilt-x", `${(y * -8).toFixed(2)}deg`);
    el.style.setProperty("--gaf-cv-tilt-y", `${(x * 8).toFixed(2)}deg`);
  };

  const handlePointerLeave = () => {
    const el = imageWrapRef.current;
    if (!el) return;
    el.style.setProperty("--gaf-cv-tilt-x", "0deg");
    el.style.setProperty("--gaf-cv-tilt-y", "0deg");
  };

  return (
    <section
      ref={sectionRef}
      className={`gaf-cv-section ${
        isVisible ? "gaf-cv-section--visible" : ""
      }`}
    >
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

        <div
          ref={imageWrapRef}
          className="gaf-cv-image-wrap"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
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