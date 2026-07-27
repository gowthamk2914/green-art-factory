"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import { getBlogDetailRequest } from "../../redux/BlogDetail/actions";

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

// The API doesn't return a read-time field, so estimate one from the
// HTML content's word count (~200 wpm). Remove this if your backend
// starts sending a real value.
function estimateReadTime(html) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "";
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} Min${minutes > 1 ? "s" : ""} Read`;
}

export default function BlogDetailHero({ slug: slugProp }) {
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

  if (loading || !data) {
    return (
      <section className="blog-hero-section">
        <div className="container">
          <div className="blog-hero-meta blog-hero-skeleton-line blog-hero-skeleton-meta" />
          <div className="blog-hero-skeleton-line blog-hero-skeleton-title" />
          <div className="blog-hero-image-wrap blog-hero-skeleton-image" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog-hero-section">
        <div className="container">
          <p className="blog-hero-meta">Unable to load this article.</p>
        </div>
      </section>
    );
  }

  const date = formatDate(data.blog_date || data.published_at);
  const readTime = estimateReadTime(data.content);

  return (
    <section className="blog-hero-section">
      <div className="container">
        <p className="blog-hero-meta">
          {date}
          {readTime && (
            <>
              <span className="blog-hero-meta-dot">.</span>
              {readTime}
            </>
          )}
        </p>

        <h1 className="blog-hero-title">{data.title}</h1>

        <div className="blog-hero-image-wrap">
          <Image
            src={data.image}
            alt={data.title}
            fill
            priority
            className="blog-hero-image"
          />
        </div>
      </div>
    </section>
  );
}