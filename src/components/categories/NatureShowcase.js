"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getNatureShowcaseRequest } from "../../redux/NatureShowcase/actions";

const SHUFFLE_INTERVAL = 7000; // 7 seconds

/* Fisher–Yates shuffle (returns a new array) */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* Shuffle that guarantees a different order from the previous one */
function shuffleDifferent(arr) {
  if (arr.length < 2) return arr;
  let next = shuffleArray(arr);
  let attempts = 0;
  while (next.every((v, i) => v === arr[i]) && attempts < 5) {
    next = shuffleArray(arr);
    attempts++;
  }
  return next;
}

/*
  Returns images in a shuffled order.
  - Initial render uses the original order (keeps SSR/hydration consistent)
  - On mount (every page refresh) the order is shuffled
  - Then re-shuffled every `intervalMs`
*/
function useShuffledImages(images, intervalMs = SHUFFLE_INTERVAL) {
  const [ordered, setOrdered] = useState(images);
  const key = images.join("|");

  useEffect(() => {
    // reshuffle on mount / when the source images change
    setOrdered((prev) => shuffleDifferent(images.length ? images : prev));

    if (images.length < 2) return;

    const id = setInterval(() => {
      // skip while the tab is hidden
      if (typeof document !== "undefined" && document.hidden) return;
      setOrdered((prev) => shuffleDifferent(prev));
    }, intervalMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, intervalMs]);

  return ordered;
}

export default function NatureShowcase() {
  const dispatch = useDispatch();

  const {
    loading,
    data: pageData,
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

  const products = pageData?.products || [];

  return (
    <section className="showcase-section">
      <div className="container">
        <div className="showcase-wrapper">
          {[...products]
            .sort((a, b) => a.id - b.id)
            .map((product, index) => {
              const imageFirst = index % 2 === 0;

              // all available images for this product
              const variantImages =
                product?.variants?.map((v) => v.image).filter(Boolean) || [];

              const images =
                variantImages.length > 0
                  ? variantImages
                  : [product?.cover_image || "/images/placeholder.jpg"];

              const item = {
                id: product.id,
                title: product.name,
                description: product.description || "",
                href: product.cta_url || "#",
                images,
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

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
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
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`showcase-row ${
        imageFirst
          ? "showcase-row--image-first"
          : "showcase-row--text-first"
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
  const shuffled = useShuffledImages(item.images, SHUFFLE_INTERVAL);

  const heroImage = shuffled[0];
  const thumbnails = shuffled.slice(1, 5);

  return (
    <div className="showcase-media">
      <div className="showcase-media-hero">
        <Image
          key={heroImage}
          src={heroImage}
          alt={item.title}
          fill
          className="showcase-media-image showcase-img-swap"
        />
      </div>

      {thumbnails.length > 0 && (
        <div className="showcase-thumbs">
          {thumbnails.map((thumb, index) => (
            <div className="showcase-thumb" key={index}>
              <Image
                key={`${thumb}-${index}`}
                src={thumb}
                alt={`${item.title}-${index + 1}`}
                fill
                className="showcase-thumb-image showcase-img-swap"
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

      {item.description && (
        <p className="showcase-desc">{item.description}</p>
      )}

      <Link href={item.href} className="showcase-btn">
        <span className="showcase-btn-label">View Now</span>

        <span className="showcase-btn-icon">
          <FiArrowUpRight />
        </span>
      </Link>
    </div>
  );
}

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