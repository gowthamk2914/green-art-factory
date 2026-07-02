"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const clients = [
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  "/images/logo.png",
  
];

const sliderClients = [...clients, ...clients, ...clients];

export default function Clients() {
  return (
    <section className="clients-section">

      <span className="tag">
        Trusted Leaders
      </span>

      <h2>
        Clients We've Partnered With
      </h2>

      <div className="clients-slider-wrapper">
  <Swiper
    modules={[EffectCoverflow, Navigation, Autoplay]}
    effect="coverflow"
    centeredSlides
    centeredSlidesBounds={false}
    loop={true}
    loopAdditionalSlides={clients.length}
    loopedslides={clients.length}
    watchSlidesProgress
    grabCursor
    slidesPerView={7}
    navigation={{
      nextEl: ".client-next",
      prevEl: ".client-prev",
    }}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    coverflowEffect={{
      rotate: 0,
      stretch: -12,
      depth: 140,
      modifier: 1.8,
      scale: 0.88,
      slideShadows: false,
    }}
    breakpoints={{
      0: { slidesPerView: 3 },
      768: { slidesPerView: 5 },
      1200: { slidesPerView: 7 },
    }}
    className="clients-slider"
  >
    {sliderClients.map((logo, index) => (
      <SwiperSlide key={index}>
        <div className="client-card">
          <Image
            src={logo}
            alt=""
            width={180}
            height={100}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

      <div className="slider-buttons">

        <button className="client-prev">
          &#10094;
        </button>

        <button className="client-next">
          &#10095;
        </button>

      </div>

      <p>
        Our clients are at the heart of everything we do.
        <br />
        Their trust and satisfaction inspire us to deliver excellence every day.
      </p>

    </section>
  );
}