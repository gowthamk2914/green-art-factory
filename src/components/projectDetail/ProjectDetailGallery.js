"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

// `project.collections` is a list of product/variant groups, each with
// its OWN `images` array (counts vary a lot — the sample has 14 images
// on one collection and 2 on another). Taking the first 5 images overall
// would silently drop any collection that comes after a large one, so
// instead we round-robin one image at a time across every collection's
// queue until we hit the target count (or every queue runs dry) — this
// guarantees every present collection gets represented in the gallery,
// not just the first one.
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

// Position now comes purely from CSS (via data-slot), not inline styles —
// this is what lets each breakpoint's media query redefine where a slot
// sits without an inline style overriding it.
function GalleryCell({ image, slotIndex }) {
  return (
    <motion.div
      layout
      layoutId={image.id}
      key={image.id}
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
        sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
        className="projectDetailGalleryImage"
      />
    </motion.div>
  );
}

export default function ProjectDetailGallery() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  const images = useMemo(
    () => buildGalleryImages(project?.collections),
    [project?.collections]
  );

  const [displayImages, setDisplayImages] = useState(images);
  const imagesRef = useRef(images);

  // Reset the displayed/base set whenever the underlying collections
  // change — e.g. navigating from one project detail page to another.
  useEffect(() => {
    imagesRef.current = images;
    setDisplayImages(shuffleArray(images));
  }, [images]);

  // Reshuffle order every 7 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayImages((prev) => shuffleArray(prev));
    }, SHUFFLE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="projectDetailGallerySection" aria-label="Project gallery">
      <h2 className="projectDetailGalleryTitle">Project Gallery</h2>

      <div className="projectDetailGalleryGrid">
        <AnimatePresence mode="popLayout">
          {displayImages.map((image, index) => (
            <GalleryCell key={image.id} image={image} slotIndex={index} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}