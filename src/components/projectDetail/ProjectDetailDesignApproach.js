"use client";

import { useState } from "react";
import Image from "next/image";

// Static placeholder for now — once wired to the API, pass `image` and
// `imageCaption` as props (or null/undefined when the admin hasn't
// uploaded a picture for this project).
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dzcfhoulx/image/upload/f_auto,q_auto/gaf/106/006-MOSS-WALL-RULERS-COURT-3.png.png";
const DEFAULT_IMAGE_CAPTION = "Elegant Interior Design";

const DEFAULT_TITLE = "The Design Approach";
const DEFAULT_PARAGRAPHS = [
  "Our philosophy centers on bringing nature indoors without compromising realism or architectural intent. Each artificial olive tree is fabricated to mirror natural growth patterns, canopy density, and organic imperfection.",
  "The result is an interior atmosphere that feels genuinely alive \u2014 sustainable, premium, and effortlessly integrated with the building's structure, materials, and light.",
];

export default function ProjectDetailDesignApproach({
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  image = DEFAULT_IMAGE,
  imageCaption = DEFAULT_IMAGE_CAPTION,
}) {
  // `imageFailed` flips to true if the <Image> actually fails to load
  // (broken URL, 404, network error) — not just when `image` is an
  // empty string/null/undefined. Both conditions together are the ONE
  // source of truth for whether the media column renders at all: no
  // CSS is involved in this decision anymore.
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image) && !imageFailed;

  return (
    <section className="projectDetailDesignApproachSection" aria-label="Design approach">
      <div className="projectDetailDesignApproachInner">
        {hasImage && (
          <div className="projectDetailDesignApproachMediaCol">
            <div className="projectDetailDesignApproachImageFrame">
              <Image
                src={image}
                alt={imageCaption || title}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className="projectDetailDesignApproachImage"
                onError={() => setImageFailed(true)}
              />
            </div>

            {imageCaption && (
              <div className="projectDetailDesignApproachCaption">
                <span>{imageCaption}</span>
              </div>
            )}
          </div>
        )}

        <div className="projectDetailDesignApproachTextCol">
          <h2 className="projectDetailDesignApproachTitle">{title}</h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="projectDetailDesignApproachParagraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}