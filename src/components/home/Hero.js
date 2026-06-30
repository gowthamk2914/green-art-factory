"use client";

import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

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
    image: "/images/hero-plant.png",
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
    image: "/images/hero-plant.png",
  },
  {
  id: 3,
  title: (
    <>
      Redefine Interiors With{" "}
      <span className="text-[#0AA15B]">
        Sustainable Green Art
      </span>
    </>
  ),
  description:
    "Create inspiring environments with eco-friendly green walls, vertical gardens, and bespoke biophilic designs.",
  image: "/images/hero-plant.png",
},
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F7F5EC]">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
  delay: 6000,
  disableOnInteraction: false,
}}
speed={2000}
        pagination={{
          clickable: true,
        }}
        className="hero-swiper h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="container flex items-center justify-between">
              
              {/* Left Content */}
              <div className="w-[57%] pt-16">
                <h1 className="hero-banner-text text-[64px] font-bold leading-[1.15] tracking-[-1px] text-black">
                  {slide.title}
                </h1>

                <p className="hero-banner-subtext mt-8 text-[19px] leading-[1.7] text-[#333]">
                  {slide.description}
                </p>

                <button className="mt-10 flex items-center gap-5 rounded-full bg-[#66711E] py-2 pl-8 pr-2 text-white transition-all duration-300 hover:scale-105">
                  <span className="explore-btn-text text-[15px] font-medium">
                    Explore Products
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                    <FiArrowUpRight size={22} />
                  </div>
                </button>

                <p className="banner-discount-text mt-28 text-[20px] text-black">
                  Checkout our new offers and discounts{" "}
                  <a
                    href="#"
                    className="font-medium text-[#0AA15B] underline"
                  >
                    here
                  </a>
                </p>
              </div>

              {/* Right Image */}
              <div className="flex w-[52%] justify-end">
                <Image
                  src={slide.image}
                  alt="Plant"
                  width={850}
                  height={700}
                  priority
                  className="w-full max-w-[850px] object-contain"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;