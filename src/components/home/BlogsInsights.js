"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
// into "05/29/2026". Falls back to the raw string if parsing fails.
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${date.getFullYear()}`;
}

// "Indoor-plants" -> "INDOOR PLANTS"
function formatTag(category) {
  if (!category) return "";
  return category.replace(/-/g, " ").toUpperCase();
}

function PostCard({ post }) {
  return (
    <article className="gaf-blogs-post-card">
      <div className="gaf-blogs-post-image-wrap">
        <Image src={post.image} alt={post.title} fill className="gaf-blogs-post-image" />
      </div>

      <div className="gaf-blogs-post-body">
        {post.category && <span className="gaf-blogs-post-tag">{formatTag(post.category)}</span>}
        <h3 className="gaf-blogs-post-title">{post.title}</h3>
        <p className="gaf-blogs-post-desc">{post.excerpt}</p>

        <div className="gaf-blogs-post-footer">
          {post.authorName ? (
            <div className="gaf-blogs-author">
              {post.authorAvatar && (
                <span className="gaf-blogs-avatar">
                  <Image src={post.authorAvatar} alt={post.authorName} fill className="gaf-blogs-avatar-img" />
                </span>
              )}
              <span className="gaf-blogs-author-text">
                <span className="gaf-blogs-author-name">{post.authorName}</span>
                {post.authorHandle && <span className="gaf-blogs-author-handle">{post.authorHandle}</span>}
              </span>
            </div>
          ) : (
            <span />
          )}
          <span className="gaf-blogs-post-date">{formatDate(post.published_at)}</span>
        </div>
      </div>
    </article>
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
  const filters = useMemo(
    () => [{ id: "all", slug: "all", label: "All", count: null }, ...(categories || []).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      label: cat.name,
      count: null,
    }))],
    [categories]
  );

  // Newest first: bigger id = posted more recently.
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const activeCategory = filters.find((f) => f.slug === activeFilter);
    const q = search.trim().toLowerCase();

    return (sortedPosts || []).filter((post) => {
      const matchesCategory =
        activeFilter === "all" ||
        !activeCategory ||
        post.category?.toLowerCase() === activeCategory.label?.toLowerCase();

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
                      <span className="gaf-blogs-featured-tag">{formatTag(featuredPost.category)}</span>
                    )}
                    <h3 className="gaf-blogs-featured-title">{featuredPost.title}</h3>
                    <p className="gaf-blogs-featured-desc">{featuredPost.excerpt}</p>

                    <div className="gaf-blogs-featured-footer">
                      {featuredPost.authorName && (
                        <>
                          {featuredPost.authorAvatar && (
                            <span className="gaf-blogs-avatar gaf-blogs-avatar--sm">
                              <Image
                                src={featuredPost.authorAvatar}
                                alt={featuredPost.authorName}
                                fill
                                className="gaf-blogs-avatar-img"
                              />
                            </span>
                          )}
                          <span className="gaf-blogs-author-name">{featuredPost.authorName}</span>
                        </>
                      )}
                      <span className="gaf-blogs-post-date">{formatDate(featuredPost.published_at)}</span>
                    </div>
                  </div>
                </article>
              )}

              <button type="button" className="gaf-blogs-explore-btn">
                Explore New Articles
                <span className="gaf-blogs-explore-icon">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}