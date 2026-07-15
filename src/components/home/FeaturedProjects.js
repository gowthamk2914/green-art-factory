"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";


const AUTOPLAY_INTERVAL_MS = 3000;

const projects = [
  {
    id: 1,
    title: "Emerald Atrium Lobby",
    category: "Hospitality",
    slug: "emerald-atrium-lobby",
    image: "/images/projects1.jpg",
  },
  {
    id: 2,
    title: "Skyline Rooftop Garden",
    category: "Residential",
    slug: "skyline-rooftop-garden",
    image: "/images/projects2.jpg",
  },
  {
    id: 3,
    title: "Botanical Office Retreat",
    category: "Commercial",
    slug: "botanical-office-retreat",
    image: "/images/projects3.jpg",
  },
  {
    id: 4,
    title: "Living Wall Boutique",
    category: "Retail",
    slug: "living-wall-boutique",
    image: "/images/projects4.jpg",
  },
  {
    id: 5,
    title: "Courtyard Green Sanctuary",
    category: "Residential",
    slug: "courtyard-green-sanctuary",
    image: "/images/projects5.jpg",
  },
  
];

export default function FeaturedProjects() {
  const [index, setIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = useCallback(() => setIndex((p) => (p + 1) % projects.length), []);
  const prev = useCallback(() => setIndex((p) => (p - 1 + projects.length) % projects.length), []);

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
    intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next]);

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

  const visible = [];
  for (let i = -2; i <= 2; i++) {
    const idx = (index + i + projects.length) % projects.length;
    visible.push(projects[idx]);
  }

  if (!positions.length) return null;

  return (
    <section className="featured-projects">
      <div className="container">
        <div className="featured-wrapper">
          <h2 className="featured-title">FEATURED PROJECTS</h2>

          <div
            className="featured-stage"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence initial={false}>
              {visible.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="featured-card"
                  animate={{
                    x: positions[i].x,
                    y: positions[i].y,
                    scale: positions[i].scale,
                    opacity: positions[i].opacity,
                    zIndex: positions[i].z,
                    height: positions[i].h,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Image src={item.image} alt={item.title} fill className="featured-image" />

                  <div className="featured-caption-scrim" />

                  <div className="featured-caption">
                    <span className="featured-caption-category">
                      <span className="featured-caption-dot" />
                      {item.category}
                    </span>
                    <h3 className="featured-caption-title">{item.title}</h3>

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