"use client";

import Image from "next/image";

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

export default function GalleryList({ images = [], title = "Gallery" }) {
  const pairs = toPairs(images);

  return (
    <section className="galleryListSection" aria-label="Gallery">
      {/* <h2 className="galleryListTitle">{title}</h2> */}
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