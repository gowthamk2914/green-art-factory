"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

const DEFAULT_TITLE =
  "Creating Living Spaces Inspired By Nature, Designed For Modern Living";
const DEFAULT_DESCRIPTION =
  "Explore Curated Landscape And Botanical Installations That Transform Everyday Environments Into Memorable Experiences.";

export default function PortfolioBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  backgroundImage = "/images/portfolio-hero-banner.jpg",
}) {
  // Fallback chain: explicit prop > Redux store (data.section) > hardcoded
  // default. This means the banner renders correctly whether a parent
  // page passes `section` fields down as props, or does nothing at all
  // and just dispatches getPortfolioPageRequest() — either way it's
  // guaranteed to show real content once the API responds.
  const section = useSelector((state) => state.Portfolio?.data?.section);

  const finalEyebrow = eyebrow ?? section?.subtitle ?? "Portfolio";
  const finalTitle = title ?? section?.title ?? DEFAULT_TITLE;
  const finalDescription = description ?? section?.description ?? DEFAULT_DESCRIPTION;
  const finalCtaLabel = ctaLabel ?? section?.cta_label ?? "View Products";
  const finalCtaHref = ctaHref ?? section?.cta_url ?? "/products";

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
          <span className="portfolio-banner-eyebrow">{finalEyebrow}</span>

          <h1 className="portfolio-banner-title">{finalTitle}</h1>

          <p className="portfolio-banner-desc">{finalDescription}</p>

          <a href="/products-list" className="portfolio-banner-cta">
            <span>{finalCtaLabel}</span>
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