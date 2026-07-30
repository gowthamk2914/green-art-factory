"use client";

import { useEffect, useRef, useState } from "react";
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

  // Scroll-gated reveal for the section, guarded with a fallback
  // timer so it can only ever be delayed, never left permanently
  // invisible if the observer fails to fire for any reason.
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    const fallbackTimer = window.setTimeout(() => setIsVisible(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [relatedBlogs]);

  if (relatedLoading || !relatedBlogs || relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`related-articles-section ${
        isVisible ? "related-articles-section--visible" : ""
      }`}
    >
      <div className="container">
        <h3 className="related-articles-heading">Recommended Articles</h3>
        <div className="related-articles-grid">
          {relatedBlogs.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article, index }) {
  const { slug, image, blog_date, published_at, title, excerpt } = article;
  const date = formatDate(blog_date || published_at);

  return (
    <Link
      href={`/blog/${slug}`}
      className="related-article-card"
      style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
    >
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