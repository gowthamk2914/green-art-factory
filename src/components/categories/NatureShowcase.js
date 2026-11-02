"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getNatureShowcaseRequest } from "../../redux/NatureShowcase/actions";

const STORAGE_PREFIX = "showcase-last-hero-";
const VISIBLE_SLOTS = 5; // 1 hero + 4 thumbnails

/* Where an image click goes.
   true  -> each image opens its own variant page:  /gallery/:productSlug/:variantSlug
            (same route the Products section uses; falls back to the
            "View Now" link when a slug is missing)
   false -> every image opens the same page as the "View Now" button */
const IMAGE_LINKS_TO_VARIANT = true;

/* Builds /gallery/:productSlug/:variantSlug, or returns null if a slug is missing */
function buildGalleryUrl(productSlug, variantSlug) {
  if (!productSlug || !variantSlug) return null;
  return `/gallery/${productSlug}/${variantSlug}`;
}

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
  - Shuffles ONCE each time the component mounts (page load, refresh,
    or navigating back to this page). The first image always differs
    from the one shown last time.
  - No timed re-shuffling.
  - `ready` is false until the first shuffle, so the original order
    never flashes.
*/
function useShuffledImages(images, storageKey) {
  const [ordered, setOrdered] = useState(images);
  const [ready, setReady] = useState(false);
  const key = images.join("|");

  useEffect(() => {
    if (images.length === 0) return;

    const lastHero = readLastHero(storageKey);
    const next = shuffleWithNewFirst(images, lastHero);

    setOrdered(next);
    setReady(true);

    if (next[0]) saveLastHero(storageKey, next[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, storageKey]);

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
          <div className="breadcrumb">
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>

            <i className="bi bi-chevron-right breadcrumb-arrow"></i>

            <Link href="/products-list" className="breadcrumb-item active">
              Our Products
            </Link>
          </div>

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
        <div className="breadcrumb">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>

          <i className="bi bi-chevron-right breadcrumb-arrow"></i>

          <Link href="/products-list" className="breadcrumb-item active">
            Our Products
          </Link>
        </div>

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

              const href = product.cta_url || "#";

              // image src -> where clicking that image goes
              const imageHrefs = {};
              if (IMAGE_LINKS_TO_VARIANT) {
                (product?.variants || []).forEach((v) => {
                  if (!v.image || imageHrefs[v.image]) return;
                  imageHrefs[v.image] =
                    buildGalleryUrl(product.slug, v.slug) || href;
                });
              }

              const item = {
                id: product.id,
                title: product.name,
                description: product.description || "",
                href,
                images,
                imageHrefs,
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
    `${STORAGE_PREFIX}${item.id}`
  );

  return (
    <div className="showcase-media">
      <div className="showcase-stage">
        {ready &&
          // item.images keeps a STABLE order, so DOM nodes are never
          // re-created; only each tile's slot changes
          item.images.map((src, i) => {
            const pos = ordered.indexOf(src);
            const slot = pos > -1 && pos < VISIBLE_SLOTS ? pos : "hidden";
            const isHidden = slot === "hidden";
            const tileHref = item.imageHrefs?.[src] || item.href;

            return (
              <div
                key={src}
                className="showcase-tile"
                data-slot={slot}
                style={{ "--slot": isHidden ? VISIBLE_SLOTS - 1 : slot }}
              >
                <Image
                  src={src}
                  alt={`${item.title}-${i + 1}`}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  className="showcase-tile-image"
                />

                {/* Click target covering the whole tile. Hidden (off-stage)
                    tiles get no link, so they can't be clicked or tabbed to. */}
                {!isHidden && (
                  <Link
                    href={tileHref}
                    className="showcase-tile-link"
                    aria-label={`View ${item.title}`}
                  />
                )}
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