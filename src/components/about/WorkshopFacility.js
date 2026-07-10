"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const HERO_IMAGE = "/images/workshop-hero.jpg";

const GALLERY = [
  { id: 1, image: "/images/workshop-gallery-1.jpg", isVideo: false },
  { id: 2, image: "/images/workshop-gallery-2.jpg", isVideo: false },
  {
    id: 3,
    isVideo: true,
    video: "/videos/workshop-video-1.mp4",
  },
  {
    id: 4,
    isVideo: true,
    video: "/videos/workshop-video-2.mp4",
  },
];

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7-11-7Z" fill="#1a1a12" />
    </svg>
  );
}

function GalleryVideo({ item }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="gaf-workshop-gallery-image-wrap">
      <video
        ref={videoRef}
        src={item.video}
        // poster={item.image}
        controls={isPlaying}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="gaf-workshop-gallery-video"
      />
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="gaf-workshop-play-btn"
        >
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

export default function WorkshopFacility() {
  return (
    <section className="gaf-workshop-section">
      <h2 className="gaf-workshop-title">Workshop and Production Facility</h2>

      <div className="gaf-workshop-hero">
        <div className="gaf-workshop-card">
          <h3 className="gaf-workshop-card-heading">
            Workshop &amp; Production Facility
          </h3>
          <p className="gaf-workshop-card-desc">
            A quiet place where botanists, artisans, and light engineer
            life-like greenery—assembled by hand, inspected with precision,
            and crafted for lasting beauty.
          </p>

          <div className="gaf-workshop-card-actions">
            <button type="button" className="gaf-workshop-btn-outline">
              Contact Us
            </button>
            <button type="button" className="gaf-workshop-btn-solid">
              Book a Studio Visit
            </button>
          </div>
        </div>

        <div className="gaf-workshop-hero-image-wrap">
          <Image
            src={HERO_IMAGE}
            alt="Workshop and production facility"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className="gaf-workshop-hero-image"
          />
        </div>
      </div>

      <div className="gaf-workshop-gallery">
        <div className="gaf-workshop-gallery-image-wrap">
          <Image
            src={GALLERY[0].image}
            alt="Workshop interior"
            fill
            sizes="(max-width: 900px) 100vw, 38vw"
            className="gaf-workshop-gallery-image"
          />
        </div>

        <div className="gaf-workshop-gallery-image-wrap">
          <Image
            src={GALLERY[1].image}
            alt="Greenhouse"
            fill
            sizes="(max-width: 900px) 100vw, 38vw"
            className="gaf-workshop-gallery-image"
          />
        </div>

        <div className="gaf-workshop-gallery-side">
          {GALLERY.slice(2).map((item) => (
            <GalleryVideo key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}