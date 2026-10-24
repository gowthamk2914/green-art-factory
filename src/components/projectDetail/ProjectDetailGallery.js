"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SHUFFLE_INTERVAL_MS = 7000;
const TARGET_IMAGE_COUNT = 5;

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildGalleryImages(collections, targetCount = TARGET_IMAGE_COUNT) {
  if (!Array.isArray(collections) || collections.length === 0) return [];

  const queues = collections
    .filter((collection) => (collection.images ?? []).length > 0)
    .map((collection) => ({
      collection,
      remaining: [...collection.images],
    }));

  const result = [];
  let madeProgress = true;

  while (result.length < targetCount && madeProgress) {
    madeProgress = false;

    for (const queue of queues) {
      if (result.length >= targetCount) break;
      if (queue.remaining.length === 0) continue;

      madeProgress = true;
      const src = queue.remaining.shift();
      const { collection } = queue;

      result.push({
        id: `${collection.slug}-${collection.variant_slug}-${result.length}`,
        src,
        alt: [collection.variant, collection.name].filter(Boolean).join(" \u2014 "),
      });
    }
  }

  return result;
}

// Image-size hints so Next.js doesn't download oversized files for small cells.
function getSizes(count) {
  if (count === 1) return "(max-width: 1600px) 100vw, 1600px";
  if (count === 2) return "(max-width: 560px) 100vw, 50vw";
  if (count === 3) return "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 55vw";
  return "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw";
}

function GalleryCell({ image, slotIndex, sizes }) {
  return (
    <motion.div
      layout
      layoutId={image.id}
      data-slot={slotIndex}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        layout: { duration: 0.7, ease: "easeInOut" },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
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

  const images = useMemo(
    () => buildGalleryImages(project?.collections),
    [project?.collections]
  );

  const [displayImages, setDisplayImages] = useState(images);

  useEffect(() => {
    setDisplayImages(shuffleArray(images));
  }, [images]);

  // Shuffling only makes sense with 2+ images
  useEffect(() => {
    if (images.length < 2) return;

    const intervalId = setInterval(() => {
      setDisplayImages((prev) => shuffleArray(prev));
    }, SHUFFLE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [images.length]);

  if (images.length === 0) return null;

  const count = images.length;
  const sizes = getSizes(count);

  return (
    <section className="projectDetailGallerySection" aria-label="Project gallery">
      <h2 className="projectDetailGalleryTitle">Project Gallery</h2>

      <div className="projectDetailGalleryGrid" data-count={count}>
        <AnimatePresence mode="popLayout">
          {displayImages.map((image, index) => (
            <GalleryCell
              key={image.id}
              image={image}
              slotIndex={index}
              sizes={sizes}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}