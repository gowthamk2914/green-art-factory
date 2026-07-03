"use client";

import { useState } from "react";
import Image from "next/image";

/* Hero + card art — replace with your real files in /public */
const HERO_BG = "/images/blogs-bg.jpg";
const POST_IMAGE = "/images/blog1.jpg";
const FEATURED_IMAGE = "/images/blog2.jpg";
const AVATAR_ONUR = "/images/blog1-writer.png";
const AVATAR_ANDY = "/images/blog2-writer.png";

const FILTERS = [
  { id: "all", label: "All", count: null, icon: "grid" },
  { id: "indoor", label: "Indoor Plants", count: 43, icon: "leaf" },
  { id: "care", label: "Plant-Care", count: 24, icon: "care" },
  { id: "succulents", label: "Succulents", count: 15, icon: "cactus" },
  { id: "guides", label: "Guides", count: 12, icon: "guide" },
];

const POSTS = [
  {
    id: 1,
    image: POST_IMAGE,
    tag: "GREEN LIVING",
    title: "Designing Spaces That Feel Alive With Nature",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living. Explore beautifully curated spaces where minimal design meets natural warmth to create environments that inspire comfort and creativity.",
    authorAvatar: AVATAR_ONUR,
    authorName: "Onur Eren",
    authorHandle: "@createonur",
    date: "07/05/2026",
  },
  {
    id: 2,
    image: POST_IMAGE,
    tag: "GREEN LIVING",
    title: "Designing Spaces That Feel Alive With Nature",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living. Explore beautifully curated spaces where minimal design meets natural warmth to create environments that inspire comfort and creativity.",
    authorAvatar: AVATAR_ONUR,
    authorName: "Onur Eren",
    authorHandle: "@createonur",
    date: "07/05/2026",
  },
];

const FEATURED = {
  image: FEATURED_IMAGE,
  tag: "GREEN LIVING",
  title: "Meet your Glide Certified community challenge winners",
  description:
    "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living.",
  authorAvatar: AVATAR_ANDY,
  authorName: "Andy Claremont",
  date: "07/05/2026",
};

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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon({ type }) {
  switch (type) {
    case "grid":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "leaf":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 4C10 4 4 10 4 18c0 .5.5 1 1 1 8 0 14-6 14-14 0-.5-.4-1-1-1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M6 18C10 14 14 10 19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "care":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9h12l-1.2 10.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "cactus":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21V9a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v3M12 12a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "guide":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}

function PostCard({ post }) {
  return (
    <article className="gaf-blogs-post-card">
      <div className="gaf-blogs-post-image-wrap">
        <Image src={post.image} alt={post.title} fill className="gaf-blogs-post-image" />
      </div>

      <div className="gaf-blogs-post-body">
        <span className="gaf-blogs-post-tag">{post.tag}</span>
        <h3 className="gaf-blogs-post-title">{post.title}</h3>
        <p className="gaf-blogs-post-desc">{post.description}</p>

        <div className="gaf-blogs-post-footer">
          <div className="gaf-blogs-author">
            <span className="gaf-blogs-avatar">
              <Image src={post.authorAvatar} alt={post.authorName} fill className="gaf-blogs-avatar-img" />
            </span>
            <span className="gaf-blogs-author-text">
              <span className="gaf-blogs-author-name">{post.authorName}</span>
              <span className="gaf-blogs-author-handle">{post.authorHandle}</span>
            </span>
          </div>
          <span className="gaf-blogs-post-date">{post.date}</span>
        </div>
      </div>
    </article>
  );
}

export default function BlogsInsights() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <section className="gaf-blogs-section">
      <div
        className="gaf-blogs-hero"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <h1 className="gaf-blogs-heading">Blogs &amp; Insights</h1>
        <p className="gaf-blogs-subtext">
          Explore curated articles on beautiful living, thoughtful interiors,
          natural aesthetics, and inspiring spaces designed to bring balance
          into everyday life.
        </p>

        <button type="button" className="gaf-blogs-cta-btn">
          Explore Our Story
          <span className="gaf-blogs-cta-icon">
            <ArrowIcon />
          </span>
        </button>

        <div className="gaf-blogs-filter-row">
          <label className="gaf-blogs-search-pill">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="gaf-blogs-search-input"
            />
          </label>

          {FILTERS.map((filter) => (
            <button
              type="button"
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`gaf-blogs-filter-pill ${
                activeFilter === filter.id ? "gaf-blogs-filter-pill--active" : ""
              }`}
            >
              <FilterIcon type={filter.icon} />
              <span>{filter.label}</span>
              {filter.count !== null && (
                <span className="gaf-blogs-filter-count">{filter.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="gaf-blogs-panel">
        <div className="gaf-blogs-grid">
          <div className="gaf-blogs-left">
            {POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="gaf-blogs-right">
            <article className="gaf-blogs-featured-card">
              <div className="gaf-blogs-featured-image-wrap">
                <Image
                  src={FEATURED.image}
                  alt={FEATURED.title}
                  fill
                  className="gaf-blogs-featured-image"
                />
              </div>

              <div className="gaf-blogs-featured-body">
                <span className="gaf-blogs-featured-tag">{FEATURED.tag}</span>
                <h3 className="gaf-blogs-featured-title">{FEATURED.title}</h3>
                <p className="gaf-blogs-featured-desc">{FEATURED.description}</p>

                <div className="gaf-blogs-featured-footer">
                  <span className="gaf-blogs-avatar gaf-blogs-avatar--sm">
                    <Image
                      src={FEATURED.authorAvatar}
                      alt={FEATURED.authorName}
                      fill
                      className="gaf-blogs-avatar-img"
                    />
                  </span>
                  <span className="gaf-blogs-author-name">{FEATURED.authorName}</span>
                  <span className="gaf-blogs-post-date">{FEATURED.date}</span>
                </div>
              </div>
            </article>

            <button type="button" className="gaf-blogs-explore-btn">
              Explore New Articles
              <span className="gaf-blogs-explore-icon">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}