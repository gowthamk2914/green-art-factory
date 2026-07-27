"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

import { getRelatedBlogsRequest } from "../../redux/BlogDetail/actions";

const DEFAULT_ASPECT_RATIO = "4 / 3";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export default function RelatedArticles() {
  const dispatch = useDispatch();

  // Reads off the same blogDetail slice populated by BlogDetailHero /
  // BlogDetailBody, so this only needs to know the current post's
  // category + slug — no props required.
  const { data: blog, relatedLoading, relatedBlogs } = useSelector(
    (state) =>
      state.BlogDetail || {
        data: null,
        relatedLoading: false,
        relatedBlogs: [],
      }
  );

  const categorySlug = blog?.blogs?.slug;
  const currentSlug = blog?.slug;

  useEffect(() => {
    if (categorySlug) {
      dispatch(getRelatedBlogsRequest(categorySlug, currentSlug));
    }
  }, [categorySlug, currentSlug, dispatch]);

  if (relatedLoading || !relatedBlogs || relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="related-articles-section">
      <div className="related-articles-container">
        <h3 className="related-articles-heading">Recommended Articles</h3>
        <div className="related-articles-grid">
          {relatedBlogs.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const { slug, image, blog_date, published_at, title, excerpt } = article;
  const date = formatDate(blog_date || published_at);

  return (
    <Link href={`/blog/${slug}`} className="related-article-card">
      <div
        className="related-article-image-wrap"
        style={{ aspectRatio: DEFAULT_ASPECT_RATIO }}
      >
        <Image src={image} alt={title} fill className="related-article-image" />
      </div>

      {date && <p className="related-article-date">{date}</p>}
      <h3 className="related-article-title">{title}</h3>
      <p className="related-article-desc">{excerpt}</p>
    </Link>
  );
}