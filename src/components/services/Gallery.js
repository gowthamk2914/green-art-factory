'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * GallerySection
 * "Featured Gallery" — Pinterest-style masonry grid (via CSS columns) with
 * staggered reveal-on-scroll, hover zoom, and a keyboard-navigable lightbox.
 *
 * Files:
 *   GallerySection.jsx → markup + logic (this file)
 *   GallerySection.css → all styling + keyframe animations
 *
 * Swap the `src` values below for your real project photos.
 */

const IMAGES = [
  {
    src: '/images/indoor-gallery-1.png',
    alt: 'Sunlit hotel lobby with palm trees and floral arrangement',
  },
  {
    src: '/images/indoor-gallery-2.png',
    alt: 'Moody black and white office interior with hanging plants',
  },
  {
    src: '/images/indoor-gallery-3.png',
    alt: 'Living room with three potted plants on a patterned rug',
  },
  {
    src: '/images/indoor-gallery-4.png',
    alt: 'Spiral staircase wrapped in green living wall inside an atrium',
  },
  {
    src: '/images/indoor-gallery-5.png',
    alt: 'Collection of potted houseplants beside a window',
  },
  {
    src: '/images/indoor-gallery-6.png',
    alt: 'Close-up of dark monstera leaves',
  },
  {
    src: '/images/indoor-gallery-7.png',
    alt: 'Indoor garden courtyard with dining tables surrounded by greenery',
  },
  {
    src: '/images/indoor-gallery-8.png',
    alt: 'Single monstera leaf in a glass vase on a white table',
  },
  {
    src: '/images/indoor-gallery-9.png',
    alt: 'Tall dracaena plants displayed inside a retail store',
  },
];

export default function Gallery() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

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
    setActiveIndex((current) => (current === null ? null : (current - 1 + IMAGES.length) % IMAGES.length));
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? null : (current + 1) % IMAGES.length));
  }, []);

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
        {IMAGES.map((image, i) => (
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

      {activeIndex !== null && (
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

          <img
            src={IMAGES[activeIndex].src}
            alt={IMAGES[activeIndex].alt}
            className="gls-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

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