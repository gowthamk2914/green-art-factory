'use client';

import { useEffect, useRef, useState } from 'react';
import { Sprout, BadgeCheck, Sparkles, Clock3, ShieldCheck, CalendarClock } from 'lucide-react';


const BG_IMAGE_SRC = '/images/benefits-bg.png';

const BENEFITS = [
  {
    icon: Sprout,
    title: 'Healthier Indoor Plants',
    description:
      'Regular, expert care ensures your plants thrive with optimum nutrition, hydration, and light management tailored to each species.',
  },
  {
    icon: BadgeCheck,
    title: 'Professional Maintenance',
    description:
      'Our certified horticulturists bring deep botanical expertise to every visit, delivering white-glove service and precise, knowledgeable care.',
  },
  {
    icon: Sparkles,
    title: 'Improved Indoor Ambience',
    description:
      'Vibrant, well-maintained plants elevate the atmosphere of any space — enhancing aesthetics, air quality, and the overall mood of your interiors.',
  },
  {
    icon: Clock3,
    title: 'Long-lasting Plant Life',
    description:
      'Consistent, specialist maintenance dramatically extends the lifespan of your indoor plants, protecting your investment for years to come.',
  },
  {
    icon: ShieldCheck,
    title: 'Pest & Disease Prevention',
    description:
      'Early detection and eco-friendly treatments prevent infestations and diseases before they take hold, keeping your plants in peak condition.',
  },
  {
    icon: CalendarClock,
    title: 'Time-Saving Care',
    description:
      'Delegate all plant care responsibilities to our team and reclaim your time, knowing your greenery is in the hands of true professionals.',
  },
];

export default function Benefits() {
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
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`bfs-section ${visible ? 'bfs-visible' : ''}`}
      style={{ backgroundImage: `url(${BG_IMAGE_SRC})` }}
    >
      <div className="bfs-overlay" />

      <div className="bfs-inner">
        <h2 className="bfs-title bfs-anim bfs-anim--up">Benefits</h2>
        <p className="bfs-subtitle bfs-anim bfs-anim--up" style={{ transitionDelay: '120ms' }}>
          Keep your indoor plants healthy, vibrant, and thriving with expert care tailored to
          their needs. Regular maintenance enhances beauty, improves air quality, and extends
          plant life.
        </p>

        <div className="bfs-grid">
          {BENEFITS.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="bfs-card bfs-anim bfs-anim--up"
              style={{ transitionDelay: `${220 + i * 90}ms` }}
            >
              <div className="bfs-icon-box">
                <Icon className="bfs-icon" strokeWidth={1.8} />
              </div>
              <h3 className="bfs-card-title">{title}</h3>
              <p className="bfs-card-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}