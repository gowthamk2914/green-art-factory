"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="gaf-categories-section">
      <Image
        src="/images/category-hero-bg.jpg"
        alt="Category Background"
        fill
        priority
        className="gaf-categories-bg"
      />

      <div className="gaf-categories-card">
        <h2 className="gaf-categories-heading">Categories</h2>
        <p className="gaf-categories-subtext">
          Explore our curated collection of botanical creations designed to
          transform modern spaces through natural textures, timeless greenery,
          and elevated design experiences.
        </p>
      </div>
    </section>
  );
}