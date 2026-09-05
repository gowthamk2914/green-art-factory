"use client";

import Image from "next/image";

/**
 * Static placeholder data for now. Field names are kept generic
 * (slug, image, alt) so this can later be swapped for images fetched
 * from an API — the pairing/alternating pattern below works for any
 * array length, so new images just keep extending the same rhythm.
 */
const DEFAULT_IMAGES = [
  {
    slug: "cafe-moss-feature-wall",
    image: "/images/gallery-1.jpg",
    alt: "Cafe seating area with a large moss feature wall",
  },
  {
    slug: "workspace-plant-nook",
    image: "/images/gallery-2.jpg",
    alt: "Workspace corner with a living plant wall",
  },
  {
    slug: "meeting-room-greenery",
    image: "/images/gallery-3.jpg",
    alt: "Meeting room with greenery and natural light",
  },
  {
    slug: "spa-moss-lounge",
    image: "/images/gallery-4.jpg",
    alt: "Spa lounge area with moss wall columns",
  },
  {
    slug: "cafe-moss-feature-wall",
    image: "/images/gallery-1.jpg",
    alt: "Cafe seating area with a large moss feature wall",
  },
  {
    slug: "workspace-plant-nook",
    image: "/images/gallery-2.jpg",
    alt: "Workspace corner with a living plant wall",
  },
  {
    slug: "meeting-room-greenery",
    image: "/images/gallery-3.jpg",
    alt: "Meeting room with greenery and natural light",
  },
  {
    slug: "spa-moss-lounge",
    image: "/images/gallery-4.jpg",
    alt: "Spa lounge area with moss wall columns",
  },
];

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

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

export default function GalleryList({ images = DEFAULT_IMAGES }) {
  const pairs = toPairs(images);

  return (
    <section className="galleryListSection" aria-label="Gallery">
        <h2 className="galleryListTitle">Gallery</h2>
      <div className="galleryListInner">
        {pairs.map((pair, pairIndex) => {
          // Even pairs (0, 2, 4…) render wide-first/narrow-second; odd
          // pairs render narrow-first/wide-second — this alternation is
          // what recreates the repeating asymmetric rhythm from the
          // reference, and it keeps cycling correctly no matter how many
          // images get added later.
          const wideFirst = pairIndex % 2 === 0;
          const rowClass = pair.length === 1
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