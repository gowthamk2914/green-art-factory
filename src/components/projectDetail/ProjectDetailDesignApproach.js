"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

// The API's `design_approach.description` can be plain text or an HTML
// string (other content fields in this API, like `content.execution`,
// come through as HTML with <p>/<ul> tags — this field may too). We
// render HTML as-is and treat plain text as a single paragraph, rather
// than guessing at paragraph breaks that aren't actually there.
function isHtml(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}

export default function ProjectDetailDesignApproach() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  // `imageFailed` flips to true if the <Image> actually fails to load
  // (broken URL, 404, network error) — not just when `image` is an
  // empty string/null/undefined. Both conditions together are the ONE
  // source of truth for whether the media column renders at all: no
  // CSS is involved in this decision anymore.
  const [imageFailed, setImageFailed] = useState(false);

  if (!project) return null;

  const designApproach = project.design_approach ?? {};
  const { title, description, image } = designApproach;

  const hasImage = Boolean(image) && !imageFailed;
  const hasDescription = Boolean(description);

  // Nothing meaningful to show for this project — the admin hasn't
  // filled in a description or an image yet, so skip the section
  // entirely rather than rendering a heading with nothing under it.
  if (!hasDescription && !hasImage) return null;

  return (
    <section className="projectDetailDesignApproachSection" aria-label="Design approach">
      <div className="projectDetailDesignApproachInner">
        {hasImage && (
          <div className="projectDetailDesignApproachMediaCol">
            <div className="projectDetailDesignApproachImageFrame">
              <Image
                src={image}
                alt={title || "Design approach"}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className="projectDetailDesignApproachImage"
                onError={() => setImageFailed(true)}
              />
            </div>
          </div>
        )}

        <div className="projectDetailDesignApproachTextCol">
          {title && <h2 className="projectDetailDesignApproachTitle">{title}</h2>}

          {hasDescription &&
            (isHtml(description) ? (
              <div
                className="projectDetailDesignApproachRichText"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="projectDetailDesignApproachParagraph">{description}</p>
            ))}
        </div>
      </div>
    </section>
  );
}