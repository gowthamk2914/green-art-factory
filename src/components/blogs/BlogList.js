"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiArrowUpRight } from "react-icons/fi";
import {
  IoGridOutline,
  IoLeafOutline,
  IoBagHandleOutline,
  IoFlowerOutline,
  IoBookOutline,
} from "react-icons/io5";

// Category pills shown at the top of the section. `count` is the number
// shown on the pill (from your API/category endpoint) — swap these for real
// numbers, or drop the whole `count` field to hide the badge on a pill.
// `label` also doubles as the left-side section title when that category
// is active (see `activeLabel` below) — keep labels short/title-friendly.
const CATEGORIES = [
  { id: "all", label: "All Blogs", icon: IoGridOutline, count: null },
  { id: "indoor-plants", label: "Indoor Plants", icon: IoLeafOutline, count: 43 },
  { id: "plant-care", label: "Plant-Care", icon: IoBagHandleOutline, count: 24 },
  { id: "succulents", label: "Succulents", icon: IoFlowerOutline, count: 15 },
  { id: "guides", label: "Guides", icon: IoBookOutline, count: 12 },
];

// Sample cards — replace with data from your API. `TOTAL_COUNT` reflects the
// real total for this category (e.g. from pagination metadata); it can be
// larger than the number of cards actually loaded/rendered here.
const TOTAL_COUNT = 15;

const CARDS = [
  {
    id: 1,
    badge: "MOSS WALLS",
    title: "Moss as Art: The Gallery-Inspired Interior",
    description:
      "When preserved moss becomes the canvas — exploring botanical installations as fine art.",
    image: "/images/blog-list-1.jpeg",
    href: "/stories/moss-as-art",
  },
  {
    id: 2,
    badge: "COMMERCIAL",
    title: "Green Branding in Retail Architecture",
    description:
      "How premium retail brands leverage botanical environments to shape customer experience.",
    image: "/images/blog-list-2.jpeg",
    href: "/stories/green-branding-retail",
  },
  {
    id: 3,
    badge: "GREEN INSPIRATION",
    title: "Outdoor Oasis: Premium Landscape Installations",
    description:
      "Extending botanical elegance into terraces, courtyards, and rooftop sanctuaries.",
    image: "/images/blog-list-3.jpeg",
    href: "/stories/outdoor-oasis",
  },
  {
    id: 4,
    badge: "INTERIOR STYLING",
    title: "Wellness Spaces and Botanical Calm",
    description:
      "Designing sanctuaries of rest with nature-forward interior elements that soothe the senses.",
    image: "/images/blog-list-4.jpeg",
    href: "/stories/wellness-spaces",
  },
  {
    id: 5,
    badge: "DESIGN TRENDS",
    title: "2025 Biophilic Design Watch",
    description:
      "The emerging movements reshaping how architects and designers integrate nature.",
    image: "/images/blog-list-5.jpeg",
    href: "/stories/biophilic-design-2025",
  },
];

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filteredCards = CARDS.filter((card) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q) ||
      card.badge.toLowerCase().includes(q)
    );
  });

  // Left-side heading: "All Blogs" by default, and only swaps to the
  // selected category's label when the filter actually changes.
  const activeLabel =
    CATEGORIES.find((cat) => cat.id === activeCategory)?.label ?? "All Blogs";
  const [headingLead, ...headingRest] = activeLabel.split(" ");
  const headingAccent = headingRest.join(" ");

  // Duplicate the card set so the marquee track (2x width) can loop
  // seamlessly at -50% translateX with no visible seam or pause.
  const loopCards = filteredCards.length > 0 ? [...filteredCards, ...filteredCards] : [];

  return (
    <section className="browse-section">
      <div className="container">

        {/* search + category filter pills */}
        <div className="browse-filterbar">
          <div className="browse-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="browse-pills">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`browse-pill ${isActive ? "browse-pill-active" : ""}`}
                >
                  <Icon />
                  <span>{cat.label}</span>
                  {cat.count !== null && (
                    <span className="browse-pill-count">{cat.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* section heading + total */}
        <div className="browse-heading-row">
          <h2 className="browse-heading">
            {headingLead}{" "}
            {headingAccent && (
              <span className="browse-heading-accent">{headingAccent}</span>
            )}
          </h2>

          <span className="browse-total">Total ({TOTAL_COUNT})</span>
        </div>

        {/* infinite auto-scrolling card marquee */}
        {filteredCards.length === 0 ? (
          <p className="browse-empty">No results found.</p>
        ) : (
          <div className="browse-track-outer">
            <div
              className="browse-track"
              style={{ animationDuration: `${filteredCards.length * 6}s` }}
            >
              {loopCards.map((card, i) => (
                <Link
                  key={`${card.id}-${i}`}
                  href={card.href}
                  className="browse-card"
                  aria-hidden={i >= filteredCards.length ? "true" : undefined}
                  tabIndex={i >= filteredCards.length ? -1 : undefined}
                >
                  <div className="browse-card-image-wrap">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="browse-card-image"
                    />
                    <div className="browse-card-scrim" aria-hidden="true" />
                    <span className="browse-card-badge">{card.badge}</span>
                  </div>

                  <div className="browse-card-body">
                    <h3 className="browse-card-title">{card.title}</h3>
                    <p className="browse-card-desc">{card.description}</p>
                    <span className="browse-card-readmore">
                      READ MORE
                      <FiArrowUpRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}