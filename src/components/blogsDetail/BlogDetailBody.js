"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FiLink } from "react-icons/fi";
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

  // BlogDetailHero already renders the loading/error state for this page,
  // so the body just waits quietly until the same store slice is ready.
  if (loading || !data || error) return null;

  const author = { name: data.author, avatar: data.avatar };
  const tags = data.blogs?.name ? [data.blogs.name] : [];

  return (
    <section className="blog-body-section">
      <div className="container">
        <div className="blog-body-container">
          <aside className="blog-body-sidebar">
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