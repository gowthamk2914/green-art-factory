"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiArrowUpRight } from "react-icons/fi";
import {
  IoGridOutline,
  IoLeafOutline,
  IoBagHandleOutline,
  IoFlowerOutline,
  IoBookOutline,
} from "react-icons/io5";

import { getBlogPreviewRequest } from "../../redux/BlogPreview/actions";

// The API only sends { id, name, slug } per category — no icon. This maps
// known slugs to a pill icon, falling back to a generic leaf for anything
// new the API adds later so a pill never renders without an icon.
const CATEGORY_ICONS = {
  "indoor-plants": IoLeafOutline,
  "plant-care": IoBagHandleOutline,
  succulents: IoFlowerOutline,
  guides: IoBookOutline,
};

function iconForCategory(slug) {
  return CATEGORY_ICONS[slug] || IoLeafOutline;
}

// "Indoor-plants" -> "INDOOR PLANTS" (matches the card badge styling)
function formatBadge(category) {
  if (!category) return "";
  return category.replace(/-/g, " ").toUpperCase();
}

export default function BlogList() {
  const dispatch = useDispatch();

  const blogPreviewState = useSelector((state) => state.BlogPreview);
  const {
    loading = false,
    data = { categories: [], posts: [] },
    error = null,
  } = blogPreviewState || {};

  const categories = data?.categories || [];
  const posts = data?.posts || [];

  useEffect(() => {
    dispatch(getBlogPreviewRequest());
  }, [dispatch]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  // Scroll-triggered reveal for the filter bar + heading row. The
  // marquee itself is intentionally left out of this gate — it has
  // its own continuous animation and shouldn't wait on scroll.
  const filterbarRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    const el = filterbarRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsHeaderVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // "All Blogs" is a local pseudo-category, not part of the API response.
  const pillCategories = useMemo(
    () => [
      { id: "all", label: "All Blogs", icon: IoGridOutline, count: null },
      ...categories.map((cat) => ({
        id: cat.slug,
        label: cat.name,
        icon: iconForCategory(cat.slug),
        count: null,
      })),
    ],
    [categories]
  );

  // Map API posts into the card shape this component renders.
  // `categoryRaw` is kept (in addition to the display-formatted `badge`)
  // so the active pill can filter cards by exact category match.
  const cards = useMemo(
    () =>
      posts.map((post) => ({
        id: post.id,
        badge: formatBadge(post.category),
        categoryRaw: post.category || "",
        title: post.title,
        description: post.excerpt,
        image: post.image,
        href: `/blog/${post.slug}`,
      })),
    [posts]
  );

  const activeLabel =
    pillCategories.find((cat) => cat.id === activeCategory)?.label ?? "All Blogs";

  const filteredCards = cards.filter((card) => {
    const matchesCategory =
      activeCategory === "all" ||
      card.categoryRaw.toLowerCase() === activeLabel.toLowerCase();

    if (!matchesCategory) return false;

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
  const [headingLead, ...headingRest] = activeLabel.split(" ");
  const headingAccent = headingRest.join(" ");

  // Duplicate the card set so the marquee track (2x width) can loop
  // seamlessly at -50% translateX with no visible seam or pause.
  //
  // With very few filtered cards (e.g. 2 for a niche category), simply
  // duplicating once isn't enough content to fill the visible track width
  // — that's what was showing as blank space before the loop caught up.
  // Instead, first pad the filtered set by cycling through it (p1, p2,
  // p1, p2, p1, p2...) until there's a safe minimum amount of content,
  // THEN duplicate that padded set for the seamless loop.
  const MIN_LOOP_CARDS = 8;
  const paddedCards =
    filteredCards.length === 0
      ? []
      : filteredCards.length >= MIN_LOOP_CARDS
      ? filteredCards
      : Array.from({ length: Math.ceil(MIN_LOOP_CARDS / filteredCards.length) }).flatMap(
          () => filteredCards
        );

  const loopCards = paddedCards.length > 0 ? [...paddedCards, ...paddedCards] : [];

  return (
    <section className="browse-section">
      <div className="container">

        {/* search + category filter pills */}
        <div
          ref={filterbarRef}
          className={`browse-filterbar ${
            isHeaderVisible ? "browse-filterbar--visible" : ""
          }`}
        >
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
            {pillCategories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ transitionDelay: `${0.2 + i * 0.05}s` }}
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
        <div
          className={`browse-heading-row ${
            isHeaderVisible ? "browse-heading-row--visible" : ""
          }`}
        >
          {/* key forces a remount on category change, replaying the
              fade/rise entrance each time the label swaps */}
          <h2 className="browse-heading" key={activeCategory}>
            {headingLead}{" "}
            {headingAccent && (
              <span className="browse-heading-accent">{headingAccent}</span>
            )}
          </h2>

          <span className="browse-total" key={filteredCards.length}>
            Total ({filteredCards.length})
          </span>
        </div>

        {/* infinite auto-scrolling card marquee */}
        {loading ? (
          <BrowseSkeletonTrack />
        ) : error ? (
          <p className="browse-empty">Couldn&apos;t load articles right now.</p>
        ) : filteredCards.length === 0 ? (
          <p className="browse-empty">No results found.</p>
        ) : (
          <div className="browse-track-outer">
            <div
              className="browse-track"
              style={{ animationDuration: `${paddedCards.length * 6}s` }}
            >
              {loopCards.map((card, i) => (
                <Link
                  key={`${card.id}-${i}`}
                  href={card.href}
                  className="browse-card"
                  aria-hidden={i >= paddedCards.length ? "true" : undefined}
                  tabIndex={i >= paddedCards.length ? -1 : undefined}
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

/* Static shimmer placeholder shown while the Redux request is in
   flight — same card shape as the real marquee, but not looping. */
function BrowseSkeletonTrack() {
  return (
    <div className="browse-track-outer">
      <div className="browse-track browse-track--skeleton">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="browse-card browse-skeleton-card" key={i}>
            <div className="browse-card-image-wrap browse-skeleton-block" />
            <div className="browse-card-body">
              <div className="browse-skeleton-line browse-skeleton-line--title browse-skeleton-block" />
              <div className="browse-skeleton-line browse-skeleton-block" />
              <div className="browse-skeleton-line browse-skeleton-line--short browse-skeleton-block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}