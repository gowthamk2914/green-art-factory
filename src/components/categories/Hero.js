"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

export default function Hero() {
  const {
    data: pageData,
  } = useSelector((state) => state.NatureShowcase);

  const section = pageData?.section || {};

  return (
    <section className="gaf-categories-section">
      <Image
        src="/images/category-hero-bg.png"
        alt="Category Background"
        fill
        priority
        className="gaf-categories-bg"
      />

      <div className="gaf-categories-card">
        <h2 className="gaf-categories-heading">
          {section.title || "Products"}
        </h2>

        <p className="gaf-categories-subtext">
          {section.description ||
            "Explore our curated collection of botanical creations designed to transform modern spaces through natural textures, timeless greenery, and elevated design experiences."}
        </p>
      </div>
    </section>
  );
}