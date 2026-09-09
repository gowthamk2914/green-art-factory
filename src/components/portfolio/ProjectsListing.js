"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";
const SHUFFLE_INTERVAL_MS = 7000;

const GRID_PATTERN = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

function getCardSpan(index) {
  return GRID_PATTERN[index % GRID_PATTERN.length];
}

// Fisher–Yates shuffle — unbiased, doesn't mutate the input array.
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ==========================================================================
   Generic checkbox-dropdown shell — button trigger + popover panel that
   closes on outside click. Every filter (simple or product-tree) renders
   its options inside this.
   ========================================================================== */

function FilterDropdown({ label, count, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="projectsListingFilter" ref={ref}>
      <button
        type="button"
        className={`projectsListingFilterButton${count ? " isActive" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {label}
        {count > 0 && <span className="projectsListingFilterCount">{count}</span>}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path
            d="M1 1L5 5L9 1"
            stroke="#6B6B5F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="projectsListingFilterPanel">{children}</div>}
    </div>
  );
}

function CheckboxRow({ label, checked, indeterminate, onChange, indent }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  return (
    <label className={`projectsListingFilterOption${indent ? " isIndented" : ""}`}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="projectsListingFilterOptionInput"
      />
      <span>{label}</span>
    </label>
  );
}

function SimpleCheckFilter({ label, options, selected, onToggle }) {
  return (
    <FilterDropdown label={label} count={selected.length}>
      {options.length === 0 && (
        <p className="projectsListingFilterEmpty">No options available</p>
      )}
      {options.map((option) => (
        <CheckboxRow
          key={option.slug}
          label={option.name}
          checked={selected.includes(option.slug)}
          onChange={() => onToggle(option.slug)}
        />
      ))}
    </FilterDropdown>
  );
}

/* Product filter: parent checkbox toggles every variant underneath it in
   one go; parent shows indeterminate state when only some are checked. */
function ProductsFilter({ products, selectedVariantSlugs, onToggleVariant, onToggleProduct }) {
  return (
    <FilterDropdown label="Product" count={selectedVariantSlugs.length}>
      {products.length === 0 && (
        <p className="projectsListingFilterEmpty">No products available</p>
      )}
      {products.map((product) => {
        const variantSlugs = (product.variants ?? []).map((v) => v.slug);
        const selectedCount = variantSlugs.filter((s) =>
          selectedVariantSlugs.includes(s)
        ).length;
        const allChecked = variantSlugs.length > 0 && selectedCount === variantSlugs.length;
        const someChecked = selectedCount > 0 && !allChecked;

        return (
          <div key={product.slug} className="projectsListingProductGroup">
            <CheckboxRow
              label={product.name}
              checked={allChecked}
              indeterminate={someChecked}
              onChange={() => onToggleProduct(product)}
            />
            <div className="projectsListingVariantList">
              {(product.variants ?? []).map((variant) => (
                <CheckboxRow
                  key={variant.slug}
                  label={variant.name}
                  checked={selectedVariantSlugs.includes(variant.slug)}
                  onChange={() => onToggleVariant(variant.slug)}
                  indent
                />
              ))}
            </div>
          </div>
        );
      })}
    </FilterDropdown>
  );
}

function ActiveFilterChips({ chips, onClearAll }) {
  if (chips.length === 0) return null;

  return (
    <div className="projectsListingActiveFilters">
      {chips.map((chip) => (
        <span key={chip.key} className="projectsListingChip">
          {chip.label}
          <button
            type="button"
            className="projectsListingChipRemove"
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label} filter`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </span>
      ))}
      <button type="button" className="projectsListingChipClearAll" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}

// Card is now a motion.div grid item (handles layout animation on reorder)
// wrapping a plain Link that fills it. Grid spans move to the wrapper since
// that's the actual grid child now.
function ProjectCard({ project, index }) {
  const { colSpan, rowSpan } = getCardSpan(index);

  return (
    <motion.div
      layout
      key={project.slug ?? project.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        layout: { duration: 0.6, ease: "easeInOut" },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      }}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      className="projectsListingCardWrapper"
    >
      <Link href={project.cta_url} className="projectsListingCard">
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
          {project.meta_line && <p className="projectsListingMeta">{project.meta_line}</p>}
          {project.excerpt && (
            <p className="projectsListingDescription">{project.excerpt}</p>
          )}
          <span className="projectsListingViewBtn">
            View Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
    </motion.div>
  );
}

export default function ProjectsListing({ projects, filters, totalCount }) {
  const reduxData = useSelector((state) => state.Portfolio?.data);
  const reduxMeta = useSelector((state) => state.Portfolio?.meta);
  const searchParams = useSearchParams();

  const allProjects = projects ?? reduxData?.projects ?? [];
  const filterOptions = filters ?? reduxData?.filters ?? {
    categories: [],
    installation_types: [],
    locations: [],
    sectors: [],
    products: [],
  };

  const [search, setSearch] = useState("");
  const [categorySlugs, setCategorySlugs] = useState([]);
  const [installationTypeSlugs, setInstallationTypeSlugs] = useState([]);
  const [locationSlugs, setLocationSlugs] = useState([]);
  const [sectorSlugs, setSectorSlugs] = useState([]);
  const [selectedVariantSlugs, setSelectedVariantSlugs] = useState([]);

  // Pre-check the Product filter from the URL, e.g. a "View Project"
  // button on a product page links to
  // /portfolio?product=moss-creations&product_variant=moss-walls.
  useEffect(() => {
    const variantSlugFromUrl = searchParams.get("product_variant");
    const productSlugFromUrl = searchParams.get("product");

    if (variantSlugFromUrl) {
      setSelectedVariantSlugs((prev) =>
        prev.includes(variantSlugFromUrl) ? prev : [...prev, variantSlugFromUrl]
      );
      return;
    }

    if (productSlugFromUrl && filterOptions.products?.length) {
      const matchedProduct = filterOptions.products.find(
        (p) => p.slug === productSlugFromUrl
      );
      if (matchedProduct) {
        const variantSlugs = (matchedProduct.variants ?? []).map((v) => v.slug);
        setSelectedVariantSlugs((prev) => {
          const merged = new Set(prev);
          variantSlugs.forEach((s) => merged.add(s));
          return Array.from(merged);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterOptions.products]);

  function makeToggler(setter) {
    return (value) => {
      setter((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    };
  }

  const toggleCategory = makeToggler(setCategorySlugs);
  const toggleInstallationType = makeToggler(setInstallationTypeSlugs);
  const toggleLocation = makeToggler(setLocationSlugs);
  const toggleSector = makeToggler(setSectorSlugs);

  function toggleVariant(variantSlug) {
    setSelectedVariantSlugs((prev) =>
      prev.includes(variantSlug)
        ? prev.filter((v) => v !== variantSlug)
        : [...prev, variantSlug]
    );
  }

  function toggleProduct(product) {
    const variantSlugs = (product.variants ?? []).map((v) => v.slug);
    setSelectedVariantSlugs((prev) => {
      const allSelected = variantSlugs.every((s) => prev.includes(s));
      if (allSelected) {
        return prev.filter((s) => !variantSlugs.includes(s));
      }
      const merged = new Set(prev);
      variantSlugs.forEach((s) => merged.add(s));
      return Array.from(merged);
    });
  }

  const categoryNameBySlug = useMemo(
    () => Object.fromEntries(filterOptions.categories.map((o) => [o.slug, o.name])),
    [filterOptions.categories]
  );
  const installationTypeNameBySlug = useMemo(
    () => Object.fromEntries(filterOptions.installation_types.map((o) => [o.slug, o.name])),
    [filterOptions.installation_types]
  );
  const locationNameBySlug = useMemo(
    () => Object.fromEntries(filterOptions.locations.map((o) => [o.slug, o.name])),
    [filterOptions.locations]
  );
  const sectorNameBySlug = useMemo(
    () => Object.fromEntries(filterOptions.sectors.map((o) => [o.slug, o.name])),
    [filterOptions.sectors]
  );
  const variantNameBySlug = useMemo(() => {
    const map = {};
    (filterOptions.products ?? []).forEach((product) => {
      (product.variants ?? []).forEach((variant) => {
        map[variant.slug] = variant.name;
      });
    });
    return map;
  }, [filterOptions.products]);

  const chips = useMemo(() => {
    const list = [];
    categorySlugs.forEach((slug) =>
      list.push({
        key: `category-${slug}`,
        label: categoryNameBySlug[slug] ?? slug,
        onRemove: () => toggleCategory(slug),
      })
    );
    installationTypeSlugs.forEach((slug) =>
      list.push({
        key: `installation-${slug}`,
        label: installationTypeNameBySlug[slug] ?? slug,
        onRemove: () => toggleInstallationType(slug),
      })
    );
    locationSlugs.forEach((slug) =>
      list.push({
        key: `location-${slug}`,
        label: locationNameBySlug[slug] ?? slug,
        onRemove: () => toggleLocation(slug),
      })
    );
    sectorSlugs.forEach((slug) =>
      list.push({
        key: `sector-${slug}`,
        label: sectorNameBySlug[slug] ?? slug,
        onRemove: () => toggleSector(slug),
      })
    );
    selectedVariantSlugs.forEach((slug) =>
      list.push({
        key: `product-${slug}`,
        label: variantNameBySlug[slug] ?? slug,
        onRemove: () => toggleVariant(slug),
      })
    );
    return list;
  }, [
    categorySlugs,
    installationTypeSlugs,
    locationSlugs,
    sectorSlugs,
    selectedVariantSlugs,
    categoryNameBySlug,
    installationTypeNameBySlug,
    locationNameBySlug,
    sectorNameBySlug,
    variantNameBySlug,
  ]);

  const hasActiveFilters = Boolean(search) || chips.length > 0;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allProjects.filter((project) => {
      if (query && !project.title.toLowerCase().includes(query)) return false;

      if (categorySlugs.length && !categorySlugs.includes(project.category?.slug)) {
        return false;
      }

      if (
        installationTypeSlugs.length &&
        project.installation_type &&
        !installationTypeSlugs.includes(project.installation_type.slug)
      ) {
        return false;
      }

      if (locationSlugs.length && !locationSlugs.includes(project.location?.slug)) {
        return false;
      }

      if (
        sectorSlugs.length &&
        !(project.sectors ?? []).some((s) => sectorSlugs.includes(s.slug))
      ) {
        return false;
      }

      if (
        selectedVariantSlugs.length &&
        project.products &&
        !(project.products ?? []).some((p) => selectedVariantSlugs.includes(p.slug))
      ) {
        return false;
      }

      return true;
    });
  }, [
    allProjects,
    search,
    categorySlugs,
    installationTypeSlugs,
    locationSlugs,
    sectorSlugs,
    selectedVariantSlugs,
  ]);

  // ------------------------------------------------------------------------
  // Shuffle logic: re-order the visible cards on every mount/filter change
  // and again every SHUFFLE_INTERVAL_MS, with framer-motion's `layout`
  // animating each card smoothly from its old grid slot to its new one.
  //
  // - `filteredProjects` changing (search/filters) re-shuffles immediately.
  // - A ref always tracks the *current* filtered list so the interval
  //   timer (set up once) shuffles fresh data instead of a stale closure.
  // ------------------------------------------------------------------------
  const [displayProjects, setDisplayProjects] = useState([]);
  const filteredProjectsRef = useRef(filteredProjects);

  useEffect(() => {
    filteredProjectsRef.current = filteredProjects;
    setDisplayProjects(shuffleArray(filteredProjects));
  }, [filteredProjects]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayProjects(shuffleArray(filteredProjectsRef.current));
    }, SHUFFLE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  function handleReset() {
    setSearch("");
    setCategorySlugs([]);
    setInstallationTypeSlugs([]);
    setLocationSlugs([]);
    setSectorSlugs([]);
    setSelectedVariantSlugs([]);
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

          <SimpleCheckFilter
            label="Project Type"
            options={filterOptions.categories}
            selected={categorySlugs}
            onToggle={toggleCategory}
          />
          <SimpleCheckFilter
            label="Installation Type"
            options={filterOptions.installation_types}
            selected={installationTypeSlugs}
            onToggle={toggleInstallationType}
          />
          <SimpleCheckFilter
            label="Location"
            options={filterOptions.locations}
            selected={locationSlugs}
            onToggle={toggleLocation}
          />
          <SimpleCheckFilter
            label="Sector"
            options={filterOptions.sectors}
            selected={sectorSlugs}
            onToggle={toggleSector}
          />
          <ProductsFilter
            products={filterOptions.products ?? []}
            selectedVariantSlugs={selectedVariantSlugs}
            onToggleVariant={toggleVariant}
            onToggleProduct={toggleProduct}
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

        <ActiveFilterChips chips={chips} onClearAll={handleReset} />

        <p className="projectsListingCount">
          Total projects ({filteredProjects.length})
        </p>

        <div className="projectsListingMasonry">
          <AnimatePresence mode="popLayout">
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={project.slug ?? project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {displayProjects.length === 0 && (
          <p className="projectsListingEmpty">No projects match those filters yet.</p>
        )}
      </div>
    </section>
  );
}