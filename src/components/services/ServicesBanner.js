"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const BANNER_IMAGE = "/images/services-banner-img.webp";

const STATS = [
  { value: "98%", label: "Client Satisfaction Rate" },
  { value: "2.4k+", label: "Plants Under Our Care" },
];

export default function ServicesBanner() {
  return (
    <section className="servicesBannerSection" aria-label="Our services">
      {/* Photo: sits on the right of the banner (see --services-banner-offset in the CSS) */}
      <div className="servicesBannerMedia">
        <Image
          src={BANNER_IMAGE}
          alt="Green Art Factory team in front of a living green wall"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 76vw"
          className="servicesBannerImage"
        />
      </div>

      {/* Gradient now covers the whole banner, so the cream fades into the photo */}
      <div className="servicesBannerGradient" aria-hidden="true" />

      <div className="servicesBannerContent">
        <div className="breadcrumb">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>

          <i className="bi bi-chevron-right breadcrumb-arrow"></i>

          <Link href="/services" className="breadcrumb-item active">
            Services
          </Link>
        </div>

        <h1 className="servicesBannerTitle">
          We Bring Nature&rsquo;s Balance To Every Space.
        </h1>

        <p className="servicesBannerDescription">
          From plant maintenance to rentals and temporary landscapes, we create
          and care for green environments that inspire, refresh, and elevate
          everyday spaces.
        </p>

        <Link href="/products-list" className="servicesBannerCta">
          <span>Explore Products</span>
          <span className="servicesBannerCtaIcon" aria-hidden="true">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </span>
        </Link>

        <div className="servicesBannerStatsCard">
          <div className="servicesBannerStatsRow">
            {STATS.map((stat) => (
              <div key={stat.label} className="servicesBannerStat">
                <span className="servicesBannerStatValue">{stat.value}</span>
                <span className="servicesBannerStatLabel">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="servicesBannerStatsFootnote">
            Trusted by leading hotels, premium offices, and luxury residences
            across the region for over 15 years.
          </p>
        </div>
      </div>
    </section>
  );
}