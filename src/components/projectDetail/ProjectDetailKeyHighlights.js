"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

// `content.key_highlights` comes through as an HTML list, e.g.:
//   <ul><li><p>Bespoke Artificial Olive Trees – Five trees, each 4m
//   tall with mature, realistic trunks.</p></li>...</ul>
// Each <li> is "Title – Description", separated by an en dash. There's
// no structured { title, description } field from the API for this, so
// we parse it out of the HTML rather than guessing a different shape.
function parseHighlights(html) {
  if (typeof html !== "string") return [];

  const items = html.match(/<li[\s\S]*?<\/li>/g) ?? [];

  return items
    .map((item) => {
      const text = item
        .replace(/<[^>]+>/g, "") // strip tags (<li>, <p>, etc.)
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .trim();

      if (!text) return null;

      // en dash (–) is what the sample content uses; fall back to a
      // plain hyphen in case a different item was authored differently.
      const separatorMatch = text.match(/\s[\u2013-]\s/);
      if (!separatorMatch) {
        return { title: text, description: "" };
      }

      const splitIndex = separatorMatch.index;
      return {
        title: text.slice(0, splitIndex).trim(),
        description: text.slice(splitIndex + separatorMatch[0].length).trim(),
      };
    })
    .filter(Boolean);
}

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
        {description && (
          <p className="projectDetailKeyHighlightsItemDescription">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailKeyHighlights() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  const highlights = useMemo(
    () => parseHighlights(project?.content?.key_highlights),
    [project?.content?.key_highlights]
  );

  if (highlights.length === 0) return null;

  return (
    <section className="projectDetailKeyHighlightsSection" aria-label="Key highlights">
      <div className="projectDetailKeyHighlightsCard">
        <h2 className="projectDetailKeyHighlightsTitle">Key Highlights</h2>

        <div className="projectDetailKeyHighlightsGrid">
          {highlights.map((highlight) => (
            <HighlightItem key={highlight.title} {...highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}