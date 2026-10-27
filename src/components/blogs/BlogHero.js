"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { API_URL } from "../../../src/utils/constants"; // adjust path to your constants file

// "<p>..</p>" -> plain text, then estimate reading time (200 wpm)
function getReadTime(html = "") {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Wrap the last two words of the title in the accent span
function renderTitleWithAccent(title = "") {
  const words = title.trim().split(/\s+/);

  // Very short titles: highlight the whole thing
  if (words.length <= 2) {
    return <span className="livingwall-heading-accent">{title}</span>;
  }

  const lead = words.slice(0, -2).join(" ");
  const accent = words.slice(-2).join(" ");

  return (
    <>
      {lead}{" "}
      <span className="livingwall-heading-accent">{accent}</span>
    </>
  );
}


export default function BlogHero() {
  const [blog, setBlog] = useState(null);

  // Always use the FIRST blog the API returns
  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedBlog() {
      try {
        const response = await axios.get(`${API_URL}/blog`);
        const list = response.data?.data;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setBlog(list[0]);
        }
      } catch (error) {
        console.error("Failed to load featured blog:", error);
      }
    }

    loadFeaturedBlog();

    return () => {
      cancelled = true;
    };
  }, []);

  const category = (blog?.blogs?.name || "").replace(/-/g, " ").toUpperCase();
  const dateLabel = formatDate(blog?.blog_date);

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="breadcrumb container">
        <Link href="/" className="breadcrumb-item">
          Home
        </Link>

        <i className="bi bi-chevron-right breadcrumb-arrow"></i>

        <Link href="/blogs" className="breadcrumb-item active">
          Blogs
        </Link>
      </div>

      {blog && (
        <div className="livingwall-wrap container mx-auto">
          {/* decorative "stacked card" peeking behind the text card */}
          <div className="livingwall-decor" aria-hidden="true" />

          {/* image card */}
          <article className="livingwall-image-card">
            {blog.image && (
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="livingwall-image"
                priority
              />
            )}
            <div className="livingwall-scrim" aria-hidden="true" />

            {category && <span className="livingwall-badge">{category}</span>}

            <div className="livingwall-meta">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>{getReadTime(blog.content)} min read</span>
              {dateLabel && (
                <>
                  <span className="livingwall-meta-dot">—</span>
                  <span>{dateLabel}</span>
                </>
              )}
            </div>
          </article>

          {/* text card */}
          <div className="livingwall-text-card">
            <h2 className="livingwall-heading">{renderTitleWithAccent(blog.title)}</h2>

            <p className="livingwall-copy">{blog.excerpt}</p>

            <Link href={`/blog/${blog.slug}`} className="livingwall-cta">
              READ STORY
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}