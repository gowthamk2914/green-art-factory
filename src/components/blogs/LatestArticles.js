"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { getBlogPreviewRequest } from "../../redux/BlogPreview/actions";

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

/**
 * Layout mapping (mirrors the design, minus the compact card):
 *   - posts[0], posts[1] -> left column, large horizontal cards
 *   - posts[2]           -> right column, featured card (image on top)
 *
 * Posts are sorted newest-first by `id` (bigger id = posted more
 * recently) before slicing into these 3 slots.
 *
 * Reads from the same `state.BlogPreview` slice as BlogsInsights/BlogList
 * — no separate redux files for this component. The API doesn't send
 * author name/avatar/handle on posts, so `author` is left undefined per
 * article; ArticleCardFooter already renders gracefully without it.
 */
export default function LatestArticles() {
  const dispatch = useDispatch();

  const blogPreviewState = useSelector((state) => state.BlogPreview);
  const {
    loading = false,
    data = { categories: [], posts: [] },
    error = null,
  } = blogPreviewState || {};

  const posts = data?.posts || [];

  useEffect(() => {
    dispatch(getBlogPreviewRequest());
  }, [dispatch]);

  // Newest first: bigger id = posted more recently.
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts]
  );

  const articles = useMemo(
    () =>
      sortedPosts.map((post) => ({
        id: post.id,
        href: `/blog/${post.slug}`,
        image: post.image,
        category: formatTag(post.category),
        title: post.title,
        description: post.excerpt,
        author: undefined,
        date: formatDate(post.published_at),
      })),
    [sortedPosts]
  );

  const [primary, secondary, featured] = articles;
  const leftArticles = [primary, secondary].filter(Boolean);

  return (
    <section className="latest-section">
      <div className="container">
        <h2 className="latest-heading">
          Latest <span className="latest-heading-accent">Articles</span>
        </h2>

        {loading ? (
          <p className="latest-empty">Loading articles…</p>
        ) : error ? (
          <p className="latest-empty">Couldn&apos;t load articles right now.</p>
        ) : articles.length === 0 ? (
          <p className="latest-empty">No articles yet.</p>
        ) : (
          <div className="latest-grid">
            <div className="latest-col latest-col-primary">
              {leftArticles.map((article) => (
                <ArticleCardHorizontal key={article.id} article={article} />
              ))}
            </div>

            <div className="latest-col latest-col-secondary">
              {featured && <ArticleCardFeatured article={featured} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCardHorizontal({ article }) {
  const { href, image, category, title, description } = article;
  return (
    <Link href={href} className="article-card article-card-horizontal">
      <div className="article-card-image-wrap article-card-image-wrap-horizontal">
        <Image src={image} alt={title} fill className="article-card-image" />
      </div>
      <div className="article-card-body">
        <div className="article-card-body-top">
          {category && <span className="article-card-badge">{category}</span>}
          <h3 className="article-card-title">{title}</h3>
          <p className="article-card-desc">{description}</p>
        </div>
        <ArticleCardFooter article={article} />
      </div>
    </Link>
  );
}

function ArticleCardFeatured({ article }) {
  const { href, image, category, title, description } = article;
  return (
    <Link href={href} className="article-card article-card-featured">
      <div className="article-card-image-wrap article-card-image-wrap-featured">
        <Image src={image} alt={title} fill className="article-card-image" />
      </div>
      <div className="article-card-body">
        <span
          className={`article-card-badge ${!category ? "article-card-badge-empty" : ""}`}
        >
          {category}
        </span>
        <h3 className="article-card-title article-card-title-lg">{title}</h3>
        <p className="article-card-desc">{description}</p>
        <ArticleCardFooter article={article} />
      </div>
    </Link>
  );
}

function ArticleCardFooter({ article }) {
  const { author, date } = article;

  return (
    <div className="article-card-footer article-card-footer-spread">
      <div className="article-card-author">
        {author?.avatar && (
          <span className="article-card-avatar-wrap">
            <Image src={author.avatar} alt={author?.name || ""} fill className="article-card-avatar" />
          </span>
        )}
        <div className="article-card-author-info article-card-author-info-stacked">
          <span className="article-card-author-name">{author?.name}</span>
          {author?.handle && <span className="article-card-author-handle">{author.handle}</span>}
        </div>
      </div>
      <span className="article-card-date">{date}</span>
    </div>
  );
}