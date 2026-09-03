"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { getFeaturedProjectsRequest } from "../../redux/FeaturedProjects/actions";


const AUTOPLAY_INTERVAL_MS = 2000;



export default function FeaturedProjects() {

  const dispatch = useDispatch();

const {
  loading,
  data: projects,
  error,
} = useSelector(
  (state) => state.FeaturedProjects
);

useEffect(() => {
  dispatch(getFeaturedProjectsRequest());
}, [dispatch]);


  const [index, setIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = useCallback(
    () => setIndex((p) => (p + 1) % projects.length),
    [projects.length]
  );
  const prev = useCallback(
    () => setIndex((p) => (p - 1 + projects.length) % projects.length),
    [projects.length]
  );

  // responsive card positions (unchanged)
  useEffect(() => {
    const updatePositions = () => {
      const width = window.innerWidth;

      if (width >= 1100) {
        setPositions([
          { x: -470, y: 10, scale: 0.82, z: 1, opacity: 0.55, h: 320 },
          { x: -235, y: 0, scale: 0.92, z: 2, opacity: 0.9, h: 360 },
          { x: 0, y: 60, scale: 1, z: 5, opacity: 1, h: 300 },
          { x: 235, y: 0, scale: 0.92, z: 2, opacity: 0.9, h: 360 },
          { x: 470, y: 10, scale: 0.82, z: 1, opacity: 0.55, h: 320 },
        ]);
      } else if (width >= 1024) {
        setPositions([
          { x: -390, y: 10, scale: 0.82, z: 1, opacity: 0.55, h: 300 },
          { x: -195, y: 0, scale: 0.92, z: 2, opacity: 0.9, h: 340 },
          { x: 0, y: 50, scale: 1, z: 5, opacity: 1, h: 280 },
          { x: 195, y: 0, scale: 0.92, z: 2, opacity: 0.9, h: 340 },
          { x: 390, y: 10, scale: 0.82, z: 1, opacity: 0.55, h: 300 },
        ]);
      } else if (width >= 992) {
        setPositions([
          { x: -300, y: 10, scale: 0.82, z: 1, opacity: 0.45, h: 260 },
          { x: -150, y: 0, scale: 0.92, z: 2, opacity: 0.85, h: 300 },
          { x: 0, y: 45, scale: 1, z: 5, opacity: 1, h: 250 },
          { x: 150, y: 0, scale: 0.92, z: 2, opacity: 0.85, h: 300 },
          { x: 300, y: 10, scale: 0.82, z: 1, opacity: 0.45, h: 260 },
        ]);
      } else if (width >= 768) {
        setPositions([
          { x: -180, y: 0, scale: 0.85, z: 1, opacity: 0.3, h: 220 },
          { x: -90, y: 0, scale: 0.95, z: 2, opacity: 0.75, h: 260 },
          { x: 0, y: 35, scale: 1, z: 5, opacity: 1, h: 230 },
          { x: 90, y: 0, scale: 0.95, z: 2, opacity: 0.75, h: 260 },
          { x: 180, y: 0, scale: 0.85, z: 1, opacity: 0.3, h: 220 },
        ]);
      } else {
        setPositions([
          { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
          { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
          { x: 0, y: 0, scale: 1, z: 5, opacity: 1, h: 250 },
          { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
          { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
        ]);
      }
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  // autoplay: advance every AUTOPLAY_INTERVAL_MS, paused on hover
  useEffect(() => {
    if (isPaused) return undefined;
    if (!projects || projects.length === 0) return undefined;
    intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next, projects]);

  const resetAutoplayTimer = () => {
    clearInterval(intervalRef.current);
    if (!isPaused) {
      intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL_MS);
    }
  };

  const handlePrev = () => {
    prev();
    resetAutoplayTimer();
  };

  const handleNext = () => {
    next();
    resetAutoplayTimer();
  };

  // Guard against the initial/empty Redux state (projects === []) — must be
  // ready before we try to build the visible slice, otherwise `% projects.length`
  // is `% 0` (NaN) and `projects[NaN]` is undefined, crashing on item.cover_image.
  if (!positions.length) return null;

  if (loading) {
    return (
      <section className="featured-projects">
        <div className="container">
          <div className="featured-wrapper">
            <h2 className="featured-title">Featured Projects</h2>
            <p className="featured-description">Loading featured projects…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !projects || projects.length === 0) {
    return null;
  }

  // Build only as many card slots as there are unique projects (capped at 5 —
  // the number of layout positions we have). Previously this always looped
  // i = -2..2 regardless of how many projects existed; if projects.length was
  // less than 5, the modulo wrapped around and reused the same item.id for
  // multiple slots. React then collapsed those duplicate keys, so only the
  // handful of genuinely distinct ids actually rendered — which is why only
  // 2 images were showing up instead of the full set.
  const slotCount = Math.min(5, projects.length);
  const startOffset = -Math.floor((slotCount - 1) / 2);

  const visible = [];
  for (let i = 0; i < slotCount; i++) {
    const offset = startOffset + i;
    const idx = (index + offset + projects.length) % projects.length;
    // posIndex maps this slot to the correct entry in the 5-slot `positions`
    // array (which is always laid out for offsets -2..2, i.e. indices 0..4)
    const posIndex = offset + 2;
    visible.push({ item: projects[idx], posIndex });
  }

  return (
    <section className="featured-projects">
      <div className="container">
        <div className="featured-wrapper">
          <h2 className="featured-title">Featured Projects</h2>

          <div
            className="featured-stage"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence initial={false}>
              {visible.map(({ item, posIndex }) => (
                <motion.div
                  key={item.id}
                  className="featured-card"
                  animate={{
                    x: positions[posIndex].x,
                    y: positions[posIndex].y,
                    scale: positions[posIndex].scale,
                    opacity: positions[posIndex].opacity,
                    zIndex: positions[posIndex].z,
                    height: positions[posIndex].h,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Image src={item.cover_image || "/images/projects-placeholder.jpg"} alt={item.title} fill className="featured-image" />

                  <div className="featured-caption-scrim" />

                  <div className="featured-caption">
                    <span className="featured-caption-sector">
                      <span className="featured-caption-dot" />
                      {Array.isArray(item.sectors) ? item.sectors.join(", ") : item.sectors}
                    </span>
                    <h3 className="featured-caption-title">{item.title}</h3>
                     
                     <div className="featured-category-wrapper">
                    <p className="featured-category">{item.category}</p>
                    </div>

                    <span className="featured-caption-cta">
                      <span className="featured-caption-cta-text">View Project</span>
                      <span className="featured-caption-cta-icon">
                        <FiArrowUpRight />
                      </span>
                    </span>
                  </div>

                  <Link
                    href={`/projects/${item.slug}`}
                    className="featured-card-link"
                    aria-label={`View ${item.title} project`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <p className="featured-description">
            Explore a curated collection of our most distinctive projects, thoughtfully
            designed to transform spaces through greenery, creativity and immersive biophilic
            experiences.
          </p>

          <div className="featured-controls">
            <button onClick={handlePrev} aria-label="Previous project">
              <IoChevronBack />
            </button>
            <button onClick={handleNext} aria-label="Next project">
              <IoChevronForward />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}