"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function GalleryRelatedImages({
  product,
  currentVariantSlug,
  title = "Related Images",
}) {
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ============================================================
  // Build the cards from the loaded product's variants.
  // Every other variant of the same product is shown; the one the
  // user is currently viewing is left out. Starts right after the
  // current variant and wraps around.
  // ============================================================
  const items = useMemo(() => {
    const variants = product?.variants;
    if (!Array.isArray(variants) || variants.length === 0) return [];

    const currentIndex = variants.findIndex(
      (v) => v.slug === currentVariantSlug
    );

    const ordered =
      currentIndex === -1
        ? variants
        : [
            ...variants.slice(currentIndex + 1),
            ...variants.slice(0, currentIndex),
          ];

    return ordered.map((v) => ({
      slug: v.slug,
      collection: product.name,
      name: v.name,
      image: v.image || v.images?.[0] || null,
      href: v.gallery_url || `/gallery/${product.slug}/${v.slug}`,
    }));
  }, [product, currentVariantSlug]);

  // Reset scroll position when the user moves to another variant
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: 0 });
  }, [currentVariantSlug]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateScrollState() {
      const { scrollLeft, scrollWidth, clientWidth } = track;

      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
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
        const maxScroll = track.scrollWidth - track.clientWidth;

        // If reached the end, go back to beginning
        if (track.scrollLeft >= maxScroll - 5) {
          track.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          // Move approximately one card
          const card = track.querySelector(".relatedImagesCard");

          if (!card) return;

          const cardWidth = card.offsetWidth;
          const gap = parseFloat(getComputedStyle(track).gap || "0");

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
    const gap = parseFloat(getComputedStyle(track).gap || "0");

    track.scrollBy({
      left: (cardWidth + gap) * direction,
      behavior: "smooth",
    });
  }

  // Nothing to show (e.g. product has only one variant)
  if (items.length === 0) return null;

  return (
    <section className="relatedImagesSection" aria-label={title}>
      <div className="relatedImagesInner">
        <h2 className="relatedImagesTitle">{title}</h2>

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

          <div className="relatedImagesTrack" ref={trackRef}>
            {items.map((item) => (
              <RelatedImageCard key={item.slug} item={item} />
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