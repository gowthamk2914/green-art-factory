
"use client";

import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function TextureCard({ item }) {
  return (
    <div className="textureShowcaseCard">
      <div className="textureShowcaseImageFrame">
        <Image
          src={item?.image || FALLBACK_IMAGE}
          alt={item?.name || "Moss texture"}
          fill
          sizes="(max-width: 860px) 100vw, 45vw"
          className="textureShowcaseImage"
        />

        {item?.gallery_url && (
          <Link
            href={item.gallery_url}
            className="textureShowcaseGalleryBtn"
          >
            View Gallery
          </Link>
        )}
      </div>

      <span className="textureShowcaseVariety">
        {item?.label}
      </span>

      <h3 className="textureShowcaseName">
        {item?.name}
      </h3>

      <p className="textureShowcaseDescription">
        {item?.description}
      </p>
    </div>
  );
}

export default function TextureShowcase({ varietiesSection }) {
  // No texture data at all → hide the entire component
  if (
    !varietiesSection ||
    !Array.isArray(varietiesSection.items) ||
    varietiesSection.items.length === 0
  ) {
    return null;
  }

  const {
    title,
    intro = "",
    footer = "",
    items,
  } = varietiesSection;

  const safeTitle = typeof title === "string" ? title : "";

  const words = safeTitle.trim().split(/\s+/).filter(Boolean);

  const accentWords =
    words.length >= 2
      ? words.slice(-2).join(" ")
      : safeTitle;

  const leadWords =
    words.length >= 2
      ? words.slice(0, -2).join(" ")
      : "";

  return (
    <section
      className="textureShowcaseSection"
      aria-label="Moss textures"
    >
      <div className="textureShowcaseInner">
        <header className="textureShowcaseHeader">
          <h2 className="textureShowcaseTitle">
            {leadWords}

            {leadWords && <br />}

            <span className="textureShowcaseTitleAccent">
              {accentWords}
            </span>
          </h2>

          <p className="textureShowcaseEyebrow">
            {intro}
          </p>
        </header>

        <div className="textureShowcaseGrid">
          {items.map((item, index) => (
            <TextureCard
              key={item?.id ?? item?.slug ?? index}
              item={item}
            />
          ))}
        </div>

        {footer && (
          <p className="textureShowcaseFooter">
            {footer}
          </p>
        )}
      </div>
    </section>
  );
}

