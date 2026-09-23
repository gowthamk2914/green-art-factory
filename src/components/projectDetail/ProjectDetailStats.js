"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import {
  Leaf,
  Maximize,
  MapPin,
  Shield,
  Calendar,
  User,
  Recycle,
  Sprout,
} from "lucide-react";

// Decorative assets — drop your two exported PNGs at these paths (or swap
// for your own asset host / CMS URLs). Both already have the wave shape
// baked into the image itself, so no clip-path/mask is needed here.
const TOP_RIGHT_IMAGE = "/images/project-detail-stat-section-img-1.png";
const BOTTOM_LEFT_IMAGE = "/images/project-detail-stat-section-img-2.png";

// How many spec rows to put in the primary (larger) row before wrapping
// to the secondary row — matches the original 4-then-3 layout, but works
// for any number of specs the API sends back.
const PRIMARY_ROW_SIZE = 4;

// The API sends specifications as free-text { label, value } pairs, not
// icon keys, so we match on keywords in the label to pick an icon —
// falling back to a generic leaf for anything unrecognized.
function getIconForLabel(label = "") {
  const normalized = label.toLowerCase();
  if (normalized.includes("area")) return Maximize;
  if (normalized.includes("location")) return MapPin;
  if (normalized.includes("system")) return Shield;
  if (normalized.includes("year") || normalized.includes("date")) return Calendar;
  if (normalized.includes("client")) return User;
  if (normalized.includes("coverage") || normalized.includes("recycl")) return Recycle;
  if (normalized.includes("species") || normalized.includes("plant")) return Sprout;
  return Leaf;
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="projectDetailStatPill">
      <span className="projectDetailStatIcon">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="projectDetailStatText">
        <span className="projectDetailStatLabel">{label}</span>
        <span className="projectDetailStatValue">{value}</span>
      </span>
    </div>
  );
}

export default function ProjectDetailStats() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  const overview = project.project_overview ?? {};
  const specifications = overview.specifications ?? [];

  const primaryStats = specifications.slice(0, PRIMARY_ROW_SIZE);
  const secondaryStats = specifications.slice(PRIMARY_ROW_SIZE);

  return (
    <section className="projectDetailStatsSection" aria-label="Project overview">
      <div className="projectDetailStatsCard">
        {/* Bottom-left decorative wave — sits behind the content, peeking
            out past the card's rounded corner. */}
        <Image
          src={BOTTOM_LEFT_IMAGE}
          alt=""
          width={260}
          height={90}
          className="projectDetailStatsBlobBottom"
          aria-hidden="true"
        />

        <div className="projectDetailStatsBody">
          <div className="projectDetailStatsHeading">
            <span className="projectDetailStatsBadge" aria-hidden="true">
              <Leaf size={16} strokeWidth={1.8} />
            </span>
            <h2 className="projectDetailStatsTitle">
              {overview.title || project.title}
              {project.category?.name && (
                <>
                  {" "}
                  <span className="projectDetailStatsDot">&middot;</span>{" "}
                  {project.category.name}
                </>
              )}
            </h2>
            <span className="projectDetailStatsRule" aria-hidden="true" />
          </div>

          {overview.description && (
            <p className="projectDetailStatsDescription">{overview.description}</p>
          )}

          {primaryStats.length > 0 && (
            <div className="projectDetailStatsRow">
              {primaryStats.map((stat) => (
                <StatPill
                  key={stat.label}
                  icon={getIconForLabel(stat.label)}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          )}

          {secondaryStats.length > 0 && (
            <div className="projectDetailStatsRow projectDetailStatsRowSecondary">
              {secondaryStats.map((stat) => (
                <StatPill
                  key={stat.label}
                  icon={getIconForLabel(stat.label)}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right-side decorative panel — the wavy left edge is already
            part of this PNG's artwork, so it's placed as a plain image. */}
        <div className="projectDetailStatsMedia">
          <Image
            src={TOP_RIGHT_IMAGE}
            alt=""
            fill
            sizes="(max-width: 900px) 0px, 320px"
            className="projectDetailStatsMediaImage"
          />
        </div>
      </div>
    </section>
  );
}