"use client";

import Image from "next/image";

export default function GalleryHero({
  title = "View Our Gallery",
  backgroundImage = "/images/gallery-hero-bg.jpg",
}) {
  return (
    <section className="galleryHeroSection" aria-label="Gallery">
      <div className="galleryHeroBg">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="galleryHeroBgImg"
        />
        <div className="galleryHeroOverlay" />
      </div>

      <div className="galleryHeroContent">
        <h1 className="galleryHeroTitle">{title}</h1>
      </div>
    </section>
  );
}