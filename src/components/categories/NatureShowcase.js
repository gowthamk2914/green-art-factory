"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getNatureShowcaseRequest } from "../../redux/NatureShowcase/actions";

export default function NatureShowcase() {
  const dispatch = useDispatch();

  const {
    loading,
    data: categories,
    error,
  } = useSelector((state) => state.NatureShowcase);

  useEffect(() => {
    dispatch(getNatureShowcaseRequest());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-wrapper">
            <ShowcaseSkeletonRow />
            <ShowcaseSkeletonRow reverse />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-wrapper">
            <div className="showcase-error">
              <h3>{error}</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="showcase-section">
      <div className="container">
        <div className="showcase-wrapper">
          {[...(categories || [])]
            .sort((a, b) => a.id - b.id)
            .map((category, index) => {
              const imageFirst = index % 2 === 0;

              const heroImage =
                category?.variants?.[0]?.image ||
                category.cover_image ||
                "/images/placeholder.jpg";

              const thumbnails =
                category?.variants
                  ?.slice(1, 5)
                  .map((item) => item.image) || [];

              const item = {
                id: category.id,
                title: category.name,
                description: category.description || "",
                href: category.cta_url,
                image: heroImage,
                thumbnails,
              };

              return (
                <ShowcaseRow
                  key={item.id}
                  item={item}
                  imageFirst={imageFirst}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseRow({ item, imageFirst }) {
  const rowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Progressive enhancement: no IntersectionObserver support just
    // shows the content immediately, no animation gate.
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`showcase-row ${
        imageFirst ? "showcase-row--image-first" : "showcase-row--text-first"
      } ${isVisible ? "showcase-row--visible" : ""}`}
    >
      {imageFirst ? (
        <>
          <ShowcaseMedia item={item} />
          <ShowcaseText item={item} />
        </>
      ) : (
        <>
          <ShowcaseText item={item} />
          <ShowcaseMedia item={item} />
        </>
      )}
    </div>
  );
}

function ShowcaseMedia({ item }) {
  return (
    <div className="showcase-media">
      <div className="showcase-media-hero">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="showcase-media-image"
        />
      </div>

      {item.thumbnails?.length > 0 && (
        <div className="showcase-thumbs">
          {item.thumbnails.map((thumb, index) => (
            <div className="showcase-thumb" key={index}>
              <Image
                src={thumb}
                alt={`${item.title}-${index + 1}`}
                fill
                className="showcase-thumb-image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShowcaseText({ item }) {
  return (
    <div className="showcase-text">
      <h3 className="showcase-title">{item.title}</h3>

      <p className="showcase-desc">{item.description}</p>

      <Link href={item.href} className="showcase-btn">
        <span className="showcase-btn-label">View Now</span>

        <span className="showcase-btn-icon">
          <FiArrowUpRight />
        </span>
      </Link>
    </div>
  );
}

/* Shimmer placeholder mirroring the real row's grid shape, shown
   while the Redux request is in flight. */
function ShowcaseSkeletonRow({ reverse }) {
  const media = (
    <div className="showcase-media">
      <div className="showcase-media-hero showcase-skeleton-block" />
      <div className="showcase-thumbs">
        <div className="showcase-thumb showcase-skeleton-block" />
        <div className="showcase-thumb showcase-skeleton-block" />
        <div className="showcase-thumb showcase-skeleton-block" />
        <div className="showcase-thumb showcase-skeleton-block" />
      </div>
    </div>
  );

  const text = (
    <div className="showcase-text">
      <div className="showcase-skeleton-line showcase-skeleton-line--title showcase-skeleton-block" />
      <div className="showcase-skeleton-line showcase-skeleton-block" />
      <div className="showcase-skeleton-line showcase-skeleton-block" />
      <div className="showcase-skeleton-line showcase-skeleton-line--short showcase-skeleton-block" />
      <div className="showcase-skeleton-btn showcase-skeleton-block" />
    </div>
  );

  return (
    <div className="showcase-row">
      {reverse ? (
        <>
          {text}
          {media}
        </>
      ) : (
        <>
          {media}
          {text}
        </>
      )}
    </div>
  );
}