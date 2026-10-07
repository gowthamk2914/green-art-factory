"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { getFeaturedProjectsRequest } from "../../redux/FeaturedProjects/actions";

const AUTOPLAY_INTERVAL_MS = 2000;
const PLACEHOLDER_IMAGE = "/images/projects-placeholder.jpg";

// Image = first gallery image, then cover_image, then placeholder
const getProjectImage = (project) =>
  project?.gallery?.[0]?.url || project?.cover_image || PLACEHOLDER_IMAGE;

const getProjectAlt = (project) =>
  project?.gallery?.[0]?.alt || project?.title || "Project image";

// sectors: [{ name, slug }] -> "Commercial, Beachside"
const getSectorNames = (sectors) =>
  Array.isArray(sectors)
    ? sectors.map((s) => s?.name).filter(Boolean).join(", ")
    : "";

export default function FeaturedProjects() {
  const dispatch = useDispatch();

  const {
    loading,
    data,
    error,
  } = useSelector((state) => state.FeaturedProjects);

  // Works whether the store holds the array directly or the full API payload
  const projects = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.data?.projects)) return data.data.projects;
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(getFeaturedProjectsRequest());
  }, [dispatch]);

  const [index, setIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = useCallback(
    () => setIndex((p) => (projects.length ? (p + 1) % projects.length : 0)),
    [projects.length]
  );
  const prev = useCallback(
    () =>
      setIndex((p) =>
        projects.length ? (p - 1 + projects.length) % projects.length : 0
      ),
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
          { x: -180, y: 0, scale: 0.85, z: 1, opacity: 0, h: 220 },
          { x: -250, y: 0, scale: 0.95, z: 2, opacity: 0.75, h: 260 },
          { x: 0, y: 35, scale: 1, z: 5, opacity: 1, h: 230 },
          { x: 250, y: 0, scale: 0.95, z: 2, opacity: 0.75, h: 260 },
          { x: 180, y: 0, scale: 0.85, z: 1, opacity: 0, h: 220 },
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
    if (projects.length === 0) return undefined;
    intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next, projects.length]);

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

  if (error || projects.length === 0) {
    return null;
  }

  // Only build as many slots as there are unique projects (max 5) so that
  // duplicate keys are never rendered.
  const slotCount = Math.min(5, projects.length);
  const startOffset = -Math.floor((slotCount - 1) / 2);

  const visible = [];
  for (let i = 0; i < slotCount; i++) {
    const offset = startOffset + i;
    const idx = (index + offset + projects.length) % projects.length;
    const posIndex = offset + 2; // maps to the 5-slot `positions` array
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
                  <Image
                    src={getProjectImage(item)}
                    alt={getProjectAlt(item)}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="featured-image"
                  />

                  <div className="featured-caption-scrim" />

                  <div className="featured-caption">
                    <span className="featured-caption-sector">
                      <span className="featured-caption-dot" />
                      {getSectorNames(item.sectors)}
                    </span>
                    <h3 className="featured-caption-title">{item.title}</h3>

                    <div className="featured-category-wrapper">
                      <p className="featured-category">
                        {item.category?.name}
                      </p>
                    </div>

                    <span className="featured-caption-cta">
                      <span className="featured-caption-cta-text">View Project</span>
                      <span className="featured-caption-cta-icon">
                        <FiArrowUpRight />
                      </span>
                    </span>
                  </div>

                  <Link
                    href={item.cta_url || `/portfolio/${item.slug}`}
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