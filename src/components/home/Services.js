"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const serviceData = [
  {
    id: 1,
    title: "Indoor Plant Maintenance",
    description:
      "We create thoughtful experiences inspired by simplicity, aesthetics, and functionality. From curated collections to personalized recommendations, every detail is designed with care. Our approach blends modern design with natural inspiration to create meaningful experiences focused on quality and timeless appeal.",
    image: "/images/services.jpg",
  },
];

const categories = [
  {
    title: "01 — Plant Maintenance",
    items: [
      "Indoor Plant Maintenance",
      "Outdoor Plant Maintenance",
    ],
  },
  {
    title: "02 — Plant Rentals",
    items: [
      "Corporate Plant Rentals",
      "Event Plant Rentals",
      "Temporary Landscaping",
    ],
  },
];

export default function Services() {
  return (
    <section
      className="services-section"
      style={{
        backgroundImage: "url('/images/services-bg.png')",
      }}
    >
      <div className="container">

        <h2 className="services-title">
          SERVICES
        </h2>

        <div className="services-grid">

          {/* Left */}

          <div className="services-left">

            <h4>
              1. {serviceData[0].title}
            </h4>

            <p>
              {serviceData[0].description}
            </p>

          </div>

          {/* Center */}

          <div className="services-image">

            <Image
              src={serviceData[0].image}
              alt=""
              fill
              className="object-cover"
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

                    <Link
                      href="/"
                      key={i}
                      className={`service-item ${
                        i === 0 && index === 0 ? "active" : ""
                      }`}
                    >
                      • {item}
                    </Link>

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