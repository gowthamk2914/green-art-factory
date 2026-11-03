'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import { getPortfolioPageRequest } from '../../redux/Portfolio/actions'; // adjust path to your actions file

/**
 * GallerySection — "Featured Gallery"
 * Pinterest-style masonry grid with staggered reveal-on-scroll, hover zoom
 * and a keyboard-navigable lightbox.
 *
 * Images come from the portfolio API (/api/v1/pages/portfolio) via Redux:
 *   ONE random image from each of 9 randomly chosen projects,
 *   re-randomised on every page load.
 *
 * Files:
 *   GallerySection.jsx → markup + logic (this file)
 *   GallerySection.css → all styling + keyframe animations
 */

const TOTAL_IMAGES = 9;

/* Optional: show only one category, e.g. 'interior-projects'.
   null = pick from ALL projects. */
const ONLY_CATEGORY = null;

/* Must match the key used in combineReducers (rootReducer). */
const PORTFOLIO_STATE_KEY = 'Portfolio';

const EMPTY_STATE = { data: null, loading: false, error: null };

const selectPortfolioState = (state) => state[PORTFOLIO_STATE_KEY] ?? EMPTY_STATE;

/* Your original images: shown until the projects load, and used to top up
   the grid if fewer than 9 projects have images. */
const FALLBACK_IMAGES = [
  { src: '/images/indoor-gallery-1.png', alt: 'Sunlit hotel lobby with palm trees and floral arrangement' },
  { src: '/images/indoor-gallery-2.png', alt: 'Moody black and white office interior with hanging plants' },
  { src: '/images/indoor-gallery-3.png', alt: 'Living room with three potted plants on a patterned rug' },
  { src: '/images/indoor-gallery-4.png', alt: 'Spiral staircase wrapped in green living wall inside an atrium' },
  { src: '/images/indoor-gallery-5.png', alt: 'Collection of potted houseplants beside a window' },
  { src: '/images/indoor-gallery-6.png', alt: 'Close-up of dark monstera leaves' },
  { src: '/images/indoor-gallery-7.png', alt: 'Indoor garden courtyard with dining tables surrounded by greenery' },
  { src: '/images/indoor-gallery-8.png', alt: 'Single monstera leaf in a glass vase on a white table' },
  { src: '/images/indoor-gallery-9.png', alt: 'Tall dracaena plants displayed inside a retail store' },
];

/* ---------- helpers ---------- */

/* Fisher–Yates shuffle (returns a new array) */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* Accepts: [...]  |  { projects: [...] }  |  { data: { projects: [...] } } */
function getProjects(source) {
  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.projects)) return source.projects;
  if (Array.isArray(source?.data?.projects)) return source.data.projects;
  return [];
}

/* All usable image URLs of one project, no duplicates.
   API shape: gallery: [{ url, alt }], cover_image: string | null */
function getProjectImages(project) {
  const gallery = Array.isArray(project?.gallery) ? project.gallery : [];

  const urls = [
    project?.cover_image,
    ...gallery.map((item) => (typeof item === 'string' ? item : item?.url)),
  ].filter((url) => typeof url === 'string' && url.trim() !== '');

  return [...new Set(urls)];
}

/* One random image from each of 9 random projects (topped up if needed) */
function pickGalleryImages(projects) {
  const eligible = ONLY_CATEGORY
    ? projects.filter((p) => p?.category?.slug === ONLY_CATEGORY)
    : projects;

  const toItem = (project, src) => ({
    src,
    // The API's image alt values are random IDs, so use the project title
    alt: project.title?.trim() || 'Project image',
    title: project.title?.trim() || '',
    href: project.cta_url || (project.slug ? `/portfolio/${project.slug}` : ''),
  });

  const picked = [];    // one image per project
  const leftovers = []; // every other image, only used to top up
  const used = new Set();

  shuffle(eligible).forEach((project) => {
    const urls = getProjectImages(project);
    if (urls.length === 0) return;

    // pick a random image of this project
    const [chosen, ...rest] = shuffle(urls);

    if (picked.length < TOTAL_IMAGES) {
      picked.push(toItem(project, chosen));
      used.add(chosen);
      rest.forEach((url) => leftovers.push(toItem(project, url)));
    }
  });

  // Fewer than 9 projects? Add more images from the same projects
  for (const item of shuffle(leftovers)) {
    if (picked.length >= TOTAL_IMAGES) break;
    if (!used.has(item.src)) {
      picked.push(item);
      used.add(item.src);
    }
  }

  // Still short? Fill with the static images
  for (const item of FALLBACK_IMAGES) {
    if (picked.length >= TOTAL_IMAGES) break;
    if (!used.has(item.src)) {
      picked.push(item);
      used.add(item.src);
    }
  }

  return picked;
}

/* ---------- component ---------- */

export default function Gallery({ projects: projectsProp }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(selectPortfolioState);

  // A `projects` prop wins; otherwise read from Redux.
  // `data` is the whole API response: { data: { section, filters, projects }, meta }
  const projects = getProjects(projectsProp ?? data);

  // Static images first, so server and first client render match
  // (no hydration warning); the random pick is applied after mount.
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

  // Fetch once if nothing is loaded yet (e.g. the home page, where the
  // portfolio page was never visited)
  useEffect(() => {
    if (projectsProp) return;
    if (!data && !loading) dispatch(getPortfolioPageRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-pick only when the set of projects changes
  const projectsKey = projects.map((p) => p?.id ?? p?.slug ?? '').join('|');

  useEffect(() => {
    if (projects.length === 0) return;
    setImages(pickGalleryImages(projects));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsKey]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length
    );
  }, [images.length]);

  // keyboard navigation for the lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, showPrev, showNext]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <section ref={sectionRef} className={`gls-section ${visible ? 'gls-visible' : ''}`}>
      <div className="gls-header">
        <h2 className="gls-title gls-anim">Featured Gallery</h2>
        <p className="gls-subtitle gls-anim" style={{ transitionDelay: '100ms' }}>
          Explore our gallery showcasing beautifully maintained indoor plants across diverse
          spaces. Every project reflects our commitment to quality, care, and lasting greenery.
        </p>
      </div>

      <div className="gls-masonry">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            className="gls-item gls-anim"
            style={{ transitionDelay: `${180 + (i % 6) * 80}ms` }}
            onClick={() => openLightbox(i)}
            aria-label={`Open image: ${image.alt}`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" className="gls-img" />
            <span className="gls-item-shine" />
          </button>
        ))}
      </div>

      {activeImage && (
        <div className="gls-lightbox" onClick={closeLightbox}>
          <button
            type="button"
            className="gls-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            className="gls-nav gls-nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={26} />
          </button>

          <figure className="gls-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="gls-lightbox-img"
            />

            {/* Project name + link; only for images that came from a project */}
            {activeImage.title && (
              <figcaption className="gls-lightbox-caption">
                <span>{activeImage.title}</span>
                {activeImage.href && (
                  <Link href={activeImage.href} className="gls-lightbox-link">
                    View project
                  </Link>
                )}
              </figcaption>
            )}
          </figure>

          <button
            type="button"
            className="gls-nav gls-nav--next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </section>
  );
}