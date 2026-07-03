"use client";

import Image from "next/image";

/* Section + sidebar art — replace with your real files in /public */
const BG_IMAGE = "/images/latest-posts-section-bg.jpg";
const LEAF_IMAGE = "/images/latest-posts-section-leaf.png";

/* One entry per post. `size` controls the image height:
   "normal" | "tall" | "short" */
const POSTS = {
  col1: [
    {
      id: 1,
      image: "/images/latest-posts1.jpg",
      size: "normal",
      hasGallery: false,
      hashtags: "#GreenLiving #LandscapeDesign",
      emoji: "🌱",
      description:
        "Bringing life to every space with elegant landscaping and sustainable greenery solutions. Fresh, modern, and naturally inspiring.",
    },
    {
      id: 2,
      image: "/images/latest-posts2.jpg",
      size: "tall",
      hasGallery: true,
      inlineHashtag: "#healthy",
      inlineText: " You and your family will love this refreshing desert!",
    },
  ],

  col2: [
    {
      id: 3,
      image: "/images/latest-posts3.jpg",
      size: "normal",
      hasGallery: false,
      hashtags: "#GreenLiving #LandscapeDesign",
      emoji: "🌱",
      description:
        "Bringing life to every space with elegant landscaping and sustainable greenery solutions. Fresh, modern, and naturally inspiring.",
    },
    {
      id: 4,
      image: "/images/latest-posts1.jpg",
      size: "short",
      hasGallery: true,
      hashtags: "#Landscaping #NatureInspired",
      emoji: "🌿",
    },
  ],
  col3: [
    {
      id: 5,
      image: "/images/latest-posts2.jpg",
      size: "short",
      hasGallery: false,
      hashtags: "#GreenLiving #LandscapeDesign",
    },
    {
      id: 6,
      image: "/images/latest-posts3.jpg",
      size: "short",
      hasGallery: true,
      hashtags: "#GreenLiving #LandscapeDesign",
    },
  ],
};

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
          src={"/images/latest-posts-camera.png"}
          alt="Green Art Factory camera icon"
          fill
          className="gaf-posts-camera-icon"
        />
  );
}

function PostCard({ post }) {
  return (
    <article className={`gaf-posts-card gaf-posts-card--${post.size}`}>
      <div className="gaf-posts-card-image-wrap">
        <Image
          src={post.image}
          alt="Green Art Factory post"
          fill
          className="gaf-posts-card-image"
        />
        {post.hasGallery && (
          <span className="gaf-posts-camera-badge">
            <CameraIcon />
          </span>
        )}
      </div>

      <div className="gaf-posts-card-body">
        <div className="gaf-posts-card-header">
          <div className="gaf-posts-avatar" />
          <span className="gaf-posts-name">Green Art Factory</span>
        </div>

        {post.hashtags && (
          <p className="gaf-posts-hashtags">
            {post.hashtags}
            {post.emoji && <span className="gaf-posts-emoji"> {post.emoji}</span>}
          </p>
        )}

        {post.inlineHashtag && (
          <p className="gaf-posts-inline-text">
            <span className="gaf-posts-hashtags">{post.inlineHashtag}</span>
            {post.inlineText}
          </p>
        )}

        {post.description && (
          <p className="gaf-posts-desc">{post.description}</p>
        )}

        <span className="gaf-posts-ig-badge">
          <InstagramGlyph />
        </span>
      </div>
    </article>
  );
}

export default function LatestPosts() {
  return (
    <section
      className="gaf-posts-outer"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      {/* Everything except the background is capped at 1500px and centered */}
      <div className="gaf-posts-container">
        <aside className="gaf-posts-sidebar">
          <Image
            src={LEAF_IMAGE}
            alt=""
            width={280}
            height={280}
            className="gaf-posts-leaf-img"
          />

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
          <div className="gaf-posts-column">
            {POSTS.col1.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="gaf-posts-column">
            {POSTS.col2.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="gaf-posts-column">
            {POSTS.col3.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}