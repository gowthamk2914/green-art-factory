"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

function isHtml(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}

// True only if the value has real visible content. The dashboard's editor
// saves "empty" fields as things like "<p></p>" or "<p>&nbsp;</p>", which
// are truthy strings but show nothing. Media tags count as content.
function hasMeaningfulContent(value) {
  if (typeof value !== "string") return false;
  if (/<(img|iframe|video)\b/i.test(value)) return true;

  const text = value
    .replace(/<[^>]*>/g, "") // strip tags
    .replace(/&nbsp;|&#160;/gi, " ") // non-breaking spaces
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0;
}

export default function ProjectDetailDesignApproach() {
  const project = useSelector((state) => state.ProjectDetail?.data);

  // Flips to true if the <Image> actually fails to load (404, bad URL, etc.)
  const [imageFailed, setImageFailed] = useState(false);

  if (!project) return null;

  const designApproach = project.design_approach ?? {};
  const { title, description, image } = designApproach;

  const hasDescription = hasMeaningfulContent(description);
  const hasImage =
    typeof image === "string" && image.trim() !== "" && !imageFailed;

  // Hide the whole section only when BOTH are empty
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