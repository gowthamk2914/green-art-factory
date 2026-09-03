"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";


/**
 * Static placeholder data for now. Field names are kept generic
 * (slug, title, description, image, aspect, projectUrl, filters) so this
 * same shape can later be swapped for data fetched from an API — at that
 * point the filter dropdowns and search below can stay as-is and just
 * drive a query instead of an in-memory .filter().
 *
 * `aspect` controls each card's height in the masonry layout (portrait,
 * square, landscape) — vary it per project the way a real photo set would.
 */
const DEFAULT_PROJECTS = [
  {
    slug: "artificial-tree-installation",
    title: "Artificial Tree Installation",
    sector: "Commercial",
    location: "Dubai, UAE",
    projectType: "Interior Projects",
    installationType: "Indoor",
    description:
      "Preserved moss walls bring nature indoors with a timeless, maintenance-free aesthetic. They enhance interiors with rich texture, acoustic comfort, and biophilic appeal.",
    image: "/images/projects/artificial-tree-installation.jpg",
    aspect: "4 / 3",
    projectUrl: "/projects/artificial-tree-installation",
  },
  {
    slug: "world-map-moss-wall-1",
    title: "World Map Moss Wall",
    sector: "Commercial",
    location: "Abu Dhabi, UAE",
    projectType: "Interior Projects",
    installationType: "Indoor",
    description:
      "A custom moss world map installed as a striking reception feature, blending geography and greenery into one talking-point wall.",
    image: "/images/projects/world-map-moss-wall-1.jpg",
    aspect: "1 / 1",
    projectUrl: "/projects/world-map-moss-wall-1",
  },
  {
    slug: "greenart-factory-logo-1",
    title: "GreenArt Factory Logo",
    sector: "Commercial",
    location: "Dubai, UAE",
    projectType: "Special Projects",
    installationType: "Indoor",
    description:
      "A branded moss logo wall custom-designed to complement the architecture and spatial identity of the reception area.",
    image: "/images/projects/greenart-factory-logo-1.jpg",
    aspect: "3 / 4",
    projectUrl: "/projects/greenart-factory-logo-1",
  },
  {
    slug: "greenhouse-corridor-1",
    title: "Greenhouse Corridor",
    sector: "Beachside",
    location: "Abu Dhabi, UAE",
    projectType: "Exterior Projects",
    installationType: "Outdoor",
    description:
      "A living plant corridor designed for a beachside hospitality venue, creating an immersive walk-through garden experience.",
    image: "/images/projects/greenhouse-corridor-1.jpg",
    aspect: "3 / 4",
    projectUrl: "/projects/greenhouse-corridor-1",
  },
  {
    slug: "greenart-factory-logo-2",
    title: "GreenArt Factory Logo — Feature Wall",
    sector: "Commercial",
    location: "Dubai, UAE",
    projectType: "Special Projects",
    installationType: "Indoor",
    description:
      "A large-format version of the branded moss logo, installed as the centerpiece of a corporate lobby.",
    image: "/images/projects/greenart-factory-logo-2.jpg",
    aspect: "1 / 1",
    projectUrl: "/projects/greenart-factory-logo-2",
  },
  {
    slug: "world-map-moss-wall-2",
    title: "World Map Moss Wall — Lobby Edition",
    sector: "Commercial",
    location: "Abu Dhabi, UAE",
    projectType: "Interior Projects",
    installationType: "Indoor",
    description:
      "A second world map installation, custom-fitted to a narrower lobby wall while keeping every continent legible.",
    image: "/images/projects/world-map-moss-wall-2.jpg",
    aspect: "4 / 3",
    projectUrl: "/projects/world-map-moss-wall-2",
  },
  {
    slug: "moss-globe-frame",
    title: "Moss Globe Frame",
    sector: "Commercial",
    location: "Dubai, UAE",
    projectType: "Special Projects",
    installationType: "Indoor",
    description:
      "A circular framed moss and fern composition, designed as standalone wall art for a boutique office space.",
    image: "/images/projects/moss-globe-frame.jpg",
    aspect: "1 / 1",
    projectUrl: "/projects/moss-globe-frame",
  },
  {
    slug: "greenhouse-corridor-2",
    title: "Greenhouse Corridor — Entrance",
    sector: "Beachside",
    location: "Abu Dhabi, UAE",
    projectType: "Exterior Projects",
    installationType: "Outdoor",
    description:
      "The entrance stretch of a beachside greenhouse corridor, lined with potted cacti and seasonal planting.",
    image: "/images/projects/greenhouse-corridor-2.jpg",
    aspect: "3 / 4",
    projectUrl: "/projects/greenhouse-corridor-2",
  },
];

const PROJECT_TYPES = ["Exterior Projects", "Interior Projects", "Special Projects"];
const INSTALLATION_TYPES = ["Indoor", "Outdoor"];
const LOCATIONS = ["Abu Dhabi, UAE", "Dubai, UAE"];
const SECTORS = ["Beachside", "Commercial"];

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="projectsListingFilter">
      <select
        className="projectsListingFilterSelect"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      href={project.projectUrl}
      className="projectsListingCard"
      style={{ aspectRatio: project.aspect }}
    >
      <Image
        src={project.image || FALLBACK_IMAGE}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        className="projectsListingImage"
      />

      <div className="projectsListingOverlay" />

      <div className="projectsListingCaption">
        <h3 className="projectsListingTitle">{project.title}</h3>
        <p className="projectsListingMeta">
          {[project.sector, project.location].filter(Boolean).join(" • ")}
        </p>
        <p className="projectsListingDescription">{project.description}</p>
        <span className="projectsListingViewBtn">
          View Project
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 11L11 3M11 3H4.5M11 3V9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ProjectsListing({
  projects = DEFAULT_PROJECTS,
  totalCount,
}) {
  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState("");
  const [installationType, setInstallationType] = useState("");
  const [location, setLocation] = useState("");
  const [sector, setSector] = useState("");

  const hasActiveFilters =
    search || projectType || installationType || location || sector;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      if (query && !project.title.toLowerCase().includes(query)) return false;
      if (projectType && project.projectType !== projectType) return false;
      if (installationType && project.installationType !== installationType)
        return false;
      if (location && project.location !== location) return false;
      if (sector && project.sector !== sector) return false;
      return true;
    });
  }, [projects, search, projectType, installationType, location, sector]);

  function handleReset() {
    setSearch("");
    setProjectType("");
    setInstallationType("");
    setLocation("");
    setSector("");
  }

  return (
    <section className="projectsListingSection" aria-label="Projects">
      <div className="projectsListingInner">
        <div className="projectsListingToolbar">
          <div className="projectsListingSearch">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="projectsListingSearchIcon"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M11 11L14.5 14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="projectsListingSearchInput"
            />
          </div>

          <FilterSelect
            label="Project Type"
            value={projectType}
            onChange={setProjectType}
            options={PROJECT_TYPES}
          />
          <FilterSelect
            label="Installation Type"
            value={installationType}
            onChange={setInstallationType}
            options={INSTALLATION_TYPES}
          />
          <FilterSelect
            label="Location"
            value={location}
            onChange={setLocation}
            options={LOCATIONS}
          />
          <FilterSelect
            label="Sector"
            value={sector}
            onChange={setSector}
            options={SECTORS}
          />

          <button
            type="button"
            className="projectsListingReset"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            Reset
          </button>
        </div>

        <p className="projectsListingCount">
          Total projects ({totalCount ?? filteredProjects.length})
        </p>

        <div className="projectsListingMasonry">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="projectsListingEmpty">
            No projects match those filters yet.
          </p>
        )}
      </div>
    </section>
  );
}