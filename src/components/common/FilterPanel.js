"use client";

import { useEffect, useMemo, useState } from "react";
import { IoClose, IoCheckmark } from "react-icons/io5";

const FILTERS_API = "https://mindmadeitech.com/gaf2/public/api/filters";

/* ---------- small building blocks ---------- */

function SectionTitle({ children }) {
  return (
    <h3 className="mb-5 border-b border-white/15 pb-3 text-[15px] font-semibold uppercase tracking-wide text-white filter-section-title">
      {children}
    </h3>
  );
}

function Checkbox({ label, checked, onChange, bold, indented }) {
  return (
    <label
      className={`group flex cursor-pointer items-center gap-3 py-1.5 text-[14px] text-white/80 transition-colors hover:text-white ${
        indented ? "pl-2" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`flex h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
          checked
            ? "border-[#7A8C2F] bg-[#7A8C2F]"
            : "border-white/35 bg-transparent group-hover:border-white/60"
        }`}
      >
        {checked && <IoCheckmark size={13} className="text-white" />}
      </span>
      <span className={bold ? "font-medium text-white" : ""}>{label}</span>
    </label>
  );
}

/* Simple "All + list" group used for Installation Types, Locations, Sectors */
function SimpleFilterGroup({ title, items, selected, onToggle, onToggleAll }) {
  const allChecked = items.length > 0 && selected.size === items.length;

  return (
    <div className="rounded-2xl bg-white/[0.04] p-6">
      <SectionTitle>{title}</SectionTitle>
      <Checkbox label="All" checked={allChecked} onChange={onToggleAll} bold />
      <div className="mt-1 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            label={item.name}
            checked={selected.has(item.id)}
            onChange={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* Product Types group: checking a product selects (and reveals) all of
   its variants; checking every variant ticks the product back on;
   clearing every variant unticks it and the variant list folds away. */
function ProductFilterGroup({
  products,
  selectedProducts,
  selectedVariants,
  onToggleProduct,
  onToggleAllProducts,
  onToggleVariant,
}) {
  const allChecked =
    products.length > 0 && selectedProducts.size === products.length;

  return (
    <div className="rounded-2xl bg-white/[0.04] p-6">
      <SectionTitle>Product Types</SectionTitle>
      <Checkbox label="All" checked={allChecked} onChange={onToggleAllProducts} bold />

      <div className="mt-1 max-h-64 overflow-y-auto pr-1">
        {products.map((product) => {
          const variantIds = (product.variants ?? []).map((v) => v.id);
          const selectedCount = variantIds.filter((id) =>
            selectedVariants.has(id)
          ).length;
          const isChecked = variantIds.length
            ? selectedCount === variantIds.length
            : selectedProducts.has(product.id);
          const isExpanded = selectedCount > 0;

          return (
            <div key={product.id}>
              <Checkbox
                label={product.name}
                checked={isChecked}
                onChange={() => onToggleProduct(product)}
              />

              {isExpanded && (
                <div className="mb-2 ml-2 max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-black/20 px-3 py-1">
                  {product.variants.map((variant) => (
                    <Checkbox
                      key={variant.id}
                      label={variant.name}
                      checked={selectedVariants.has(variant.id)}
                      onChange={() => onToggleVariant(product, variant.id)}
                      indented
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- helpers for toggling id sets ---------- */

function toggleId(set, id) {
  const next = new Set(set);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
}

function toggleAll(set, items) {
  return set.size === items.length ? new Set() : new Set(items.map((i) => i.id));
}

/* ---------- main component ---------- */

export default function FilterPanel({ isOpen, onClose, onApply }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready

  const [installationTypes, setInstallationTypes] = useState(new Set());
  const [locations, setLocations] = useState(new Set());
  const [sectors, setSectors] = useState(new Set());
  const [products, setProducts] = useState(new Set());
  const [variants, setVariants] = useState(new Set());

  /* fetch once, the first time the panel is opened */
  useEffect(() => {
    if (!isOpen || data || status === "loading") return;

    setStatus("loading");
    fetch(FILTERS_API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load filters");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isOpen, data, status]);

  /* lock page scroll while the overlay is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const resetAll = () => {
    setInstallationTypes(new Set());
    setLocations(new Set());
    setSectors(new Set());
    setProducts(new Set());
    setVariants(new Set());
  };

  /* checking a product selects/deselects every one of its variants;
     products without variants just toggle themselves directly */
  const handleToggleProduct = (product) => {
    const variantIds = (product.variants ?? []).map((v) => v.id);

    if (!variantIds.length) {
      setProducts((s) => toggleId(s, product.id));
      return;
    }

    const allSelected = variantIds.every((id) => variants.has(id));

    setVariants((s) => {
      const next = new Set(s);
      variantIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });

    setProducts((s) => {
      const next = new Set(s);
      allSelected ? next.delete(product.id) : next.add(product.id);
      return next;
    });
  };

  /* checking a variant keeps the parent product's ticked state in sync:
     ticks it on once every variant is checked, off the moment any isn't */
  const handleToggleVariant = (product, variantId) => {
    setVariants((s) => {
      const next = toggleId(s, variantId);
      const variantIds = (product.variants ?? []).map((v) => v.id);
      const allSelected = variantIds.every((id) => next.has(id));

      setProducts((p) => {
        const nextProducts = new Set(p);
        allSelected ? nextProducts.add(product.id) : nextProducts.delete(product.id);
        return nextProducts;
      });

      return next;
    });
  };

  /* "All" for Product Types must select every product AND every one of
     its variants (mirrors what clicking a single product row does) */
  const handleToggleAllProducts = () => {
    const allProducts = data?.products ?? [];

    const isProductFullyChecked = (product) => {
      const variantIds = (product.variants ?? []).map((v) => v.id);
      return variantIds.length
        ? variantIds.every((id) => variants.has(id))
        : products.has(product.id);
    };

    const everythingChecked =
      allProducts.length > 0 && allProducts.every(isProductFullyChecked);

    if (everythingChecked) {
      setProducts(new Set());
      setVariants(new Set());
    } else {
      setProducts(new Set(allProducts.map((p) => p.id)));
      setVariants(
        new Set(allProducts.flatMap((p) => (p.variants ?? []).map((v) => v.id)))
      );
    }
  };

  const handleApply = () => {
    onApply?.({
      installationTypes: [...installationTypes],
      locations: [...locations],
      sectors: [...sectors],
      products: [...products],
      variants: [...variants],
    });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-panel fixed inset-0 flex flex-col bg-[#0d1a08]/97 text-white backdrop-blur-sm">
      {/* header */}
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Portfolio Filters
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <IoClose size={18} />
        </button>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        {/* {status === "loading" && <p className="text-white/70">Loading filters…</p>}

        {status === "error" && (
          <p className="text-red-300">
            Couldn&rsquo;t load filters right now. Please try again.
          </p>
        )} */}

        {status === "ready" && data && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SimpleFilterGroup
              title="Installation Types"
              items={data.installation_types ?? []}
              selected={installationTypes}
              onToggle={(id) => setInstallationTypes((s) => toggleId(s, id))}
              onToggleAll={() =>
                setInstallationTypes((s) => toggleAll(s, data.installation_types ?? []))
              }
            />

            <SimpleFilterGroup
              title="Locations"
              items={data.locations ?? []}
              selected={locations}
              onToggle={(id) => setLocations((s) => toggleId(s, id))}
              onToggleAll={() => setLocations((s) => toggleAll(s, data.locations ?? []))}
            />

            <ProductFilterGroup
              products={data.products ?? []}
              selectedProducts={products}
              selectedVariants={variants}
              onToggleProduct={handleToggleProduct}
              onToggleAllProducts={handleToggleAllProducts}
              onToggleVariant={handleToggleVariant}
            />

            <SimpleFilterGroup
              title="Sectors"
              items={data.sectors ?? []}
              selected={sectors}
              onToggle={(id) => setSectors((s) => toggleId(s, id))}
              onToggleAll={() => setSectors((s) => toggleAll(s, data.sectors ?? []))}
            />
          </div>
        )}
      </div>

      {/* footer actions */}
      {status === "ready" && (
        <div className="flex items-center justify-end gap-3 border-t border-white/15 px-6 py-4 md:px-10">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-full bg-[#7A8C2F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8b9f36]"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}