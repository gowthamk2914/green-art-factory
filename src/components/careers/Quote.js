'use client';

import { useEffect, useRef, useState } from 'react';


const IMAGE_SRC =
  '/images/quote-section-img.png';

export default function Quote() {
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
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`qts-section ${visible ? 'qts-visible' : ''}`}>
      <div className="qts-image-card qts-anim qts-anim--left">
        <img src={IMAGE_SRC} alt="Artisan crafting a moss world map at Green Art Factory" className="qts-image" />
      </div>

      <div className="qts-quote-wrap qts-anim qts-anim--up">
        <span className="qts-mark qts-mark--open">&ldquo;</span>
        <p className="qts-quote">
          We don&apos;t hire
          <br />
          for positions.
          <br />
          We invite
          <br />
          people to grow.
        </p>
        <span className="qts-mark qts-mark--close">&rdquo;</span>
      </div>

      <div className="qts-image-card qts-anim qts-anim--right">
        <img src={IMAGE_SRC} alt="Artisan crafting a moss world map at Green Art Factory" className="qts-image" />
      </div>
    </section>
  );
}