"use client";

import Image from "next/image";

// Sample data — replace with the single article fetched from your API
// (e.g. via slug/id route param). Keep this shape:
//   { date, readTime, title, image, imageAlt }
// `date` and `readTime` are expected pre-formatted strings since date
// formatting/localization usually happens server-side or in a selector.
const ARTICLE = {
  date: "May 07, 2026",
  readTime: "10 Mins Read",
  title: "Green Living Spaces",
  image: "/images/quote-section-img.png",
  imageAlt: "Green Art Factory artisan hand-placing moss onto a world map installation",
};

export default function BlogDetailHero({ article = ARTICLE, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="blog-hero-section">
        <div className="container">
          <div className="blog-hero-meta blog-hero-skeleton-line blog-hero-skeleton-meta" />
          <div className="blog-hero-skeleton-line blog-hero-skeleton-title" />
          <div className="blog-hero-image-wrap blog-hero-skeleton-image" />
        </div>
      </section>
    );
  }

  const { date, readTime, title, image, imageAlt } = article;

  return (
    <section className="blog-hero-section">
      <div className="container">
        <p className="blog-hero-meta">
          {date}
          {readTime && (
            <>
              <span className="blog-hero-meta-dot">.</span>
              {readTime}
            </>
          )}
        </p>

        <h1 className="blog-hero-title">{title}</h1>

        <div className="blog-hero-image-wrap">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            priority
            className="blog-hero-image"
          />
        </div>
      </div>
    </section>
  );
}