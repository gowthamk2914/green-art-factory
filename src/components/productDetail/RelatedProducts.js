"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";
const AUTOPLAY_DELAY = 4000;

function RelatedCard({ item, relatedProductsData }) {
  const relatedProduct = relatedProductsData?.[item?.slug];

  const firstVariantImage =
    relatedProduct?.variants?.[0]?.images?.[0];

  const productImage =
    (typeof firstVariantImage === "string" &&
    firstVariantImage.trim()
      ? firstVariantImage
      : null) ||
    item?.cover_image ||
    FALLBACK_IMAGE;

  return (
    <Link
      href={item?.cta_url || "#"}
      className="relatedProductsCard"
    >
      <div className="relatedProductsImageFrame">
        <Image
          src={productImage}
          alt={item?.name || "Related product"}
          fill
          sizes="(max-width: 640px) 70vw, 280px"
          className="relatedProductsImage"
        />

        <div className="relatedProductsOverlay" />

        <div className="relatedProductsCaption">
          <span className="relatedProductsLabel">
            Collection
          </span>

          <h3 className="relatedProductsName">
            {item?.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedProducts({
  items = [],
  relatedProductsData = {},
}) {
  const scrollerRef = useRef(null);
  const interactingRef = useRef(false);
  const touchTimerRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Respect the visitor's "reduce motion" setting: no auto-moving row
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);

    const onChange = (e) => setReduceMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Works out: does the row overflow, can it go left/right, and which
  // card is the current one (for the dots)
  const updateState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setIsOverflowing(scrollWidth > clientWidth + 1);
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);

    const cards = el.querySelectorAll(".relatedProductsCard");
    if (!cards.length) return;

    // At the very end, the last dot is active
    if (scrollLeft + clientWidth >= scrollWidth - 4) {
      setActiveIndex(cards.length - 1);
      return;
    }

    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let closest = 0;
    let smallest = Infinity;

    cards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - padLeft - scrollLeft);
      if (distance < smallest) {
        smallest = distance;
        closest = i;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateState();

    el.addEventListener("scroll", updateState, { passive: true });

    const resizeObserver = new ResizeObserver(updateState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateState);
      resizeObserver.disconnect();
    };
  }, [items, relatedProductsData, updateState]);

  const scrollBehavior = reduceMotion ? "auto" : "smooth";

  // Distance of one card (width + gap)
  const getStep = () => {
    const el = scrollerRef.current;
    const card = el?.querySelector(".relatedProductsCard");
    if (!el || !card) return 0;

    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0");
    return card.offsetWidth + gap;
  };

  const slide = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: getStep() * direction, behavior: scrollBehavior });
  };

  const goToCard = (index) => {
    const el = scrollerRef.current;
    const card = el?.querySelectorAll(".relatedProductsCard")[index];
    if (!el || !card) return;

    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: card.offsetLeft - padLeft, behavior: scrollBehavior });
  };

  // Gentle automatic sliding, one card at a time. It stops while the
  // visitor hovers, focuses or touches the row, or after they press pause.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isOverflowing || isPaused || reduceMotion) return;

    const timer = setInterval(() => {
      if (interactingRef.current) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const card = el.querySelector(".relatedProductsCard");
        if (!card) return;
        const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0");
        el.scrollBy({ left: card.offsetWidth + gap, behavior: "smooth" });
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [isOverflowing, isPaused, reduceMotion]);

  useEffect(() => {
    return () => clearTimeout(touchTimerRef.current);
  }, []);

  const startInteracting = () => {
    clearTimeout(touchTimerRef.current);
    interactingRef.current = true;
  };

  const stopInteracting = () => {
    interactingRef.current = false;
  };

  // After a touch, wait a few seconds before the row moves again
  const handleTouchEnd = () => {
    clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(stopInteracting, 4000);
  };

  if (!items?.length) {
    return null;
  }

  return (
    <section
      className="relatedProductsSection"
      aria-label="Related products"
    >
      <div className="relatedProductsInner">
        <h2 className="relatedProductsTitle">
          Related{" "}
          <span className="relatedProductsTitleAccent">
            Products
          </span>
        </h2>

        <div
          className={`relatedProductsSlider ${
            canScrollLeft ? "relatedProductsSlider--canLeft" : ""
          } ${canScrollRight ? "relatedProductsSlider--canRight" : ""}`}
          onMouseEnter={startInteracting}
          onMouseLeave={stopInteracting}
          onFocus={startInteracting}
          onBlur={stopInteracting}
          onTouchStart={startInteracting}
          onTouchEnd={handleTouchEnd}
        >
          {isOverflowing && canScrollLeft && (
            <button
              type="button"
              className="relatedProductsArrow relatedProductsArrowLeft"
              onClick={() => slide(-1)}
              aria-label="Previous products"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
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
            ref={scrollerRef}
            className="relatedProductsScroller"
            role="region"
            aria-label="Related products, scrollable"
            tabIndex={0}
          >
            {items.map((item, index) => (
              <RelatedCard
                key={item?.id ?? item?.slug ?? index}
                item={item}
                relatedProductsData={relatedProductsData}
              />
            ))}
          </div>

          {isOverflowing && canScrollRight && (
            <button
              type="button"
              className="relatedProductsArrow relatedProductsArrowRight"
              onClick={() => slide(1)}
              aria-label="Next products"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
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

        {/* Dots + pause: only when the row actually scrolls */}
        {isOverflowing && (
          <div className="relatedProductsControls">
            <div className="relatedProductsDots" role="group" aria-label="Choose a product">
              {items.map((item, index) => (
                <button
                  key={item?.id ?? item?.slug ?? index}
                  type="button"
                  className={`relatedProductsDot ${
                    activeIndex === index ? "relatedProductsDotActive" : ""
                  }`}
                  onClick={() => goToCard(index)}
                  aria-label={`Go to ${item?.name || `product ${index + 1}`}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                />
              ))}
            </div>

            {!reduceMotion && (
              <button
                type="button"
                className="relatedProductsPause"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Play automatic sliding" : "Pause automatic sliding"}
              >
                {isPaused ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <path d="M3 1.5v11l9-5.5-9-5.5Z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <rect x="2.5" y="1.5" width="3" height="11" rx="1" />
                    <rect x="8.5" y="1.5" width="3" height="11" rx="1" />
                  </svg>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}