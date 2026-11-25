"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { getInstagramLinksRequest } from "../../redux/InstagramLinks/actions"; // adjust path to match your folders

const BG_IMAGE = "/images/latest-posts-section-bg.jpg";
const LEAF_IMAGE = "/images/latest-posts-section-leaf.png";

const MAX_POSTS = 3;

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  );
}

function InstagramPost({ url }) {
  return (
    <article className="gaf-posts-card gaf-posts-embed-card">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </article>
  );
}

export default function LatestPosts() {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.InstagramLinks ?? {});

  useEffect(() => {
    dispatch(getInstagramLinksRequest());
  }, [dispatch]);

  const posts = useMemo(() => {
    return (data ?? [])
      .filter((item) => item?.is_active && item?.instagram_url)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.id ?? 0) - (b.id ?? 0)
      )
      .slice(0, MAX_POSTS);
  }, [data]);

  // The Instagram script only turns blockquotes into posts when it runs,
  // so run it again whenever the list of posts arrives or changes.
  useEffect(() => {
    if (posts.length === 0) return;
    window.instgrm?.Embeds?.process();
  }, [posts]);

  return (
    <section
      className="gaf-posts-outer"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onReady={() => {
          window.instgrm?.Embeds?.process();
        }}
      />

      <div className="gaf-posts-container">
        <aside className="gaf-posts-sidebar">
          <Image
            src={LEAF_IMAGE}
            alt="leaf image"
            width={280}
            height={280}
            className="gaf-posts-leaf-img"
          />

          <div className="gaf-posts-sidebar-content">
            <h2 className="gaf-posts-heading">Latest Posts</h2>

            <p className="gaf-posts-subtext">
              Want to bring more nature into your life? Stay connected with us for behind-the-scenes looks at our latest projects, practical tips on the newest green innovations, and endless landscaping inspirations to spark ideas for your next outdoor makeover!
            </p>

            <div className="gaf-posts-social-row">
              <span className="gaf-posts-social-icon gaf-posts-social-icon--ig">
                <InstagramGlyph />
              </span>

              <span className="gaf-posts-social-name">
                Green Art Factory
              </span>

              <span className="gaf-posts-divider" />

              <Link
                href="https://www.instagram.com/greenartfactoryuae/"
                target="_blank"
                rel="noopener noreferrer"
                className="gaf-posts-follow-btn"
              >
                Follow Us
              </Link>
            </div>

            <div className="gaf-posts-social-row">
              <span className="gaf-posts-social-icon gaf-posts-social-icon--li">
                <LinkedInGlyph />
              </span>

              <span className="gaf-posts-social-name">
                Green Art Factory
              </span>

              <span className="gaf-posts-divider" />

              <Link
                href="https://www.linkedin.com/company/green-art-factory-uae/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="gaf-posts-follow-btn"
              >
                Follow Us
              </Link>
            </div>
          </div>
        </aside>

        {posts.length > 0 && (
          <div className="gaf-posts-grid">
            {posts.map((post) => (
              <InstagramPost key={post.id} url={post.instagram_url} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}