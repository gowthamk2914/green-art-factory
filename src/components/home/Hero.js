"use client";

import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// `position` controls which part of the photo stays visible when it is
// cropped to fit the hero (object-position), e.g. "center top".
const heroSlides = [
  {
    id: 1,
    title: (
      <>
        Where <span className="text-[#0AA15B]">Visionary Design</span>{" "}
        Meets Living{" "}
        <span className="text-[#0AA15B]">Green Excellence</span>
      </>
    ),
    description:
      "Elevating modern spaces with thoughtfully designed landscaping, moss walls & biophilic experiences.",
    image: "/images/gaf-banner-1.webp",
    alt: "World map handcrafted from preserved green moss on a white wall",
    position: "center center",
  },
  {
    id: 2,
    title: (
      <>
        Transform Spaces With{" "}
        <span className="text-[#0AA15B]">Natural Beauty</span>
      </>
    ),
    description:
      "Bring life into your interiors with our premium moss walls and biophilic solutions.",
    image: "/images/gaf-banner-2.webp",
    alt: "Lush green wall feature in a warmly lit restaurant interior",
    position: "center center",
  },
  {
    id: 3,
    title: (
      <>
        Redefine Interiors With{" "}
        <span className="text-[#0AA15B]">Sustainable Green Art</span>
      </>
    ),
    description:
      "Create inspiring environments with eco-friendly green walls, vertical gardens, and bespoke biophilic designs.",
    image: "/images/gaf-banner-3.webp",
    alt: "Built-in planter running along a banquette seating area in a modern office",
    position: "center center",
  },
];

const Hero = () => {
  return (
    <section className="hero-section relative overflow-hidden bg-[#F7F5EC]">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        speed={1400}
        pagination={{
          clickable: true,
        }}
        className="hero-swiper h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              {/* Photo stretched across the whole hero */}
              <div className="hero-slide-media">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="hero-slide-image"
                  style={{ objectPosition: slide.position }}
                />
              </div>

              {/* One gradient over the photo: solid behind the text,
                  fading out by about 65% of the width */}
              <div className="hero-slide-fade" aria-hidden="true" />

              {/* Text on top */}
              <div className="container hero-slide-container">
                <div className="hero-slide-content">
                  <h1 className="hero-banner-text">{slide.title}</h1>

                  <p className="hero-banner-subtext">{slide.description}</p>

                  <Link href="/products-list">
                    <button
                      type="button"
                      className="mt-6 flex items-center gap-5 rounded-full bg-[#66711E] py-2 pl-8 pr-2 text-white transition-all duration-300 hover:scale-105"
                    >
                      <span className="explore-btn-text text-[15px] font-medium">
                        Explore Products
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                        <FiArrowUpRight size={22} />
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;