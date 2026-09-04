"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

/**
 * The repeating Pinterest-style rhythm: one big 2×2 tile, three normal
 * tiles, one tall 1×2 tile, three more normal tiles — 8 slots total.
 *
 * Cards are placed with `grid-auto-flow: row dense`, so the browser packs
 * each one into the next open slot automatically. Combined with cycling
 * this array by `index % GRID_PATTERN.length`, the same rhythm repeats
 * indefinitely as more projects arrive from the API / dashboard later —
 * no manual placement ever needed.
 */
const GRID_PATTERN = [
  { colSpan: 2, rowSpan: 2 }, // big square
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 }, // tall
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

function getCardSpan(index) {
  return GRID_PATTERN[index % GRID_PATTERN.length];
}

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
          <option key={option.slug} value={option.slug}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { colSpan, rowSpan } = getCardSpan(index);

  return (
    <Link
      href={project.cta_url}
      className="projectsListingCard"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <Image
        src={project.cover_image || FALLBACK_IMAGE}
        alt={project.title}
        fill
        sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
        className="projectsListingImage"
      />

      <div className="projectsListingOverlay" />

      <div className="projectsListingCaption">
        <h3 className="projectsListingTitle">{project.title}</h3>
        {project.meta_line && (
          <p className="projectsListingMeta">{project.meta_line}</p>
        )}
        {project.excerpt && (
          <p className="projectsListingDescription">{project.excerpt}</p>
        )}
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

export default function ProjectsListing({ projects, filters, totalCount }) {
  // Same fallback chain used across the other sections: explicit prop >
  // Redux store (shared Portfolio slice) > empty array, so this
  // section never crashes on `.map` before the API has responded.
  const reduxData = useSelector((state) => state.Portfolio?.data);
  const reduxMeta = useSelector((state) => state.Portfolio?.meta);

  const allProjects = projects ?? reduxData?.projects ?? [];
  const filterOptions = filters ?? reduxData?.filters ?? {
    categories: [],
    installation_types: [],
    locations: [],
    sectors: [],
  };

  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [installationTypeSlug, setInstallationTypeSlug] = useState("");
  const [locationSlug, setLocationSlug] = useState("");
  const [sectorSlug, setSectorSlug] = useState("");

  const hasActiveFilters =
    search || categorySlug || installationTypeSlug || locationSlug || sectorSlug;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allProjects.filter((project) => {
      if (query && !project.title.toLowerCase().includes(query)) return false;

      if (categorySlug && project.category?.slug !== categorySlug) return false;

      // NOTE: individual projects in the current API response don't carry
      // an `installation_type` field yet (only `filters.installation_types`
      // exists, for populating the dropdown). Until the backend attaches
      // it per-project, this filter is a no-op pass-through rather than
      // excluding every project — remove this guard once the field ships.
      if (
        installationTypeSlug &&
        project.installation_type &&
        project.installation_type.slug !== installationTypeSlug
      ) {
        return false;
      }

      if (locationSlug && project.location?.slug !== locationSlug) return false;

      if (
        sectorSlug &&
        !(project.sectors ?? []).some((s) => s.slug === sectorSlug)
      ) {
        return false;
      }

      return true;
    });
  }, [allProjects, search, categorySlug, installationTypeSlug, locationSlug, sectorSlug]);

  function handleReset() {
    setSearch("");
    setCategorySlug("");
    setInstallationTypeSlug("");
    setLocationSlug("");
    setSectorSlug("");
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
            value={categorySlug}
            onChange={setCategorySlug}
            options={filterOptions.categories}
          />
          <FilterSelect
            label="Installation Type"
            value={installationTypeSlug}
            onChange={setInstallationTypeSlug}
            options={filterOptions.installation_types}
          />
          <FilterSelect
            label="Location"
            value={locationSlug}
            onChange={setLocationSlug}
            options={filterOptions.locations}
          />
          <FilterSelect
            label="Sector"
            value={sectorSlug}
            onChange={setSectorSlug}
            options={filterOptions.sectors}
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
          Total projects ({totalCount ?? reduxMeta?.total ?? filteredProjects.length})
        </p>

        <div className="projectsListingMasonry">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug ?? project.id} project={project} index={index} />
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