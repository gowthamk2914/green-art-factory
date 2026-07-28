"use client";

import { useState } from "react";
import Image from "next/image";

const FILTERS = [
  { id: "category", label: "Category", options: ["All", "Residential", "Commercial", "Hospitality"] },
  { id: "filters", label: "Filters", options: ["Newest", "Popular", "Featured"] },
  { id: "location", label: "Location", options: ["All Locations", "Indoor", "Outdoor", "Rooftop"] },
  { id: "region", label: "Region", options: ["All Regions", "North", "South", "East", "West"] },
];

// Sample data — replace with projects fetched from your API. `aspect`
// controls each card's height so the grid staggers like Pinterest;
// swap it for the image's real natural width/height once that's wired
// up (see PortfolioBanner-adjacent components for that pattern).
const PROJECTS = [
  { id: 1, number: 1, title: "Indoor Landscape", image: "/images/project-1.jpg", aspect: "4 / 3", href: "/projects/indoor-landscape" },
  { id: 2, number: 2, title: "Green Wall Installations", image: "/images/project-2.jpg", aspect: "1 / 1", href: "/projects/green-wall-installations" },
  { id: 3, number: 3, title: "Interior Greenery Plant Design", image: "/images/project-3.jpg", aspect: "3 / 2", href: "/projects/interior-greenery-plant-design" },
  { id: 4, number: 4, title: "Botanical Installation", image: "/images/project-4.jpg", aspect: "5 / 6", href: "/projects/botanical-installation" },
  { id: 5, number: 5, title: "Living Wall Lounge", image: "/images/project-1.jpg", aspect: "16 / 10", href: "/projects/living-wall-lounge" },
  { id: 6, number: 6, title: "Preserved Moss Feature", image: "/images/project-2.jpg", aspect: "4 / 3", href: "/projects/preserved-moss-feature" },
  { id: 7, number: 7, title: "Rooftop Garden Design", image: "/images/project-3.jpg", aspect: "5 / 4", href: "/projects/rooftop-garden-design" },
  { id: 8, number: 8, title: "Corporate Biophilic Office", image: "/images/project-4.jpg", aspect: "1 / 1", href: "/projects/corporate-biophilic-office" },
];

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterDropdown({ filter, isOpen, onToggle, selected, onSelect }) {
  return (
    <div className="plg-filter-wrap">
      <button
        type="button"
        className={`plg-pill plg-pill-filter ${isOpen ? "plg-pill-filter-open" : ""}`}
        onClick={() => onToggle(filter.id)}
      >
        <span>{selected || filter.label}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <div className="plg-filter-menu">
          {filter.options.map((option) => (
            <button
              key={option}
              type="button"
              className="plg-filter-menu-item"
              onClick={() => onSelect(filter.id, option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortfolioListingGrid({ heading = "All Projects", projects = PROJECTS }) {
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleToggle = (id) => {
    setOpenFilter((current) => (current === id ? null : id));
  };

  const handleSelect = (id, value) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: value }));
    setOpenFilter(null);
  };

  const handleReset = () => {
    setQuery("");
    setSelectedFilters({});
    setOpenFilter(null);
  };

  return (
    <section className="plg-section">
      <div className="plg-container">
        <div className="plg-filterbar">
          <label className="plg-pill plg-pill-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="plg-search-input"
            />
          </label>

          {FILTERS.map((filter) => (
            <FilterDropdown
              key={filter.id}
              filter={filter}
              isOpen={openFilter === filter.id}
              onToggle={handleToggle}
              selected={selectedFilters[filter.id]}
              onSelect={handleSelect}
            />
          ))}

          <button type="button" className="plg-pill plg-pill-reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        <h2 className="plg-heading">{heading}</h2>

        <div className="plg-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const { number, title, image, aspect, href } = project;

  return (
    <a href={href} className="plg-card" style={{ aspectRatio: aspect }}>
      <Image src={image} alt={title} fill className="plg-card-image" />
      <div className="plg-card-scrim" aria-hidden="true" />

      <div className="plg-card-footer">
        <span className="plg-card-title">
          {number}. {title}
        </span>

        <span className="plg-card-cta">
          <span>View Now</span>
          <span className="plg-card-cta-icon">
            <ArrowIcon />
          </span>
        </span>
      </div>
    </a>
  );
}