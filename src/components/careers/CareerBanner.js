'use client';

import { useEffect, useRef, useState } from 'react';

const BG_IMAGE_SRC = '/images/careers-bg.png';

export default function CareersHeroSection() {
  const [visible, setVisible] = useState(false);
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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`chs-section ${visible ? 'chs-visible' : ''}`}
      style={{ backgroundImage: `url(${BG_IMAGE_SRC})` }}
    >
      <div className="chs-overlay" />

      <div className="chs-content">
        <h1 className="chs-heading chs-anim">
          Grow Your
          <br />
          <span className="chs-heading-accent">Career</span> With Us
        </h1>

        <p className="chs-subtitle chs-anim" style={{ transitionDelay: '150ms' }}>
          Join a collective of visionaries, botanists, and designers dedicated to bringing the
          elegance of nature into modern living and working spaces.
        </p>

        <div className="chs-actions chs-anim" style={{ transitionDelay: '300ms' }}>
          <a href="#open-positions" className="chs-btn chs-btn--solid">
            <span className="chs-btn-shine" />
            <span className="chs-btn-text">View Open Positions</span>
          </a>
          <a href="#apply" className="chs-btn chs-btn--outline">
            <span className="chs-btn-text">Apply Now</span>
          </a>
        </div>
      </div>
    </section>
  );
}