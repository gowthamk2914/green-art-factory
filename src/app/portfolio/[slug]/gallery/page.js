"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { API_URL } from "../../../../utils/constants"; // adjust if your folders differ

// Every image of the project, in a balanced order (one from each
// collection in turn), then any gallery images not already included.
function collectProjectImages(project) {
  const result = [];
  const seen = new Set();

  const add = (src) => {
    if (typeof src !== "string" || !src.trim() || seen.has(src)) return;
    seen.add(src);
    result.push({ id: `img-${result.length}`, src });
  };

  const queues = (project?.collections ?? [])
    .filter((collection) => (collection.images ?? []).length > 0)
    .map((collection) => [...collection.images]);

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;
    for (const queue of queues) {
      if (queue.length === 0) continue;
      madeProgress = true;
      add(queue.shift());
    }
  }

  (project?.gallery ?? []).forEach((item) => add(item?.url));

  return result;
}

// The store may hold { data: project } or the project itself
function unwrap(payload) {
  return payload?.data?.slug ? payload.data : payload;
}

export default function ProjectFullGalleryPage() {
  const params = useParams();
  const slug = params?.slug ?? params?.projectSlug ?? Object.values(params || {})[0];

  // Reuse the project if the detail page already loaded it...
  const stored = unwrap(useSelector((state) => state.ProjectDetail?.data));
  const storedProject = stored?.slug === slug ? stored : null;

  // ...otherwise fetch it (direct link, refresh, etc.)
  const [fetched, setFetched] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!slug || storedProject) return;

    let cancelled = false;
    setStatus("loading");

    axios
      .get(`${API_URL}/v1/projects/${slug}`)
      .then((response) => {
        if (cancelled) return;
        const data = response.data?.data ?? null;
        setFetched(data);
        setStatus(data ? "ready" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, storedProject]);

  const project = storedProject ?? (fetched?.slug === slug ? fetched : null);

  const images = useMemo(() => collectProjectImages(project), [project]);

  // Home > Interior Projects > Project > Gallery
  const crumbs = useMemo(() => {
    if (!project) return [];

    const base =
      Array.isArray(project.breadcrumb) && project.breadcrumb.length > 0
        ? project.breadcrumb
        : [
            { label: "Home", url: "/" },
            { label: "Portfolio", url: "/portfolio" },
            { label: project.title, url: null },
          ];

    // The API leaves the project's own link empty; point it to the project page
    const withLinks = base.map((crumb, i) =>
      i === base.length - 1 && !crumb.url
        ? { ...crumb, url: `/portfolio/${project.slug}` }
        : crumb
    );

    return [...withLinks, { label: "Gallery", url: null }];
  }, [project]);

  if (!project) {
    return (
      <p className="portfolioPageStatus">
        {status === "error" ? "This gallery could not be found." : "Loading gallery…"}
      </p>
    );
  }

  return (
    <>
      <nav aria-label="Breadcrumb">
        <div className="breadcrumb container">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;

            return (
              <Fragment key={`${crumb.label}-${i}`}>
                {i > 0 && (
                  <i
                    className="bi bi-chevron-right breadcrumb-arrow"
                    aria-hidden="true"
                  ></i>
                )}

                {isLast || !crumb.url ? (
                  <span className="breadcrumb-item active" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.url} className="breadcrumb-item">
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </div>
      </nav>

      <section
        className="projectFullGallerySection"
        aria-label={`${project.title} gallery`}
      >
        <header className="projectFullGalleryHeader">
          <div>
            <span className="projectFullGalleryEyebrow">Project Gallery</span>
            <h1 className="projectFullGalleryTitle">{project.title}</h1>
            <p className="projectFullGalleryCount">
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </p>
          </div>

          <Link href={`/portfolio/${project.slug}`} className="projectFullGalleryBack">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M11 6l-6 6 6 6" />
            </svg>
            Back to project
          </Link>
        </header>

        {images.length === 0 ? (
          <p className="projectFullGalleryEmpty">
            No photos available yet for this project.
          </p>
        ) : (
          <ul className="projectFullGalleryGrid">
            {images.map((image, index) => (
              <li key={image.id} className="projectFullGalleryCell">
                <Image
                  src={image.src}
                  alt={`${project.title} \u2014 photo ${index + 1}`}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  priority={index < 3}
                  className="projectFullGalleryImage"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}