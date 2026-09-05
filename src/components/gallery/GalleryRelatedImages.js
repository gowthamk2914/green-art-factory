"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Static placeholder data for now. Field names are kept generic
 * (slug, collection, name, image, href) so this can later be swapped for
 * data fetched from an API — the slider logic below works for any array
 * length and re-measures itself whenever the list changes.
 */

const DEFAULT_IMAGES = [
  {
    slug: "artificial-trees",
    collection: "Collection",
    name: "Artificial Trees",
    image: "/images/projects1.jpg",
    href: "/gallery/artificial-trees",
  },
  {
    slug: "vertical-gardens",
    collection: "Collection",
    name: "Vertical Gardens",
    image: "/images/projects2.jpg",
    href: "/gallery/vertical-gardens",
  },
  {
    slug: "green-ceilings",
    collection: "Collection",
    name: "Green Ceilings",
    image: "/images/projects3.jpg",
    href: "/gallery/green-ceilings",
  },
  {
    slug: "artificial-hedges",
    collection: "Collection",
    name: "Artificial Hedges",
    image: "/images/projects4.jpg",
    href: "/gallery/artificial-hedges",
  },
  {
    slug: "preserved-plants",
    collection: "Collection",
    name: "Preserved Plants",
    image: "/images/projects5.jpg",
    href: "/gallery/preserved-plants",
  },
];

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function RelatedImageCard({ item }) {
  return (
    <Link href={item.href} className="relatedImagesCard">
      <div className="relatedImagesImageFrame">
        <Image
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 70vw, 280px"
          className="relatedImagesImage"
        />
        <div className="relatedImagesOverlay" />
        <div className="relatedImagesCaption">
          <span className="relatedImagesLabel">{item.collection}</span>
          <h3 className="relatedImagesName">{item.name}</h3>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedImages({
  items = DEFAULT_IMAGES,
  title = "Related Images",
}) {
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateScrollState() {
      const { scrollLeft, scrollWidth, clientWidth } = track;

      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(
        scrollLeft + clientWidth < scrollWidth - 4
      );
    }

    updateScrollState();

    track.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [items]);

  // ============================================================
  // Automatic sliding
  // ============================================================
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length <= 1) return;

    const startAutoplay = () => {
      clearInterval(autoplayRef.current);

      autoplayRef.current = setInterval(() => {
        const maxScroll =
          track.scrollWidth - track.clientWidth;

        // If reached the end, go back to beginning
        if (track.scrollLeft >= maxScroll - 5) {
          track.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          // Move approximately one card
          const card = track.querySelector(
            ".relatedImagesCard"
          );

          if (!card) return;

          const cardWidth = card.offsetWidth;

          const gap = parseFloat(
            getComputedStyle(track).gap || "0"
          );

          track.scrollBy({
            left: cardWidth + gap,
            behavior: "smooth",
          });
        }
      }, 3500);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayRef.current);
    };

    startAutoplay();

    // Pause while user interacts with slider
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);
    track.addEventListener("touchstart", stopAutoplay, {
      passive: true,
    });
    track.addEventListener("touchend", startAutoplay, {
      passive: true,
    });

    return () => {
      clearInterval(autoplayRef.current);

      track.removeEventListener("mouseenter", stopAutoplay);
      track.removeEventListener("mouseleave", startAutoplay);
      track.removeEventListener("touchstart", stopAutoplay);
      track.removeEventListener("touchend", startAutoplay);
    };
  }, [items]);

  function slide(direction) {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".relatedImagesCard");

    if (!card) return;

    const cardWidth = card.offsetWidth;

    const gap = parseFloat(
      getComputedStyle(track).gap || "0"
    );

    track.scrollBy({
      left: (cardWidth + gap) * direction,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="relatedImagesSection"
      aria-label={title}
    >
      <div className="relatedImagesInner">
        <h2 className="relatedImagesTitle">
          {title}
        </h2>

        <div className="relatedImagesSlider">

          {canScrollLeft && (
            <button
              type="button"
              className="relatedImagesArrow relatedImagesArrowLeft"
              onClick={() => slide(-1)}
              aria-label="Scroll left"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M11 3.5L5.5 9L11 14.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            className="relatedImagesTrack"
            ref={trackRef}
          >
            {items.map((item) => (
              <RelatedImageCard
                key={item.slug}
                item={item}
              />
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              className="relatedImagesArrow relatedImagesArrowRight"
              onClick={() => slide(1)}
              aria-label="Scroll right"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 3.5L12.5 9L7 14.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

        </div>
      </div>
    </section>
  );
}