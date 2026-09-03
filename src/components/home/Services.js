"use client";

import { useState } from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";




const categories = [
  {
    title: "01 — Plant Maintenance",
    items: [
      {
        title: "Indoor Plant Maintenance",
        description:
          "We create thoughtful experiences inspired by simplicity, aesthetics, and functionality. From curated collections to personalized recommendations, every detail is designed with care.",
        image: "/images/services1.jpg",
      },
      {
        title: "Outdoor Plant Maintenance",
        description:
          "Professional outdoor plant care that keeps landscapes healthy, vibrant and visually appealing throughout every season.",
        image: "/images/services2.jpg",
      },
    ],
  },
  {
    title: "02 — Plant Rentals",
    items: [
      {
        title: "Corporate Plant Rentals",
        description:
          "Enhance workplaces with premium indoor plants maintained by our experienced team.",
        image: "/images/services3.jpg",
      },
      {
        title: "Event Plant Rentals",
        description:
          "Temporary greenery and decorative plants to elevate weddings, exhibitions and corporate events.",
        image: "/images/services4.jpg",
      },
      {
        title: "Temporary Landscaping",
        description:
          "Beautiful temporary landscape installations for launches, events and exhibitions.",
        image: "/images/services5.jpg",
      },
    ],
  },
];




export default function Services() {

const [activeService, setActiveService] = useState(categories[0].items[0]);



  return (
    <section
      className="services-section"
      style={{
        backgroundImage: "url('/images/services-bg.png')",
      }}
    >
      <div className="container">

        <h2 className="services-title">
          Services
        </h2>

        <div className="services-grid">

          {/* Left */}

          <div className="services-left">

            <h4>
  {activeService.title}
</h4>

<p>
  {activeService.description}
</p>

          </div>

          {/* Center */}

          <div className="services-image">

            <Image
  src={activeService.image}
  alt={activeService.title}
  fill
  className="object-cover"
  key={activeService.image}
/>

          </div>

          {/* Right */}

          <div className="services-right">

            {categories.map((section, index) => (

              <div
                className="service-card"
                key={index}
              >

                <div className="service-header">

                  <h4>{section.title}</h4>

                  <button>

                    <FiArrowUpRight />

                  </button>

                </div>

                <div className="service-list">

                  {section.items.map((item, i) => (

  <button
    key={i}
    type="button"
    onClick={() => setActiveService(item)}
    className={`service-item ${
      activeService.title === item.title ? "active" : ""
    }`}
  >
     {item.title}
  </button>

))}

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="services-bottom">

          <button className="services-btn">

            View All Services

            <span>

              <FiArrowUpRight />

            </span>

          </button>

        </div>

      </div>
    </section>
  );
}