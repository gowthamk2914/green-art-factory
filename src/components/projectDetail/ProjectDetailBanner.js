"use client";

import { useSelector } from "react-redux";
import Image from "next/image";

const FALLBACK_HERO_IMAGE = "/images/default-project-detail-banner.png";

export default function ProjectHero() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The parent page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  // Some projects (e.g. "Portugal Bonsai Tree" in the sample data) have
  // `hero_image: null` but still have a populated `gallery` array — use
  // the first gallery image before falling all the way through to the
  // generic placeholder.
  const bannerImage =
    project.hero_image || project.gallery?.[0]?.url || FALLBACK_HERO_IMAGE;

  return (
    <section className="projectDetailHeroSection" aria-label="Project banner">
      <div className="projectDetailHeroMedia">
        <Image
          src={bannerImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="projectDetailHeroImage"
        />
      </div>

      <div className="projectDetailHeroOverlayPanel">
        <h1 className="projectDetailHeroTitle">{project.title}</h1>
      </div>
    </section>
  );
}