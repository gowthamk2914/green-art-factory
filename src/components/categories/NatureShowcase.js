"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";


const SLIDES = [
  {
    id: 1,
    image: "/images/nature-showcase-slide-1.jpg",
    thumb: "/images/nature-showcase-slide-1.jpg",
    title: "Moss Creation",
    description:
      "Transforming outdoor spaces into stunning landscapes that blend beauty, functionality, and nature. From concept to completion, we create green environments designed to inspire and thrive.",
    ctaLabel: "View Now",
  },
  {
    id: 2,
    image: "/images/nature-showcase-slide-2.jpg",
    thumb: "/images/nature-showcase-slide-2.jpg",
    title: "Vertical Garden",
    description:
      "Turning bare walls into living art with lush vertical gardens that bring texture, colour, and fresh air into any space, indoors or out.",
    ctaLabel: "View Now",
  },
  {
    id: 3,
    image: "/images/nature-showcase-slide-3.jpg",
    thumb: "/images/nature-showcase-slide-3.jpg",
    title: "Living Wall Design",
    description:
      "Custom living walls engineered for long-term health and visual impact, tailored to the light and layout of your space.",
    ctaLabel: "View Now",
  },
  {
    id: 4,
    image: "/images/nature-showcase-slide-4.jpg",
    thumb: "/images/nature-showcase-slide-4.jpg",
    title: "Preserved Moss Art",
    description:
      "Zero-maintenance preserved moss installations that keep their colour and texture for years, with no water or sunlight required.",
    ctaLabel: "View Now",
  },
  {
    id: 5,
    image: "/images/nature-showcase-slide-5.jpg",
    thumb: "/images/nature-showcase-slide-5.jpg",
    title: "Indoor Greenery",
    description:
      "Thoughtfully placed indoor planting that softens interiors and improves air quality, designed around how the space is actually used.",
    ctaLabel: "View Now",
  },
  {
    id: 6,
    image: "/images/nature-showcase-slide-6.jpg",
    thumb: "/images/nature-showcase-slide-6.jpg",
    title: "Garden Landscape",
    description:
      "Full landscape design and build, from pathways and lighting to planting schemes that feel considered in every season.",
    ctaLabel: "View Now",
  },
  {
    id: 7,
    image: "/images/nature-showcase-slide-7.jpg",
    thumb: "/images/nature-showcase-slide-7.jpg",
    title: "Rooftop Greenery",
    description:
      "Reclaiming rooftops and terraces as green, usable space with planting built to handle wind, sun, and exposure.",
    ctaLabel: "View Now",
  },
];

const AUTOPLAY_MS = 4500;
const DRAG_THRESHOLD_PX = 60;
const TAGLINE_MS = 3000;


const DESIGN_TAGLINES = [
  "Timeless Design, Naturally Inspired",
  "Where Nature Meets Modern Living",
  "Crafted Spaces, Sustainably Designed",
  "Elevating Interiors With Greenery",
];


function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function NatureShowcase() {
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dragStartXRef = useRef(0);
  const draggedRef = useRef(false);
  const total = SLIDES.length;

  const goTo = useCallback(
    (index) => setActive(mod(index, total)),
    [total]
  );

  const goNext = useCallback(() => setActive((p) => mod(p + 1, total)), [total]);
  const goPrev = useCallback(() => setActive((p) => mod(p - 1, total)), [total]);

  /* ---- autoplay ---- */
  useEffect(() => {
    if (isPaused || isDragging) return undefined;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, isDragging, goNext]);

  /* ---- drag / swipe on the main showcase card ---- */
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    setDragDeltaX(delta);
  };

  const endDrag = useCallback(() => {
    if (dragDeltaX <= -DRAG_THRESHOLD_PX) goNext();
    else if (dragDeltaX >= DRAG_THRESHOLD_PX) goPrev();
    setIsDragging(false);
    setDragDeltaX(0);
    setIsPaused(false);
  }, [dragDeltaX, goNext, goPrev]);

  const handlePointerUp = () => {
    if (isDragging) endDrag();
  };

  const handleClickCapture = (e) => {
    if (draggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      draggedRef.current = false;
    }
  };

  const slide = SLIDES[active];

  return (
    <section className="gaf-nature-section">
      <div className="gaf-nature-tagline">
        <SparkleIcon />
        <span key={taglineIndex} className="gaf-nature-tagline-text">
          {DESIGN_TAGLINES[taglineIndex]}
        </span>
      </div>

      <div className="gaf-nature-panel">
        <h2 className="gaf-nature-heading">
          Bringing <span className="gaf-nature-highlight">Nature</span> Closer
          to
          <br />
          Your <span className="gaf-nature-highlight">Lifestyle</span>
        </h2>

        <div
          className={`gaf-nature-card ${isDragging ? "gaf-nature-card--dragging" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClickCapture={handleClickCapture}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !isDragging && setIsPaused(false)}
          style={{
            transform: isDragging ? `translateX(${dragDeltaX * 0.3}px)` : "translateX(0)",
            transition: isDragging ? "none" : "transform 0.35s ease",
          }}
        >
          <div className="gaf-nature-image-wrap">
            <Image
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              fill
              className="gaf-nature-image"
              draggable={false}
            />
          </div>

          <div className="gaf-nature-content">
            <h3 className="gaf-nature-title">{slide.title}</h3>
            <p className="gaf-nature-desc">{slide.description}</p>
            <button type="button" className="gaf-nature-cta-btn">
              {slide.ctaLabel}
              <span className="gaf-nature-cta-icon">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>

        <div className="gaf-nature-thumbs">
          {SLIDES.map((s, index) => (
            <button
              type="button"
              key={s.id}
              onClick={() => goTo(index)}
              aria-label={`Show ${s.title}`}
              className={`gaf-nature-thumb ${
                index === active ? "gaf-nature-thumb--active" : ""
              }`}
            >
              <Image
                src={s.thumb}
                alt={s.title}
                fill
                className="gaf-nature-thumb-image"
                draggable={false}
              />
            </button>
          ))}
        </div>

        <div className="gaf-nature-dots">
          {SLIDES.map((s, index) => (
            <button
              type="button"
              key={s.id}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`gaf-nature-dot ${
                index === active ? "gaf-nature-dot--active" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}