"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import { getHomeHeroRequest } from "../../redux/HomeHero/actions"; // adjust path to match your folders

const DEFAULT_CTA_LABEL = "Explore Products";
const DEFAULT_CTA_URL = "/products-list";

// Used only when the API fails or returns no slides, so the hero is never empty.
const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    headline: "Where Visionary Design Meets Living Green Excellence",
    description:
      "Elevating modern spaces with thoughtfully designed landscaping, moss walls & biophilic experiences.",
    image: "/images/gaf-banner-1.webp",
    alt: "World map handcrafted from preserved green moss on a white wall",
    ctaLabel: DEFAULT_CTA_LABEL,
    ctaUrl: DEFAULT_CTA_URL,
  },
  {
    id: "fallback-2",
    headline: "Transform Spaces With Natural Beauty",
    description:
      "Bring life into your interiors with our premium moss walls and biophilic solutions.",
    image: "/images/gaf-banner-2.webp",
    alt: "Lush green wall feature in a warmly lit restaurant interior",
    ctaLabel: DEFAULT_CTA_LABEL,
    ctaUrl: DEFAULT_CTA_URL,
  },
  {
    id: "fallback-3",
    headline: "Redefine Interiors With Sustainable Green Art",
    description:
      "Create inspiring environments with eco-friendly green walls, vertical gardens, and bespoke biophilic designs.",
    image: "/images/gaf-banner-3.webp",
    alt: "Built-in planter running along a banquette seating area in a modern office",
    ctaLabel: DEFAULT_CTA_LABEL,
    ctaUrl: DEFAULT_CTA_URL,
  },
];

// The last two words of the headline are shown in the accent colour,
// whatever the headline is.
function renderHeadline(headline = "") {
  const words = headline.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 2) {
    return <span className="text-[#0AA15B]">{headline}</span>;
  }

  const lead = words.slice(0, -2).join(" ");
  const accent = words.slice(-2).join(" ");

  return (
    <>
      {lead} <span className="text-[#0AA15B]">{accent}</span>
    </>
  );
}

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

function HeroCta({ label, url }) {
  const className =
    "mt-6 inline-flex items-center gap-5 rounded-full bg-[#66711E] py-2 pl-8 pr-2 text-white transition-all duration-300 hover:scale-105";

  const content = (
    <>
      <span className="explore-btn-text text-[15px] font-medium">{label}</span>

      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
        <FiArrowUpRight size={22} aria-hidden="true" />
      </span>
    </>
  );

  // Links to other sites open in a new tab; links inside the site stay in the app
  if (isExternalUrl(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={url} className={className}>
      {content}
    </Link>
  );
}

const Hero = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.HomeHero ?? {});

  useEffect(() => {
    dispatch(getHomeHeroRequest());
  }, [dispatch]);

  const slides = useMemo(() => {
    const fromApi = (data ?? [])
      .filter((item) => item?.headline && item?.image)
      .map((item) => ({
        id: item.id,
        headline: item.headline,
        description: item.subtext,
        image: item.image,
        alt: item.headline,
        ctaLabel: item.cta_label || DEFAULT_CTA_LABEL,
        ctaUrl: item.cta_url || DEFAULT_CTA_URL,
      }));

    return fromApi.length > 0 ? fromApi : FALLBACK_SLIDES;
  }, [data]);

  // While the request is running, show an empty hero-sized block so the page
  // doesn't jump and the old banners don't flash before the real ones.
  if (loading) {
    return (
      <section
        className="hero-section relative overflow-hidden bg-[#F7F5EC]"
        aria-busy="true"
        aria-label="Loading banner"
      >
        <div className="hero-slide" />
      </section>
    );
  }

  const isMulti = slides.length > 1;

  return (
    <section className="hero-section relative overflow-hidden bg-[#F7F5EC]">
      <Swiper
        // Re-create the slider when the number of slides changes
        key={slides.length}
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        loop={isMulti}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={
          isMulti
            ? {
                delay: 6000,
                disableOnInteraction: false,
              }
            : false
        }
        speed={1400}
        pagination={isMulti ? { clickable: true } : false}
        className="hero-swiper h-full"
      >
        {slides.map((slide, index) => (
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
                />
              </div>

              {/* One gradient over the photo: solid behind the text,
                  fading out by about 65% of the width */}
              <div className="hero-slide-fade" aria-hidden="true" />

              {/* Text on top */}
              <div className="container hero-slide-container">
                <div className="hero-slide-content">
                  <h1 className="hero-banner-text">
                    {renderHeadline(slide.headline)}
                  </h1>

                  {slide.description && (
                    <p className="hero-banner-subtext">{slide.description}</p>
                  )}

                  <HeroCta label={slide.ctaLabel} url={slide.ctaUrl} />
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