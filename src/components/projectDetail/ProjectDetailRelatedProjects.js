"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RELATED_PROJECTS = [
  {
    slug: "artificial-trees",
    label: "Collection",
    title: "Artificial Trees",
    image:
      "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/33/bespoke1.jpg.jpg",
    href: "/products/bespoke-artificial-trees",
  },
  {
    slug: "vertical-gardens",
    label: "Collection",
    title: "Vertical Gardens",
    image:
      "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/38/green-wall1.jpg.jpg",
    href: "/products/green-walls",
  },
  {
    slug: "green-ceilings",
    label: "Collection",
    title: "Green Ceilings",
    image:
      "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/47/biophilic-5.jpg.jpg",
    href: "/products/biophilic-designs-indoor-landscapes",
  },
  {
    slug: "artificial-hedges",
    label: "Collection",
    title: "Artificial Hedges",
    image:
      "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/41/green-wall4.jpg.jpg",
    href: "/products/green-walls",
  },
  {
    slug: "preserved-plants",
    label: "Collection",
    title: "Preserved Plants",
    image:
      "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/30/moss5.jpg.jpg",
    href: "/products/moss-creations",
  },
];

function ProjectCard({ project }) {
  return (
    <Link href={project.href} className="projectDetailRelatedCard">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 70vw, 280px"
        className="projectDetailRelatedCardImage"
      />
      <div className="projectDetailRelatedCardOverlay" />
      <div className="projectDetailRelatedCardCaption">
        <span className="projectDetailRelatedCardLabel">{project.label}</span>
        <h3 className="projectDetailRelatedCardTitle">{project.title}</h3>
      </div>
    </Link>
  );
}

export default function ProjectDetailRelatedProjects() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Only run the infinite marquee when the cards genuinely don't fit the
  // viewport. On wide screens where all 5 cards already fit, the row
  // just sits still — looping a row that already fits would mean
  // pointlessly sliding cards off-screen with empty space behind them.
  useEffect(() => {
    function checkOverflow() {
      if (!containerRef.current || !trackRef.current) return;
      // Track is duplicated when overflowing (see render below), so
      // measure against half its scrollWidth to get the TRUE single-set
      // width for this comparison.
      const singleSetWidth = isOverflowing
        ? trackRef.current.scrollWidth / 2
        : trackRef.current.scrollWidth;
      setIsOverflowing(singleSetWidth > containerRef.current.clientWidth);
    }

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cards rendered twice back-to-back so the marquee can loop seamlessly
  // (translateX(-50%) lands exactly on the start of the second copy).
  const marqueeItems = isOverflowing
    ? [...RELATED_PROJECTS, ...RELATED_PROJECTS]
    : RELATED_PROJECTS;

  return (
    <section className="projectDetailRelatedSection" aria-label="Related projects">
      <h2 className="projectDetailRelatedTitle">
        Related <span className="projectDetailRelatedTitleAccent">Projects</span>
      </h2>

      <div className="projectDetailRelatedViewport" ref={containerRef}>
        <div
          className={`projectDetailRelatedTrack${
            isOverflowing ? " isMarquee" : ""
          }`}
          ref={trackRef}
        >
          {marqueeItems.map((project, index) => (
            <ProjectCard key={`${project.slug}-${index}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}