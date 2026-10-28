"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/images/workshop-hero.jpg";

const GALLERY = [
  { id: 1, image: "/images/workshop-gallery-1.jpg", isVideo: false },
  { id: 2, image: "/images/workshop-gallery-2.jpg", isVideo: false },
  {
    id: 3,
    isVideo: true,
    video: "/videos/workshop-video-1.mp4",
    label: "Workshop video 1",
  },
  {
    id: 4,
    isVideo: true,
    video: "/videos/workshop-video-2.mp4",
    label: "Workshop video 2",
  },
];

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5v14l11-7-11-7Z" fill="#1a1a12" />
    </svg>
  );
}

/* The custom play button only appears before the first play. After
   that the native controls handle play, pause, mute, seek and
   fullscreen, so seeking never fights with our own state. */
function GalleryVideo({ item }) {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef(null);

  const handleFirstPlay = () => {
    const playPromise = videoRef.current?.play();
    // Ignore the harmless "interrupted" rejection if the user acts quickly
    if (playPromise?.catch) playPromise.catch(() => {});
  };

  return (
    <div className="gaf-workshop-gallery-image-wrap">
      <video
        ref={videoRef}
        src={item.video}
        // poster={item.image}
        controls
        playsInline
        preload="metadata"
        aria-label={item.label}
        onPlay={() => setHasStarted(true)}
        className="gaf-workshop-gallery-video"
      >
        Your browser does not support the video tag.
      </video>
      {!hasStarted && (
        <button
          type="button"
          onClick={handleFirstPlay}
          aria-label={`Play ${item.label}`}
          className="gaf-workshop-play-btn"
        >
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

export default function WorkshopFacility() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Progressive enhancement: no IntersectionObserver support just
    // shows the content immediately, no animation gate.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`gaf-workshop-section ${
        isVisible ? "gaf-workshop-section--visible" : ""
      }`}
    >
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
            <Link href="/contact">
              <button type="button" className="gaf-workshop-btn-outline">
                Contact Us
              </button>
            </Link>
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