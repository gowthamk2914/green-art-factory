"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";

const TOP_RIGHT_IMAGE = "/images/project-detail-stat-section-img-1.png";
const BOTTOM_LEFT_IMAGE = "/images/project-detail-stat-section-img-2.png";

const PRIMARY_ROW_SIZE = 4;

function Breadcrumb({ items }) {
  return (
    <nav className="projectDetailStatsBreadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={`${item.label}-${index}`}
            className="projectDetailStatsBreadcrumbItem"
          >
            {isLast || !item.href ? (
              <span
                className={`projectDetailStatsCrumb${isLast ? " isCurrent" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="projectDetailStatsCrumb">
                {item.label}
              </Link>
            )}
            {!isLast && (
              <span className="projectDetailStatsCrumbSep" aria-hidden="true">
                &gt;
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="projectDetailStatPill">
      <span className="projectDetailStatIcon">
        {/* Same icon for every label, since labels come from the dashboard */}
        <Leaf size={18} strokeWidth={1.8} />
      </span>
      <span className="projectDetailStatText">
        <span className="projectDetailStatLabel">{label}</span>
        <span className="projectDetailStatValue">{value}</span>
      </span>
    </div>
  );
}

export default function ProjectDetailStats() {
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  const overview = project.project_overview ?? {};

  // API returns breadcrumb items as { label, url }; the Breadcrumb
  // component expects { label, href }.
  const breadcrumbItems = (project.breadcrumb ?? []).map((item) => ({
    label: item.label,
    href: item.url,
  }));
  const hasBreadcrumb = breadcrumbItems.length > 0;

  // Normalise API data: trim description, drop incomplete spec rows
  const description =
    typeof overview.description === "string" ? overview.description.trim() : "";

  const specifications = (
    Array.isArray(overview.specifications) ? overview.specifications : []
  ).filter(
    (spec) =>
      spec &&
      String(spec.label ?? "").trim() !== "" &&
      String(spec.value ?? "").trim() !== ""
  );

  const hasDescription = description.length > 0;
  const hasSpecifications = specifications.length > 0;
  const hasCardContent = hasDescription || hasSpecifications;

  // Hide the whole section only when there is nothing at all to show.
  // The breadcrumb is navigation, so it still renders on its own
  // when the project has no description or specifications.
  if (!hasCardContent && !hasBreadcrumb) return null;

  const primaryStats = specifications.slice(0, PRIMARY_ROW_SIZE);
  const secondaryStats = specifications.slice(PRIMARY_ROW_SIZE);

  return (
    <section className="projectDetailStatsSection" aria-label="Project overview">
      {/* Breadcrumb: inside the section, outside (above) the card */}
      {hasBreadcrumb && (
        <div className="projectDetailStatsBreadcrumbWrap">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}

      {hasCardContent && (
        <div className="projectDetailStatsCard">
          <Image
            src={BOTTOM_LEFT_IMAGE}
            alt="bottom left decorative image"
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

            {hasDescription && (
              <p className="projectDetailStatsDescription">{description}</p>
            )}

            {primaryStats.length > 0 && (
              <div className="projectDetailStatsRow">
                {primaryStats.map((stat, i) => (
                  <StatPill
                    key={`${stat.label}-${i}`}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </div>
            )}

            {secondaryStats.length > 0 && (
              <div className="projectDetailStatsRow projectDetailStatsRowSecondary">
                {secondaryStats.map((stat, i) => (
                  <StatPill
                    key={`${stat.label}-${i + PRIMARY_ROW_SIZE}`}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="projectDetailStatsMedia">
            <Image
              src={TOP_RIGHT_IMAGE}
              alt="top right decorative image"
              fill
              sizes="(max-width: 900px) 0px, 320px"
              className="projectDetailStatsMediaImage"
            />
          </div>
        </div>
      )}
    </section>
  );
}