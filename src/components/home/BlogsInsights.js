"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";

import { getBlogPreviewRequest } from "../../redux/BlogPreview/actions";

/* Hero art stays static — not part of the API response */
const HERO_BG = "/images/blogs-bg.jpg";

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

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LeafIcon() {
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
}

// Formats an ISO 8601 date string (e.g. "2026-05-29T16:44:47.000000Z")
// into "29/05/2026" (dd/mm/yyyy). Falls back to the raw string if parsing fails.
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

// Timestamp helper for sorting (invalid/missing dates go last)
function getTime(value) {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

// "Indoor-plants" / "Plant Care" -> "INDOOR PLANTS" / "PLANT CARE"
function toUpperLabel(value = "") {
  return String(value).replace(/[-_]+/g, " ").trim().toUpperCase();
}

// Used only for matching, so "Indoor-plants" and "Indoor Plants" are equal
function normalize(value = "") {
  return String(value).replace(/[-_]+/g, " ").trim().toLowerCase();
}

function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="gaf-blogs-post-card">
        <div className="gaf-blogs-post-image-wrap">
          <Image src={post.image} alt={post.title} fill className="gaf-blogs-post-image" />
        </div>

        <div className="gaf-blogs-post-body">
          {post.category && (
            <span className="gaf-blogs-post-tag">{toUpperLabel(post.category)}</span>
          )}
          <h3 className="gaf-blogs-post-title">{post.title}</h3>
          <p className="gaf-blogs-post-desc">{post.excerpt}</p>

          <div className="gaf-blogs-post-footer">
            {post.author ? (
              <div className="gaf-blogs-author">
                {post.avatar && (
                  <span className="gaf-blogs-avatar">
                    <Image src={post.avatar} alt={post.author} fill className="gaf-blogs-avatar-img" />
                  </span>
                )}
                <span className="gaf-blogs-author-text">
                  <span className="gaf-blogs-author-name">{post.author}</span>
                  {post.authorHandle && <span className="gaf-blogs-author-handle">{post.authorHandle}</span>}
                  <span className="article-card-author-handle">Blog Author</span>
                </span>
              </div>
            ) : (
              <span />
            )}
            <span className="gaf-blogs-post-date">{formatDate(post.blog_date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogsInsights() {
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

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  // "All" is a local pseudo-category, not part of the API response.
  // `label` is for display (uppercase); `name` is the raw API name used for matching.
  const filters = useMemo(
    () => [
      { id: "all", slug: "all", label: "ALL", name: "all", count: null },
      ...(categories || []).map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        label: toUpperLabel(cat.name),
        name: cat.name,
        href: `/blog/${cat.slug}`,
        count: null,
      })),
    ],
    [categories]
  );

  // Newest first by blog_date (id is the tie-breaker for same-date posts).
  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const diff = getTime(b.blog_date) - getTime(a.blog_date);
        return diff !== 0 ? diff : (b.id || 0) - (a.id || 0);
      }),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const activeCategory = filters.find((f) => f.slug === activeFilter);
    const q = search.trim().toLowerCase();

    return (sortedPosts || []).filter((post) => {
      const matchesCategory =
        activeFilter === "all" ||
        !activeCategory ||
        normalize(post.category) === normalize(activeCategory.name);

      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [sortedPosts, filters, activeFilter, search]);

  const leftPosts = filteredPosts.slice(0, 2);
  const featuredPost = filteredPosts[2];

  return (
    <section className="gaf-blogs-section">
      <div className="gaf-blogs-hero" style={{ backgroundImage: `url(${HERO_BG})` }}>
        <h1 className="gaf-blogs-heading">Blogs &amp; Insights</h1>
        <p className="gaf-blogs-subtext">
          Explore curated articles on beautiful living, thoughtful interiors,
          natural aesthetics, and inspiring spaces designed to bring balance
          into everyday life.
        </p>

        {/* <Link href="/blogs">
        <button type="button" className="gaf-blogs-cta-btn">
          Explore Our Story
          <span className="gaf-blogs-cta-icon">
            <ArrowIcon />
          </span>
        </button>
        </Link> */}

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

          {filters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              onClick={() => setActiveFilter(filter.slug)}
              className={`gaf-blogs-filter-pill ${
                activeFilter === filter.slug ? "gaf-blogs-filter-pill--active" : ""
              }`}
            >
              {filter.slug === "all" ? <GridIcon /> : <LeafIcon />}
              <span>{filter.label}</span>
              {filter.count !== null && (
                <span className="gaf-blogs-filter-count">{filter.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="gaf-blogs-panel">
        {loading ? (
          <p className="gaf-blogs-status">Loading articles…</p>
        ) : error ? (
          <p className="gaf-blogs-status gaf-blogs-status--error">Couldn&apos;t load articles right now.</p>
        ) : filteredPosts.length === 0 ? (
          <p className="gaf-blogs-status">No articles found.</p>
        ) : (
          <div className="gaf-blogs-grid">
            <div className="gaf-blogs-left">
              {leftPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="gaf-blogs-right">
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`}>
                  <article className="gaf-blogs-featured-card">
                    <div className="gaf-blogs-featured-image-wrap">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="gaf-blogs-featured-image"
                      />
                    </div>

                    <div className="gaf-blogs-featured-body">
                      {featuredPost.category && (
                        <span className="gaf-blogs-featured-tag">
                          {toUpperLabel(featuredPost.category)}
                        </span>
                      )}
                      <h3 className="gaf-blogs-featured-title">{featuredPost.title}</h3>
                      <p className="gaf-blogs-featured-desc">{featuredPost.excerpt}</p>

                      <div className="gaf-blogs-featured-footer">
                        {featuredPost.author && (
                          <>
                            {featuredPost.avatar && (
                              <span className="gaf-blogs-avatar gaf-blogs-avatar--sm">
                                <Image
                                  src={featuredPost.avatar}
                                  alt={featuredPost.author}
                                  fill
                                  className="gaf-blogs-avatar-img"
                                />
                              </span>
                            )}
                            <span className="gaf-blogs-author-name">{featuredPost.author}</span>
                            
                            <span className="article-card-author-handle">Blog Author</span>
                          </>
                        )}
                        <span className="gaf-blogs-post-date">{formatDate(featuredPost.blog_date)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              <Link href="/blogs" className="gaf-blogs-explore-btn-wrapper">
                <button type="button" className="gaf-blogs-explore-btn">
                  Explore New Articles
                  <span className="gaf-blogs-explore-icon">
                    <ArrowIcon />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}