"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FiLink, FiCheck } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

import { getBlogDetailRequest } from "../../redux/BlogDetail/actions";

export default function BlogDetailBody({ slug: slugProp, shareUrl }) {
  const dispatch = useDispatch();
  const params = useParams();
  const slug = slugProp || params?.slug;

  const { loading, data, error } = useSelector(
    (state) => state.BlogDetail || { loading: true, data: null, error: null }
  );

  useEffect(() => {
    if (slug && !loading && (!data || data.slug !== slug)) {
      dispatch(getBlogDetailRequest(slug));
    }
  }, [slug, loading, data, dispatch]);

  // Scroll-gated sidebar reveal, guarded with a fallback timer so it
  // can never stay stuck invisible if the observer doesn't fire.
  const sidebarRef = useRef(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsSidebarVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSidebarVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    const fallbackTimer = window.setTimeout(() => setIsSidebarVisible(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [data]);

  // Per-element reveal for the raw HTML content. Since the markup
  // comes from dangerouslySetInnerHTML, React doesn't control these
  // nodes individually — so after mount, walk the container's direct
  // children (headings, paragraphs, quotes, images...) and observe
  // each one, adding a class as it scrolls into view. Same fallback
  // safety net: anything not yet revealed gets forced visible after
  // 2.5s so nothing can be left permanently hidden.
  const contentRef = useRef(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container || !data?.content) return;

    const items = Array.from(container.children);
    if (items.length === 0) return;

    items.forEach((el) => el.classList.add("blog-reveal-item"));

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("blog-reveal-item--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("blog-reveal-item--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));

    const fallbackTimer = window.setTimeout(() => {
      items.forEach((el) => el.classList.add("blog-reveal-item--visible"));
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [data?.content]);

  // BlogDetailHero already renders the loading/error state for this page,
  // so the body just waits quietly until the same store slice is ready.
  if (loading || !data || error) return null;

  const author = { name: data.author, avatar: data.avatar };
  const tags = data.blogs?.name ? [data.blogs.name] : [];

  return (
    <section className="blog-body-section">
      <div className="container">
        <div className="blog-body-container">
          <aside
            ref={sidebarRef}
            className={`blog-body-sidebar ${
              isSidebarVisible ? "blog-body-sidebar--visible" : ""
            }`}
          >
            <div className="blog-body-author">
              <span className="blog-body-avatar-wrap">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="blog-body-avatar"
                />
              </span>
              <div className="blog-body-author-info">
                <span className="blog-body-author-name">{author.name}</span>
              </div>
            </div>

            <div className="blog-body-share">
              <h4 className="blog-body-share-title">Share This Post</h4>
              <ShareBar shareUrl={shareUrl} />
            </div>

            {tags.length > 0 && (
              <div className="blog-body-tags">
                {tags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="blog-body-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </aside>

          {/*
            The API returns `content` as an HTML string (see your sample
            response), not the block array the original component
            expected — so this renders it directly instead of mapping
            over content blocks. Style headings/paragraphs/images/quotes
            inside .blog-body-richtext (h2, p, img, strong em, etc.) in
            your CSS to match the original block-based look.
          */}
          <div
            ref={contentRef}
            className="blog-body-content blog-body-richtext"
            dangerouslySetInnerHTML={{ __html: data.content || "" }}
          />
        </div>
      </div>
    </section>
  );
}

function ShareBar({ shareUrl }) {
  const [copied, setCopied] = useState(false);

  const resolvedUrl =
    shareUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied/unavailable — fail silently
    }
  };

  const encodedUrl = encodeURIComponent(resolvedUrl);

  return (
    <div className="blog-body-share-icons">
      <button
        type="button"
        onClick={handleCopyLink}
        className={`blog-body-share-icon blog-body-share-copy ${
          copied ? "blog-body-share-copy--copied" : ""
        }`}
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? <FiCheck /> : <FiLink />}
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