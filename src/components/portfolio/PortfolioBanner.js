"use client";

import Image from "next/image";

export default function PortfolioBanner({
  eyebrow = "Portfolio",
  title = "Creating Living Spaces Inspired By Nature, Designed For Modern Living",
  description = "Explore Curated Landscape And Botanical Installations That Transform Everyday Environments Into Memorable Experiences.",
  ctaLabel = "View Products",
  ctaHref = "/products",
  backgroundImage = "/images/portfolio-hero-banner.jpg",
}) {
  return (
    <section className="portfolio-banner">
      <div className="portfolio-banner-bg">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="portfolio-banner-bg-img"
        />
      </div>

      <div className="portfolio-banner-container">
        <div className="portfolio-banner-card">
          <span className="portfolio-banner-eyebrow">{eyebrow}</span>

          <h1 className="portfolio-banner-title">{title}</h1>

          <p className="portfolio-banner-desc">{description}</p>

          <a href={ctaHref} className="portfolio-banner-cta">
            <span>{ctaLabel}</span>
            <span className="portfolio-banner-cta-icon" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}