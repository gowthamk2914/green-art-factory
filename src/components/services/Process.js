'use client';

import { useEffect, useRef, useState } from 'react';


const STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description: 'Understanding your vision and aesthetic goals.',
  },
  {
    number: '02',
    title: 'Inspection',
    description: 'Assessing light, humidity, and space dynamics.',
  },
  {
    number: '03',
    title: 'Assessment',
    description: 'Evaluating current plant health and needs.',
  },
  {
    number: '04',
    title: 'Planning',
    description: 'Creating a bespoke maintenance schedule.',
  },
  {
    number: '05',
    title: 'Execution',
    description: 'Routine care by certified professionals.',
  },
];

export default function Process() {
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
    <section ref={sectionRef} className={`prs-section ${visible ? 'prs-visible' : ''}`}>
      <div className="prs-glow prs-glow--a" />
      <div className="prs-glow prs-glow--b" />

      <div className="prs-inner">
        <h2 className="prs-title prs-anim">Our Process</h2>

        <div className="prs-timeline">
          <div className="prs-line-track">
            <div className="prs-line-fill" />
          </div>

          <div className="prs-steps">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="prs-step prs-anim"
                style={{ transitionDelay: `${350 + i * 220}ms` }}
              >
                <div className="prs-circle" style={{ transitionDelay: `${350 + i * 220}ms` }}>
                  <span className="prs-circle-ring" />
                  <span className="prs-number">{step.number}</span>
                </div>
                <h3 className="prs-step-title">{step.title}</h3>
                <p className="prs-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}