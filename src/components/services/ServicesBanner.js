"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const BANNER_IMAGE =
  "/images/services-banner-img.png";

const STATS = [
  { value: "98%", label: "Client Satisfaction Rate" },
  { value: "2.4k+", label: "Plants Under Our Care" },
];

export default function ServicesBanner() {
  return (
    <section className="servicesBannerSection" aria-label="Our services">
      <div className="servicesBannerMedia">
        <Image
          src={BANNER_IMAGE}
          alt="Nature-integrated architecture surrounded by lush greenery"
          fill
          priority
          sizes="100vw"
          className="servicesBannerImage"
        />
        <div className="servicesBannerGradient" aria-hidden="true" />
      </div>

      <div className="servicesBannerContent">
        <span className="servicesBannerEyebrow">Our Services</span>

        <h1 className="servicesBannerTitle">
          We Bring Nature&rsquo;s Balance To Every Space.
        </h1>

        <p className="servicesBannerDescription">
          From Plant Maintenance To Rentals And Temporary Landscapes, We
          Create And Care For Green Environments That Inspire, Refresh, And
          Elevate Everyday Spaces.
        </p>

        <Link href="/products" className="servicesBannerCta">
          <span>Explore Products</span>
          <span className="servicesBannerCtaIcon" aria-hidden="true">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </span>
        </Link>

        <div className="servicesBannerStatsCard">
          <div className="servicesBannerStatsRow">
            {STATS.map((stat, index) => (
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