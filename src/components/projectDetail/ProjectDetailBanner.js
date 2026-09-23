"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_HERO_IMAGE = "/images/default-project-detail-banner.png";

function Breadcrumb({ items }) {
  return (
    <nav className="projectDetailHeroBreadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.label} className="projectDetailHeroBreadcrumbItem">
            {isLast || !item.href ? (
              <span
                className={`projectDetailHeroCrumb${isLast ? " isCurrent" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="projectDetailHeroCrumb">
                {item.label}
              </Link>
            )}
            {!isLast && <span className="projectDetailHeroCrumbSep">&gt;</span>}
          </span>
        );
      })}
    </nav>
  );
}

export default function ProjectHero() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The parent page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  // API returns breadcrumb items as { label, url }; the Breadcrumb
  // component expects { label, href }.
  const breadcrumbItems = (project.breadcrumb ?? []).map((item) => ({
    label: item.label,
    href: item.url,
  }));

  return (
    <section className="projectDetailHeroSection" aria-label="Project banner">
      <div className="projectDetailHeroMedia">
        <Image
          src={project.hero_image || FALLBACK_HERO_IMAGE}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="projectDetailHeroImage"
        />
      </div>

      <div className="projectDetailHeroOverlayPanel">
        <h1 className="projectDetailHeroTitle">{project.title}</h1>
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </section>
  );
}