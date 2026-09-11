"use client";

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

const TOP_STATS = [
  { icon: Maximize, label: "Area", value: "60 m\u00B2" },
  { icon: MapPin, label: "Location", value: "[Your City]" },
  { icon: Shield, label: "System", value: "Preserved Moss Wall" },
  { icon: Calendar, label: "Install Year", value: "2026" },
];

const BOTTOM_STATS = [
  { icon: User, label: "Client", value: "[Your Client]" },
  { icon: Recycle, label: "Moss Coverage", value: "100%" },
  { icon: Sprout, label: "Plant Species", value: "Mixed preserved moss" },
];

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
              Project Name <span className="projectDetailStatsDot">&middot;</span>{" "}
              Artificial Tree Installations
            </h2>
            <span className="projectDetailStatsRule" aria-hidden="true" />
          </div>

          <p className="projectDetailStatsDescription">
            A thoughtfully crafted green installation that brings calm, character, and
            a natural sense of balance to modern spaces. Designed for lasting visual
            impact with effortless maintenance.
          </p>

          <div className="projectDetailStatsRow">
            {TOP_STATS.map((stat) => (
              <StatPill key={stat.label} {...stat} />
            ))}
          </div>

          <div className="projectDetailStatsRow projectDetailStatsRowSecondary">
            {BOTTOM_STATS.map((stat) => (
              <StatPill key={stat.label} {...stat} />
            ))}
          </div>
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