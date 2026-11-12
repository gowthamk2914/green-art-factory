"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

function HighlightBullet() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="projectDetailKeyHighlightsBulletIcon"
    >
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function HighlightItem({ title, description }) {
  return (
    <div className="projectDetailKeyHighlightsItem">
      <span className="projectDetailKeyHighlightsBullet" aria-hidden="true">
        <HighlightBullet />
      </span>
      <div className="projectDetailKeyHighlightsText">
        <h3 className="projectDetailKeyHighlightsItemTitle">{title}</h3>
        <p className="projectDetailKeyHighlightsItemDescription">{description}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailKeyHighlights() {
  const project = useSelector((state) => state.ProjectDetail?.data);

  const highlights = useMemo(() => {
    const list = project?.content?.key_highlights;
    if (!Array.isArray(list)) return [];

    return list
      .map((item) => ({
        title: item?.title?.trim() ?? "",
        description: item?.description?.trim() ?? "",
      }))
      .filter((item) => item.title && item.description);
  }, [project?.content?.key_highlights]);

  if (highlights.length === 0) return null;

  return (
    <section className="projectDetailKeyHighlightsSection" aria-label="Key highlights">
      <div className="projectDetailKeyHighlightsCard">
        <h2 className="projectDetailKeyHighlightsTitle">Key Highlights</h2>

        <div className="projectDetailKeyHighlightsGrid">
          {highlights.map((highlight, index) => (
            <HighlightItem
              key={`${highlight.title}-${index}`}
              title={highlight.title}
              description={highlight.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}