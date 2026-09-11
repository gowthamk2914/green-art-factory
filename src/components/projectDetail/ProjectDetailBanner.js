"use client";

import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "/images/default-project-detail-banner.png";

const HERO_TITLE = "ARTIFICIAL TREE INSTALLATION";

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Interior Projects", href: "/portfolio?category=interior-projects" },
  { label: "Artificial tree installation", href: null },
];

function Breadcrumb() {
  return (
    <nav className="projectDetailHeroBreadcrumb" aria-label="Breadcrumb">
      {BREADCRUMB_ITEMS.map((item, index) => {
        const isLast = index === BREADCRUMB_ITEMS.length - 1;

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
  return (
    <section className="projectDetailHeroSection" aria-label="Project banner">
      <div className="projectDetailHeroMedia">
        <Image
          src={HERO_IMAGE}
          alt={HERO_TITLE}
          fill
          priority
          sizes="100vw"
          className="projectDetailHeroImage"
        />
      </div>

      <div className="projectDetailHeroOverlayPanel">
        <h1 className="projectDetailHeroTitle">{HERO_TITLE}</h1>
        <Breadcrumb />
      </div>
    </section>
  );
}