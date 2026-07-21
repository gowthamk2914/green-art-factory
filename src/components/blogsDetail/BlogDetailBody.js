"use client";

import { useState } from "react";
import Image from "next/image";
import { FiLink } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

// Sample data — replace with the article fetched from your API (same
// article object the hero section uses can just carry these extra fields).
//
// `content` is a block array so the CMS/API can send back a flexible rich
// body without the component needing to know about specific articles.
// Supported block types below — extend as your CMS's block schema grows:
//   { type: "heading", text }
//   { type: "paragraph", text }
//   { type: "image", src, alt, caption, href }   // href = optional "View" link (lightbox/full image)
//   { type: "quote", text }
const AUTHOR = {
  name: "Onur Eren",
  handle: "@createonur",
  avatar: "/images/blog1-writer.png",
};

const TAGS = ["Moss", "Indoor Living", "Moss"];

const CONTENT = [
  { type: "heading", text: "Introduction" },
  {
    type: "paragraph",
    text: "Green living spaces are becoming the preferred choice for modern homes, offices, hotels, and commercial environments. By integrating preserved moss, living walls, and biophilic design, businesses can create healthier, more inspiring spaces that improve well-being while enhancing interior aesthetics.",
  },
  {
    type: "paragraph",
    text: "Green installations require minimal maintenance, last for years, and bring nature indoors without the need for constant watering or sunlight. They improve visual appeal, reduce stress, and create memorable environments for employees, visitors, and customers.",
  },
  {
    type: "image",
    src: "/images/moss-world.png",
    alt: "World map installation made of preserved moss",
    caption: "World Map Moss",
    href: "/images/moss-world.png",
  },
  {
    type: "paragraph",
    text: "Biophilic design is reshaping modern architecture by reconnecting people with nature. Moss walls, preserved plant installations, and vertical gardens create calming environments while improving acoustic performance and adding timeless natural beauty to any interior.",
  },
  {
    type: "paragraph",
    text: "Modern workplaces are embracing green interiors to improve employee wellness and productivity. Natural design elements help reduce stress, enhance focus, and create welcoming environments that leave lasting impressions on both employees and clients.",
  },
  {
    type: "quote",
    text: "Green Art Factory completely transformed our office into a vibrant, refreshing workspace. The moss wall installation exceeded our expectations, adding elegance and improving the overall atmosphere. The process was seamless, and the final result has received countless compliments from our visitors.",
  },
  {
    type: "paragraph",
    text: "As sustainable architecture continues to grow, businesses are investing in eco-friendly interior solutions that combine beauty with functionality. From luxury hotels to corporate offices and retail spaces, green installations create unforgettable experiences while supporting environmentally conscious design.",
  },
  { type: "heading", text: "Conclusion" },
  {
    type: "paragraph",
    text: "Green living installations are no longer a niche design choice — they're becoming a standard expectation for spaces that want to feel healthier, calmer, and more memorable. Businesses that invest early in biophilic design position themselves ahead of a fast-growing trend.",
  },
];

export default function BlogDetailBody({
  author = AUTHOR,
  tags = TAGS,
  content = CONTENT,
  shareUrl,
}) {
  return (
    <section className="blog-body-section">
        <div className="container">
      <div className="blog-body-container">
        <aside className="blog-body-sidebar">
          <div className="blog-body-author">
            <span className="blog-body-avatar-wrap">
              <Image src={author.avatar} alt={author.name} fill className="blog-body-avatar" />
            </span>
            <div className="blog-body-author-info">
              <span className="blog-body-author-name">{author.name}</span>
              {author.handle && <span className="blog-body-author-handle">{author.handle}</span>}
            </div>
          </div>

          <div className="blog-body-share">
            <h4 className="blog-body-share-title">Share This Post</h4>
            <ShareBar shareUrl={shareUrl} />
          </div>

          {tags?.length > 0 && (
            <div className="blog-body-tags">
              {tags.map((tag, i) => (
                <span key={`${tag}-${i}`} className="blog-body-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </aside>

        <div className="blog-body-content">
          {content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

function ShareBar({ shareUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied/unavailable — fail silently
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl || "");

  return (
    <div className="blog-body-share-icons">
      <button
        type="button"
        onClick={handleCopyLink}
        className="blog-body-share-icon blog-body-share-copy"
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        <FiLink />
      </button>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-body-share-icon blog-body-share-linkedin"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn />
      </a>

      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="blog-body-share-icon blog-body-share-instagram"
        aria-label="Share on Instagram"
      >
        <FaInstagram />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-body-share-icon blog-body-share-facebook"
        aria-label="Share on Facebook"
      >
        <FaFacebookF />
      </a>
    </div>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case "heading":
      return <h2 className="blog-body-heading">{block.text}</h2>;

    case "paragraph":
      return <p className="blog-body-paragraph">{block.text}</p>;

    case "quote":
      return <blockquote className="blog-body-quote">&ldquo;{block.text}&rdquo;</blockquote>;

    case "image":
      return (
        <figure className="blog-body-figure">
          <div className="blog-body-figure-image-wrap">
            <Image src={block.src} alt={block.alt || ""} fill className="blog-body-figure-image" />
          </div>
          {(block.caption || block.href) && (
            <figcaption className="blog-body-figcaption">
              {block.caption && <span>{block.caption}</span>}
              {block.href && (
                <a href={block.href} target="_blank" rel="noopener noreferrer" className="blog-body-figure-view">
                  View
                </a>
              )}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}