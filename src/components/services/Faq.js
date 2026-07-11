'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';


const FAQS = [
  {
    question: 'How often should indoor plants be maintained?',
    answer:
      'Most indoor plants benefit from a visit every 1–2 weeks, depending on species, light exposure, and season. During your consultation, we assess your specific plants and space to recommend a maintenance frequency that keeps them consistently healthy without over- or under-servicing.',
  },
  {
    question: 'What types of plants do you service?',
    answer:
      'We work with a wide range of indoor plants — from low-maintenance succulents and snake plants to larger statement pieces like fiddle-leaf figs, monsteras, and palms. Our certified horticulturists tailor care to each species\u2019 specific light, water, and nutrient needs.',
  },
  {
    question: 'Do you provide maintenance services for offices and commercial spaces?',
    answer:
      'Yes. We regularly service corporate offices, boutique hotels, restaurants, and reception areas. Commercial plans can include scheduled visits outside business hours, discreet servicing during working hours, and reporting so facilities teams stay informed.',
  },
  {
    question: 'Can you replace unhealthy or declining plants?',
    answer:
      'Absolutely. As part of ongoing maintenance plans, we monitor plant health and proactively replace anything that\u2019s declining beyond recovery, so your space always looks its best. Replacement terms are outlined clearly in your service agreement.',
  },
  {
    question: 'Are maintenance schedules fully customizable?',
    answer:
      'Yes — every schedule is built around your space, plant collection, and preferences. Whether you need weekly visits, biweekly check-ins, or a seasonal deep-clean plan, we\u2019ll design a schedule that fits your needs and budget.',
  },
  {
    question: 'Do you provide emergency plant care services?',
    answer:
      'Yes, emergency consultations and after-hours support are available via WhatsApp 24/7. If you notice sudden wilting, pest infestations, or other urgent issues, our team can advise immediately and schedule a priority visit.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">
        Frequently Asked
        <br />
        Questions
      </h2>

      <div className="faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-icon-box">
                  <Plus className="faq-icon" />
                </span>
              </button>

              <div className="faq-answer-wrap">
                <div className="faq-answer-inner">
                  <p className="faq-answer-text">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}