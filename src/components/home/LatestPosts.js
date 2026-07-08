"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const BG_IMAGE = "/images/latest-posts-section-bg.jpg";
const LEAF_IMAGE = "/images/latest-posts-section-leaf.png";


const BEHOLD_FEED_URL = "https://feeds.behold.so/Ahmm4BnIUEH6OgjWRfw5";


function splitCaption(caption = "") {
  const hashtags = caption.match(/#\w+/g) ?? [];
  const description = caption.replace(/#\w+/g, "").trim();
  return { hashtags: hashtags.join(" "), description };
}


function distributeIntoColumns(posts, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  posts.forEach((post, i) => columns[i % columnCount].push(post));
  return columns;
}

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="2" />
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

function CameraIcon() {
  return (
    <Image
      src="/images/latest-posts-camera.png"
      alt="carousel post"
      fill
      className="gaf-posts-camera-icon"
    />
  );
}

function PostCard({ post, profilePicture }) {
  const { hashtags, description } = splitCaption(post.caption);

  return (
    <article className="gaf-posts-card gaf-posts-card--normal">
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="gaf-posts-card-image-wrap"
      >
        <Image
          src={post.mediaUrl || post.thumbnailUrl}
          alt="Green Art Factory post"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px"
          className="gaf-posts-card-image"
        />
        {post.isAlbum && (
          <span className="gaf-posts-camera-badge">
            <CameraIcon />
          </span>
        )}
      </a>

      <div className="gaf-posts-card-body">
        <div className="gaf-posts-card-header">
          <span className="gaf-posts-avatar">
            {profilePicture && (
              <Image
                src={profilePicture}
                alt="Green Art Factory"
                fill
                sizes="46px"
                className="gaf-posts-avatar-img"
              />
            )}
          </span>
          <span className="gaf-posts-name">Green Art Factory</span>
        </div>

        {hashtags && <p className="gaf-posts-hashtags">{hashtags}</p>}
        {description && <p className="gaf-posts-desc">{description}</p>}

        <span className="gaf-posts-ig-badge">
          <InstagramGlyph />
        </span>
      </div>
    </article>
  );
}

export default function LatestPosts() {
  const [status, setStatus] = useState("loading"); 
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${BEHOLD_FEED_URL}?_=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load feed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPosts((data.posts ?? []).slice(0, 7));
        setProfilePicture(data.profilePictureUrl ?? null);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, []);

  const columns = distributeIntoColumns(posts, 3);

  return (
    <section className="gaf-posts-outer" style={{ backgroundImage: `url(${BG_IMAGE})` }}>
      <div className="gaf-posts-container">
        <aside className="gaf-posts-sidebar">
          <Image src={LEAF_IMAGE} alt="" width={280} height={280} className="gaf-posts-leaf-img" />

          <div className="gaf-posts-sidebar-content">
            <h2 className="gaf-posts-heading">Latest Posts</h2>
            <p className="gaf-posts-subtext">
              Stay connected with our latest projects, green innovations, and
              landscaping inspirations.
            </p>

            <div className="gaf-posts-social-row">
              <span className="gaf-posts-social-icon gaf-posts-social-icon--ig">
                <InstagramGlyph />
              </span>
              <span className="gaf-posts-social-name">Green Art Factory</span>
              <span className="gaf-posts-divider" />
              <button type="button" className="gaf-posts-follow-btn">
                Follow Us
              </button>
            </div>

            <div className="gaf-posts-social-row">
              <span className="gaf-posts-social-icon gaf-posts-social-icon--li">
                <LinkedInGlyph />
              </span>
              <span className="gaf-posts-social-name">Green Art Factory</span>
              <span className="gaf-posts-divider" />
              <button type="button" className="gaf-posts-follow-btn">
                Follow Us
              </button>
            </div>
          </div>
        </aside>

        <div className="gaf-posts-grid">
          {status === "loading" && <p className="gaf-posts-status">Loading latest posts…</p>}
          {status === "error" && (
            <p className="gaf-posts-status">Couldn&rsquo;t load Instagram posts right now.</p>
          )}

          {status === "ready" &&
            columns.map((column, i) => (
              <div className="gaf-posts-column" key={i}>
                {column.map((post) => (
                  <PostCard key={post.id} post={post} profilePicture={profilePicture} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}