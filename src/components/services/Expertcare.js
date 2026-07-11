'use client';

import { useEffect, useRef, useState } from 'react';



const IMAGE_SRC =
  '/images/expert-care-img.jpg';

const TAGS = [
  'Watering & Nutrition',
  'Pruning & Shaping',
  'Pest Prevention',
  'Foliage Cleaning',
  'Health Monitoring',
  'Soil Management',
];

export default function ExpertCareSection() {
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`ecs-section ${sectionVisible ? 'ecs-visible' : ''}`}>
      <div className="services-head-wrapper">
      <h2 className="services-heading-black">OUR SERVICES</h2>
      <h2 className="services-title-green">INDOOR PLANT MAINTENANCE</h2>
      </div>
      <div className="ecs-glow ecs-glow--a" />
      <div className="ecs-glow ecs-glow--b" />

      <div className="ecs-grid">
        {/* LEFT: image with expertise badge — count-up starts when THIS card is visible */}
        <InViewCard className="ecs-image-wrap ecs-anim ecs-anim--left">
          {(inView) => (
            <>
              <img src={IMAGE_SRC} alt="Lush indoor palm plant in a modern interior" className="ecs-image" />
              <div className="ecs-image-shade" />

              <div className="ecs-badge">
                <span className="ecs-badge-number">
                  <CountUp target={15} suffix="+" start={inView} />
                </span>
                <span className="ecs-badge-label">Years of Expertise</span>
              </div>
            </>
          )}
        </InViewCard>

        {/* RIGHT: copy + tags + stats bar */}
        <div className="ecs-content">
          <h2 className="ecs-heading ecs-anim ecs-anim--up">
            Expert Care for
            <br />
            Every Green Space
          </h2>
          <span className="ecs-heading-underline ecs-anim ecs-anim--up" style={{ transitionDelay: '150ms' }} />

          <p
            className="ecs-paragraph ecs-anim ecs-anim--up"
            style={{ transitionDelay: '220ms' }}
          >
            Our Indoor Plant Maintenance service is a comprehensive, white-glove solution
            designed for discerning clients who understand the value of vibrant, healthy
            greenery within their living and working environments.
          </p>

          <p
            className="ecs-paragraph ecs-anim ecs-anim--up"
            style={{ transitionDelay: '300ms' }}
          >
            From routine watering, expert pruning, and precise fertilization to
            deep-cleaning foliage, pest prevention, and soil health monitoring — every
            aspect of your indoor garden is managed by our certified horticulturists. We
            serve luxury homes, corporate offices, boutique hotels, restaurant interiors,
            and commercial reception spaces.
          </p>

          <div className="ecs-tags ecs-anim ecs-anim--up" style={{ transitionDelay: '1180ms' }}>
            {TAGS.map((tag, i) => (
              <span
                key={tag}
                className="ecs-tag"
                style={{ transitionDelay: `${420 + i * 60}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats bar — count-up starts when THIS card is visible, not on hover */}
          <InViewCard className="ecs-stats-bar ecs-anim ecs-anim--up" style={{ transitionDelay: '520ms' }}>
            {(inView) => (
              <>
                <div className="ecs-stats-glow" />

                <div className="ecs-stat">
                  <span className="ecs-stat-number">
                    <CountUp target={98} suffix="%" start={inView} />
                  </span>
                  <span className="ecs-stat-label">Client Satisfaction Rate</span>
                </div>

                <div className="ecs-stat-divider" />

                <div className="ecs-stat">
                  <span className="ecs-stat-number">
                    <CountUp target={2.4} decimals={1} suffix="k+" start={inView} delay={150} />
                  </span>
                  <span className="ecs-stat-label">Plants Under Our Care</span>
                </div>

                <p className="ecs-stats-note">
                  Trusted by leading hotels, premium offices, and luxury residences across the
                  region for over 15 years.
                </p>
              </>
            )}
          </InViewCard>
        </div>
      </div>
    </section>
  );
}

/**
 * InViewCard
 * Wraps a card with its own IntersectionObserver and passes `inView` (boolean)
 * to a render-prop child function once the card itself scrolls into the
 * viewport. Fires once, then disconnects.
 */
function InViewCard({ className, style, children }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children(inView)}
    </div>
  );
}

/**
 * CountUp
 * Small self-contained count-up animation driven by requestAnimationFrame.
 * Starts once `start` becomes true (e.g. when its card enters the viewport),
 * after an optional delay (ms). Runs once.
 */
function CountUp({ target, suffix = '', decimals = 0, start = false, delay = 0 }) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const duration = 1200;
    let rafId;
    let startTime;
    let timeoutId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [start, target, delay]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}