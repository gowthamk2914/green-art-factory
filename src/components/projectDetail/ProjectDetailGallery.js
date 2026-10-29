"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

// How many photos the project page previews before "View All" appears
const PREVIEW_IMAGE_COUNT = 5;

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Every image of the project, in a balanced order: one image from each
// collection in turn (so the first 5 mix collections, as before), then
// any gallery images that are not already included. Duplicates removed.
function collectProjectImages(project) {
  const result = [];
  const seen = new Set();

  const add = (src, alt, idPart) => {
    if (typeof src !== "string" || !src.trim() || seen.has(src)) return;
    seen.add(src);
    result.push({ id: `${idPart}-${result.length}`, src, alt });
  };

  const queues = (project?.collections ?? [])
    .filter((collection) => (collection.images ?? []).length > 0)
    .map((collection) => ({
      collection,
      remaining: [...collection.images],
    }));

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (const queue of queues) {
      if (queue.remaining.length === 0) continue;

      madeProgress = true;
      const src = queue.remaining.shift();
      const { collection } = queue;

      add(
        src,
        [collection.variant, collection.name].filter(Boolean).join(" \u2014 "),
        `${collection.slug}-${collection.variant_slug}`
      );
    }
  }

  (project?.gallery ?? []).forEach((item) =>
    add(item?.url, project?.title || "Project image", "gallery")
  );

  return result;
}

// Image-size hints so Next.js doesn't download oversized files for small cells.
function getSizes(count) {
  if (count === 1) return "(max-width: 1600px) 100vw, 1600px";
  if (count === 2) return "(max-width: 560px) 100vw, 50vw";
  if (count === 3) return "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 55vw";
  return "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw";
}

function GalleryCell({ image, slotIndex, sizes, reduceMotion }) {
  return (
    <motion.div
      data-slot={slotIndex}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: reduceMotion ? 0 : slotIndex * 0.08,
      }}
      className="projectDetailGalleryCell"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="projectDetailGalleryImage"
      />
    </motion.div>
  );
}

export default function ProjectDetailGallery() {
  const project = useSelector((state) => state.ProjectDetail?.data);
  const reduceMotion = useReducedMotion();

  const allImages = useMemo(() => collectProjectImages(project), [project]);

  const previewImages = useMemo(
    () => allImages.slice(0, PREVIEW_IMAGE_COUNT),
    [allImages]
  );

  const [displayImages, setDisplayImages] = useState([]);

  // Shuffle ONCE each time the gallery appears: page load / reload, or
  // arriving through navigation (including coming back from "View All").
  // No timer, so it never reshuffles while the visitor stays on the page.
  useEffect(() => {
    setDisplayImages(shuffleArray(previewImages));
  }, [previewImages]);

  if (displayImages.length === 0) return null;

  const count = displayImages.length;
  const total = allImages.length;
  const sizes = getSizes(count);

  const hasMore = total > PREVIEW_IMAGE_COUNT;
  const viewAllHref = project?.slug ? `/portfolio/${project.slug}/gallery` : null;

  return (
    <section className="projectDetailGallerySection" aria-label="Project gallery">
      <h2 className="projectDetailGalleryTitle">Project Gallery</h2>

      <div className="projectDetailGalleryGrid" data-count={count}>
        {displayImages.map((image, index) => (
          <GalleryCell
            key={image.id}
            image={image}
            slotIndex={index}
            sizes={sizes}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {hasMore && viewAllHref && (
        <div className="projectDetailGalleryMore">
          <Link
            href={viewAllHref}
            className="projectDetailGalleryMoreBtn"
            aria-label={`View all ${total} photos of ${project?.title || "this project"}`}
          >
            View All Photos
            <span className="projectDetailGalleryMoreCount">{total}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}