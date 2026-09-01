"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogHero() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="livingwall-wrap container mx-auto">

        {/* decorative "stacked card" peeking behind the text card */}
        <div className="livingwall-decor" aria-hidden="true" />

        {/* image card */}
        <article className="livingwall-image-card">
          <Image
            src="/images/blog-hero.png"
            alt="Close-up of a moss wall installation next to a wood-panelled door"
            fill
            className="livingwall-image"
            priority
          />
          <div className="livingwall-scrim" aria-hidden="true" />

          <span className="livingwall-badge">MOSS WALLS</span>

          <div className="livingwall-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>6 min read</span>
            <span className="livingwall-meta-dot">—</span>
            <span>June 2025</span>
          </div>
        </article>

        {/* text card */}
        <div className="livingwall-text-card">
          <h2 className="livingwall-heading">
            Living Walls — The Architecture of{" "}
            <span className="livingwall-heading-accent">Living Greenery</span>
          </h2>

          <p className="livingwall-copy">
            How moss walls are redefining the boundaries between architecture and nature —
            transforming blank surfaces into immersive botanical experiences that breathe life
            into any interior.
          </p>

          <Link href="/blog/designing-spaces-that-feel-alive-with-nature" className="livingwall-cta">
            READ STORY
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}