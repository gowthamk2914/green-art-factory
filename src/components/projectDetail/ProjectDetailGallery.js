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
  
  const project = useSelector((state) => state.ProjectDetail?.data);

  const images = useMemo(
    () => buildGalleryImages(project?.collections),
    [project?.collections]
  );

  const [displayImages, setDisplayImages] = useState(images);
  const imagesRef = useRef(images);

 
  useEffect(() => {
    imagesRef.current = images;
    setDisplayImages(shuffleArray(images));
  }, [images]);

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