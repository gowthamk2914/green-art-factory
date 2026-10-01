"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getNatureShowcaseRequest } from "../../redux/NatureShowcase/actions";

const SHUFFLE_INTERVAL = 7000; // 7 seconds
const STORAGE_PREFIX = "showcase-last-hero-";
const VISIBLE_SLOTS = 5; // 1 hero + 4 thumbnails

/* Fisher–Yates shuffle (returns a new array) */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* Shuffles and guarantees the first item is not `avoidFirst` */
function shuffleWithNewFirst(arr, avoidFirst) {
  if (arr.length < 2) return arr;

  const next = shuffleArray(arr);

  if (next[0] === avoidFirst) {
    const swapWith = 1 + Math.floor(Math.random() * (next.length - 1));
    [next[0], next[swapWith]] = [next[swapWith], next[0]];
  }

  return next;
}

function readLastHero(storageKey) {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function saveLastHero(storageKey, value) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    /* storage unavailable – ignore */
  }
}

/*
  - Every page load: shuffles, first image always differs from last load.
  - Every `intervalMs`: shuffles again, first image always changes.
  - `ready` is false until the first shuffle, so the original order
    never flashes and the first shuffle doesn't animate.
*/
function useShuffledImages(images, storageKey, intervalMs = SHUFFLE_INTERVAL) {
  const [ordered, setOrdered] = useState(images);
  const [ready, setReady] = useState(false);
  const prevHeroRef = useRef(undefined);
  const key = images.join("|");

  useEffect(() => {
    if (images.length === 0) return;

    if (prevHeroRef.current === undefined) {
      prevHeroRef.current = readLastHero(storageKey);
    }

    setOrdered(shuffleWithNewFirst(images, prevHeroRef.current));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, storageKey]);

  useEffect(() => {
    if (images.length < 2) return;

    const id = setInterval(() => {
      if (document.hidden) return;
      setOrdered((prev) => shuffleWithNewFirst(prev, prev[0]));
    }, intervalMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, intervalMs]);

  useEffect(() => {
    if (ready && ordered[0]) saveLastHero(storageKey, ordered[0]);
  }, [ordered, ready, storageKey]);

  return { ordered, ready };
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

              // de-duplicated so each image has a unique, stable key
              const variantImages = [
                ...new Set(
                  product?.variants?.map((v) => v.image).filter(Boolean) || []
                ),
              ];

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
  const { ordered, ready } = useShuffledImages(
    item.images,
    `${STORAGE_PREFIX}${item.id}`,
    SHUFFLE_INTERVAL
  );

  return (
    <div className="showcase-media">
      <div className="showcase-stage">
        {ready &&
          // item.images keeps a STABLE order, so DOM nodes are never
          // re-created; only each tile's slot changes -> CSS animates it
          item.images.map((src, i) => {
            const pos = ordered.indexOf(src);
            const slot = pos > -1 && pos < VISIBLE_SLOTS ? pos : "hidden";

            return (
              <div
                key={src}
                className="showcase-tile"
                data-slot={slot}
                style={{ "--slot": slot === "hidden" ? VISIBLE_SLOTS - 1 : slot }}
              >
                <Image
                  src={src}
                  alt={`${item.title}-${i + 1}`}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  className="showcase-tile-image"
                />
              </div>
            );
          })}
      </div>
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