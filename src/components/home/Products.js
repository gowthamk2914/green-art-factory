"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getProductsPreviewRequest } from "../../redux/Products/actions";

gsap.registerPlugin(ScrollTrigger); // register once, at module scope

// Max images per category card: 1 featured + 4 in the right-hand grid.
// When more variants are added in the dashboard, only the latest 5 are shown.
const MAX_IMAGES = 5;

// Skeleton mirrors the real card heights/grid so the page height barely
// shifts once real data + images arrive — this is what keeps ScrollTrigger
// from having to correct a large layout jump.
const ProductSkeleton = () => (
  <div className="product-stack-item" style={{ top: "120px" }}>
    <div className="product-grid-control-wrapper">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 product-grid-wrapper">
        <div className="h-[420px] rounded-xl bg-gray-200 animate-pulse" />
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[202px] rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Builds /gallery/:productSlug/:variantSlug for a variant's link.
// The API's variant.cta_url is currently always null, so this constructs
// the route directly from the parent category's slug + the variant's own
// slug rather than relying on a per-variant URL from the backend.
function buildGalleryUrl(categorySlug, variantSlug) {
  if (!categorySlug || !variantSlug) return "#";
  return `/gallery/${categorySlug}/${variantSlug}`;
}

// Returns the latest MAX_IMAGES variants of a category, newest first.
// Assumes a higher id = more recently added. If your API exposes a timestamp,
// sort by it instead: new Date(b.created_at) - new Date(a.created_at)
function getLatestVariants(category) {
  return (category.variants || [])
    .slice() // copy first, redux state can be frozen/immutable
    .sort((a, b) => b.id - a.id) // newest first
    .slice(0, MAX_IMAGES);
}

// Returns the grid template classes for the "remaining products" panel
// based on how many remaining items there actually are (1-4), so the
// panel always fills the available h-[420px] space with no blank cells.
function getRightGridClass(count) {
  switch (count) {
    case 1:
      return "grid grid-cols-1 grid-rows-1 gap-4 h-[420px]";
    case 2:
      return "grid grid-cols-2 grid-rows-1 gap-4 h-[420px]";
    case 3:
    case 4:
    default:
      return "grid grid-cols-2 grid-rows-2 gap-4 h-[420px]";
  }
}

// For exactly 3 remaining items, the first one spans both rows (bento-style)
// so all 3 fill the 2x2 area with no empty fourth cell. 1/2/4 need no span.
function getItemSpanClass(count, index) {
  if (count === 3 && index === 0) return "row-span-2";
  return "";
}

// One clickable image card, used for both the featured image and the small
// grid images. The WHOLE card is a single link: an invisible <Link> is
// stretched over the card (absolute inset-0), so tapping the image, the
// gradient or the name bar all redirect to the gallery page.
//
// - The name bar has pointer-events-none, so clicks pass through it to the
//   link underneath.
// - "Explore" is a <span> styled like the old button. A <button> inside a
//   <Link> is invalid HTML and creates two tab stops; one link is cleaner.
// - Hover styles on the pill use group-hover, so it still highlights when
//   the pointer is anywhere on the card.
function ProductImageCard({
  href,
  image,
  name,
  priority = false,
  featured = false,
  className = "",
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${className}`}
    >
      <Image
        src={image}
        alt={name}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay on the image */}
      {featured ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
      ) : (
        <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/30"></div>
      )}

      {/* The click target: covers the entire card */}
      <Link
        href={href}
        aria-label={`Explore ${name}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66711E]"
      />

      {/* Name bar: sits above the image but lets clicks fall through */}
      <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-md px-3 py-2 transition-all duration-500 group-hover:bg-white/90">
        <span
          className={`text-sm font-medium ${
            featured ? "featured-big-product-name" : "featured-product-name"
          }`}
        >
          {name}
        </span>
        <span
          className={`rounded-full bg-white text-[11px] transition-all duration-300 group-hover:bg-[#66711E] group-hover:text-white ${
            featured
              ? "px-5 py-2 group-hover:shadow-2xl"
              : "px-3 py-1"
          }`}
        >
          Explore
        </span>
      </div>
    </div>
  );
}

const Products = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { loading, data: products, error } = useSelector(
    (state) => state.Products
  );

  const sortedProducts = products?.slice().sort((a, b) => a.id - b.id);

  useEffect(() => {
    dispatch(getProductsPreviewRequest());
  }, [dispatch]);

  useEffect(() => {
    if (
      loading ||
      !sortedProducts?.length ||
      !containerRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      // No matchMedia gate — the fade/slide-up entrance animation is
      // independent of the sticky-stack pin effect, so it should run at
      // every screen size. Sticky vs static positioning is handled purely
      // in CSS (media query below 992px); ScrollTrigger works fine against
      // statically-positioned elements too, so both features stay decoupled.
      gsap.utils
        .toArray(".product-stack-item")
        .forEach((card) => {
          gsap.fromTo(
            card,
            {
              y: 120,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [loading, sortedProducts?.length]);

  if (error) {
    return (
      <section className="products-section py-20">
        <div className="container text-center text-red-500">
          Failed to load products.
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" ref={containerRef}>
      <div className="products-top-curve"></div>

      <div className="container products-section-wrapper">
        <h2 className="products-title">Our Products</h2>

        <div className="products-stack-container">
          {loading || !sortedProducts?.length
            ? // Show 2 skeleton rows while loading — keeps section height stable
              Array.from({ length: 2 }).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))
            : sortedProducts.map((category, slideIndex) => {
                // Only the latest 5 variants; newest becomes the featured image
                const variants = getLatestVariants(category);
                const featuredProduct = variants[0];
                const remainingProducts = variants.slice(1);
                const remainingCount = remainingProducts.length;
                // When there's only one variant total, there's no "remaining"
                // panel at all — the featured image stretches to fill the row.
                const soloFeature = remainingCount === 0;

                return (
                  <div
                    key={category.id}
                    className="product-stack-item"
                    style={{ top: "120px", zIndex: slideIndex + 1 }}
                  >
                    <div className="product-grid-control-wrapper">
                      <div
                        className={`grid gap-4 product-grid-wrapper animate-fadeUp ${
                          soloFeature
                            ? "grid-cols-1"
                            : "grid-cols-[2fr_1fr_1fr]"
                        }`}
                      >
                        {featuredProduct && (
                          <ProductImageCard
                            featured
                            className="h-[420px]"
                            href={buildGalleryUrl(
                              category.slug,
                              featuredProduct.slug
                            )}
                            image={featuredProduct.image}
                            name={featuredProduct.name}
                            priority={slideIndex === 0}
                          />
                        )}

                        {!soloFeature && (
                          <div
                            className={`col-span-2 product-grid-wrapper-right ${getRightGridClass(
                              remainingCount
                            )}`}
                          >
                            {remainingProducts.map((product, idx) => (
                              <ProductImageCard
                                key={product.id}
                                className={`h-full ${getItemSpanClass(
                                  remainingCount,
                                  idx
                                )}`}
                                href={buildGalleryUrl(
                                  category.slug,
                                  product.slug
                                )}
                                image={product.image}
                                name={product.name}
                                priority={slideIndex === 0}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="product-bottom-control bg-transparent">
                        <div className="flex justify-center">
                          <Link href={category.cta_url}>
                            <button className="products-view-all-btn group flex items-center gap-4 rounded-full bg-[#66711E] px-8 py-3 text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
                              {category.name}
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-500 group-hover:rotate-45">
                                <FiArrowUpRight />
                              </span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default Products;