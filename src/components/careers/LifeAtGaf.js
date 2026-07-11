'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, FileDown, User, Leaf, Heart, Star } from 'lucide-react';

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Clear pathways for advancement in a rapidly expanding luxury sector.',
  },
  {
    icon: FileDown,
    title: 'Professional Development',
    description: 'Continuous learning through sponsored workshops and industry certifications.',
  },
  {
    icon: User,
    title: 'Collaborative Culture',
    description: 'Work alongside passionate experts in a highly creative, ego-free studio.',
  },
  {
    icon: Leaf,
    title: 'Flexible Environment',
    description: 'Hybrid working models and flexible hours to respect your life balance.',
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive premium health coverage and mental well-being support.',
  },
  {
    icon: Star,
    title: 'Performance Recognition',
    description: 'Competitive compensation and rewards for exceptional project delivery.',
  },
];

export default function LifeAtGaf() {
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
    <section ref={sectionRef} className={`las-section ${visible ? 'las-visible' : ''}`}>
      <div className="las-glow las-glow--a" />
      <div className="las-glow las-glow--b" />

      <div className="las-inner">
        <h2 className="las-title las-anim">Life At Green Art Factory</h2>
        <p className="las-subtitle las-anim" style={{ transitionDelay: '120ms' }}>
          We believe in nurturing our team just as we nurture our environments. Enjoy a suite
          of benefits designed for your holistic well-being.
        </p>

        <div className="las-grid">
          {BENEFITS.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`las-card las-anim ${i % 3 === 1 ? 'las-card--offset' : ''}`}
              style={{ transitionDelay: `${260 + i * 90}ms` }}
            >
              <div className="las-icon-box">
                <Icon className="las-icon" strokeWidth={1.8} />
              </div>
              <h3 className="las-card-title">{title}</h3>
              <p className="las-card-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}