"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

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
        {project.label && (
          <span className="projectDetailRelatedCardLabel">{project.label}</span>
        )}
        <h3 className="projectDetailRelatedCardTitle">{project.title}</h3>
      </div>
    </Link>
  );
}

export default function ProjectDetailRelatedProjects() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  // Map the API's related-project shape onto what ProjectCard expects.
  // Original mock pointed `href` at a /products/* collection page with a
  // static "Collection" label — these are actual related *projects*, so
  // `href` goes to the project's own detail page and the label uses its
  // category instead.
  const relatedProjects = (project?.related ?? []).map((item) => ({
    slug: item.slug,
    label: item.category?.name,
    title: item.title,
    image: item.cover_image,
    href: item.cta_url,
  }));

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Only run the infinite marquee when the cards genuinely don't fit the
  // viewport. On wide screens where all cards already fit, the row just
  // sits still — looping a row that already fits would mean pointlessly
  // sliding cards off-screen with empty space behind them.
  //
  // Re-checks when the related-project count changes (e.g. navigating
  // from one project detail page to another with a different number of
  // related projects), not just on window resize.
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
  }, [relatedProjects.length]);

  if (relatedProjects.length === 0) return null;

  // Cards rendered twice back-to-back so the marquee can loop seamlessly
  // (translateX(-50%) lands exactly on the start of the second copy).
  const marqueeItems = isOverflowing
    ? [...relatedProjects, ...relatedProjects]
    : relatedProjects;

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