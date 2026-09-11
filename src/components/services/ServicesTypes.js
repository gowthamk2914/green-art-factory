"use client";

import { useState, useRef } from "react";

/**
 * Content for both tabs. Swap the `image` paths for your own assets
 * (e.g. put files in /public/images and reference them as "/images/xyz.jpg").
 */
const TABS = [
  { key: "maintenance", label: "Plant Maintenance" },
  { key: "rentals", label: "Plant Rentals" },
];

const DATA = {
  maintenance: [
    {
      id: 1,
      title: "Indoor Plant",
      accent: "Maintenance",
      text:
        "Scheduled horticultural care for interiors — watering, feeding, pruning, light correction and quiet replacement of anything past its best. Our technicians work around your hours, so the greenery simply stays immaculate and nobody sees the work behind it.",
      image: "/images/indoor-maintenance.png",
      alt: "Indoor plants in a lounge area",
    },
    {
      id: 2,
      title: "Outdoor Plant",
      accent: "Maintenance",
      text:
        "Terraces, courtyards, entrances and rooftop gardens kept in season all year. Seasonal planting, irrigation checks, structural pruning and soil health — managed on a fixed rotation so the exterior of your building reads as deliberate as the interior.",
      image: "/images/outdoor-maintenance.png",
      alt: "Landscaped rooftop garden pathway",
    },
  ],
  rentals: [
    {
      id: 1,
      title: "Corporate",
      accent: "Plant Rental",
      text:
        "Specimen plants and matched vessels placed on a monthly agreement, with maintenance folded in. Ideal for offices, lobbies and showrooms that want mature greenery without owning it — swapped and refreshed as your space evolves.",
      image: "/images/corporate-rental.jpg",
      alt: "Moss and fern wall installation",
    },
    {
      id: 2,
      title: "Event",
      accent: "Plant Rental",
      text:
        "Greenery hired for a single evening or a full week — arrivals, stages, dining rooms and photography sets. We deliver, style on site and strike quietly after the last guest, leaving the venue exactly as we found it.",
      image: "/images/event-rental.jpg",
      alt: "Moss art panels above a bathtub",
    },
    {
      id: 3,
      title: "Temporary",
      accent: "landscaping",
      text:
        "Complete landscapes installed for a defined season — show homes, launches, film sets, hoardings and buildings between phases. Designed, delivered and removed on a fixed date, with every plant returned to our nursery for reuse.",
      image: "/images/temporary-landscaping.jpg",
      alt: "Living plant wall with integrated lighting",
    },
  ],
};

export default function ServicesTypes() {
  const [active, setActive] = useState("maintenance");
  const [direction, setDirection] = useState("forward");
  const activeIndex = TABS.findIndex((t) => t.key === active);
  const lastIndex = useRef(activeIndex);

  const handleTabClick = (key) => {
    if (key === active) return;
    const newIndex = TABS.findIndex((t) => t.key === key);
    setDirection(newIndex > lastIndex.current ? "forward" : "backward");
    lastIndex.current = newIndex;
    setActive(key);
  };

  return (
    <section className="service-type-section">
      <div className="service-type-tab-switch" role="tablist" aria-label="Service type">
        <span
          className="service-type-tab-indicator"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            className={
              "service-type-tab-btn" +
              (active === tab.key ? " service-type-tab-btn-active" : "")
            }
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        key={active}
        className={
          "service-type-list " +
          (direction === "forward"
            ? "service-type-enter-forward"
            : "service-type-enter-backward")
        }
      >
        {DATA[active].map((item, i) => (
          <div
            key={`${active}-${item.id}`}
            className={
              "service-type-row" + (i % 2 === 1 ? " service-type-row-reverse" : "")
            }
            style={{ "--delay": `${i * 0.1}s` }}
          >
            <div
              className={
                "service-type-image-wrap " +
                (i % 2 === 0 ? "service-type-shape-a" : "service-type-shape-b")
              }
            >
              {/* Replace with next/image if you have a configured loader */}
              <img
                src={item.image}
                alt={item.alt}
                className="service-type-image"
                loading="lazy"
              />
            </div>

            <div className="service-type-card-wrap">
              <span className="service-type-badge-slot">
                <span className="service-type-badge">{item.id}</span>
              </span>
              <div className="service-type-card">
                <h3 className="service-type-title">
                  {item.title}{" "}
                  <span className="service-type-title-accent">{item.accent}</span>
                </h3>
                <p className="service-type-text">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}