"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SHUFFLE_INTERVAL_MS = 7000;

// Static placeholder set — swap these for real project-gallery images
// later (same shape: { id, src, alt }).
const GALLERY_IMAGES = [
  {
    id: "bark-texture",
    src: "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/63/bark-1.jpg.jpg",
    alt: "Close-up of natural bark texture",
  },
  {
    id: "atrium-installation",
    src: "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/114/green-plants-growing-in-pots-on-a-rooftop-with-city-skyline-in-the-background-photo.jpg.jpg",
    alt: "Glass atrium installation",
  },
  {
    id: "plant-corner",
    src: "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/53/living-1.jpg.jpg",
    alt: "Indoor plant corner",
  },
  {
    id: "greenhouse-walkway",
    src: "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/81/indoor-gallery-9.png.png",
    alt: "Greenhouse walkway lined with plants",
  },
  {
    id: "white-flowers",
    src: "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/54/living-2.jpg.jpg",
    alt: "Close-up of white flowering plant",
  },
];

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
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
  const [displayImages, setDisplayImages] = useState(GALLERY_IMAGES);
  const imagesRef = useRef(GALLERY_IMAGES);

  // Shuffle once on mount (covers "on refresh") ...
  useEffect(() => {
    setDisplayImages(shuffleArray(imagesRef.current));
  }, []);

  // ...and again every 7 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayImages((prev) => shuffleArray(prev));
    }, SHUFFLE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

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