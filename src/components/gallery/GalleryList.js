"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

// "moss-creations" -> "Moss Creations" (used only if no name is passed in)
function slugToTitle(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Splits a flat array into pairs: [[a,b], [c,d], [e]] */
function toPairs(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

function GalleryCell({ item, priority }) {
  return (
    <div className="galleryListCell">
      <Image
        src={item.image || FALLBACK_IMAGE}
        alt={item.alt || ""}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="galleryListImage"
        priority={priority}
      />
    </div>
  );
}

export default function GalleryList({
  images = [],
  title = "Gallery",
  productName,
  productSlug,
}) {
  const params = useParams();
  const pairs = toPairs(images);

  // Prefer what the page passes in; fall back to the URL
  const slug = productSlug || params?.productSlug;
  const parentName = productName || slugToTitle(slug);

  return (
    <section className="galleryListSection" aria-label="Gallery">
      {/* Breadcrumb: Home > Product > Variant */}
      <nav className="galleryListBreadcrumb" aria-label="Breadcrumb">
        <div className="breadcrumb">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>

          {slug && (
            <>
              <i className="bi bi-chevron-right breadcrumb-arrow" aria-hidden="true"></i>
              <Link href={`/products/${slug}`} className="breadcrumb-item">
                {parentName}
              </Link>
            </>
          )}

          {title && (
            <>
              <i className="bi bi-chevron-right breadcrumb-arrow" aria-hidden="true"></i>
              <span className="breadcrumb-item active" aria-current="page">
                {title}
              </span>
            </>
          )}
        </div>
      </nav>

      <h2 className="galleryListTitle">GALLERY</h2>

      <div className="galleryListInner">
        {images.length === 0 && (
          <p className="galleryListEmpty">No images available yet for this gallery.</p>
        )}
        {pairs.map((pair, pairIndex) => {
          // Even pairs (0, 2, 4…) render wide-first/narrow-second; odd
          // pairs render narrow-first/wide-second — this alternation
          // keeps cycling correctly no matter how many images a variant
          // has.
          const wideFirst = pairIndex % 2 === 0;
          const rowClass =
            pair.length === 1
              ? "galleryListRowSingle"
              : wideFirst
              ? "galleryListRowWideFirst"
              : "galleryListRowWideSecond";

          return (
            <div key={pairIndex} className={`galleryListRow ${rowClass}`}>
              {pair.map((item, i) => (
                <GalleryCell
                  key={item.slug}
                  item={item}
                  priority={pairIndex === 0 && i === 0}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}