"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getTestimonialsRequest } from "../../redux/Testimonials/actions";

// Max cards ever shown at once (desktop breakpoint below). Used to decide
// whether looping/nav actually make sense for however many testimonials
// the API returns.
const MAX_SLIDES_PER_VIEW = 3;

export default function Testimonials() {
  const dispatch = useDispatch();

  const {
    loading,
    data: testimonials,
    error,
  } = useSelector((state) => state.Testimonials);

  useEffect(() => {
    dispatch(getTestimonialsRequest());
  }, [dispatch]);

  if (loading) return null;

  const total = testimonials?.length || 0;

  if (total === 0) return null;

  // Swiper's loop mode needs at least (slidesPerView * 2) real slides in
  // the DOM to duplicate/loop smoothly — with fewer than that, it pads the
  // track with blank slides to make the math work, which is the empty-space
  // bug. Instead of disabling loop, we pad the *data* by repeating the
  // testimonials until there's a safe minimum, so every slide slot always
  // has real content and the loop is seamless no matter the API count.
  const MIN_SLIDES_FOR_LOOP = MAX_SLIDES_PER_VIEW * 2;
  const loopSlides =
    total >= MIN_SLIDES_FOR_LOOP
      ? testimonials
      : Array.from({ length: Math.ceil(MIN_SLIDES_FOR_LOOP / total) })
          .flatMap(() => testimonials);

  const slidesPerViewMobile = Math.min(1, total);
  const slidesPerViewTablet = Math.min(2, total);
  const slidesPerViewDesktop = Math.min(MAX_SLIDES_PER_VIEW, total);

  return (
    <section className="testimonials-section">
      <div className="testimonials-wrapper">
        <h5 className="testimonial-small-title">TESTIMONIALS</h5>

        <h2 className="testimonial-title">What Our Customers Say</h2>

        <p className="testimonial-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent.
        </p>

        <Swiper
          modules={[Navigation, Autoplay]}
          centeredSlides={true}
          centerInsufficientSlides={true}
          watchOverflow={true}
          loop={true}
          loopAddBlankSlides={false}
          speed={900}
          slidesPerView={slidesPerViewDesktop}
          spaceBetween={35}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".testimonial-prev",
            nextEl: ".testimonial-next",
          }}
          breakpoints={{
            0: {
              slidesPerView: slidesPerViewMobile,
            },
            768: {
              slidesPerView: slidesPerViewTablet,
            },
            1200: {
              slidesPerView: slidesPerViewDesktop,
            },
          }}
          className="testimonial-swiper"
        >
          {loopSlides.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`}>
              <div className="testimonial-card-wrapper">
                <div className="testimonial-green-shape">
                  <Image src="/images/left-green.png" alt="" fill className="green-left" />
                  <Image src="/images/center-green.png" alt="" fill className="green-center" />
                  <Image src="/images/right-green.png" alt="" fill className="green-right" />
                </div>

                <div className="testimonial-white-shape">
                  <Image src="/images/left-white.png" alt="" fill className="white-left" />
                  <Image src="/images/center-white.png" alt="" fill className="white-center" />
                  <Image src="/images/right-white.png" alt="" fill className="white-right" />
                </div>

                {/* CONTENT */}
                <div className="testimonial-content">
                  <div className="testimonial-avatar">
                    <Image src={item.avatar} alt={item.customer_name} fill className="object-cover" />
                  </div>

                  <h3>{item.customer_name}</h3>

                  <span>{item.customer_title}</span>

                  <div className="testimonial-quote">&ldquo;</div>

                  <p>{item.quote}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="testimonial-prev">
          <IoChevronBack />
        </button>

        <button className="testimonial-next">
          <IoChevronForward />
        </button>

        <div className="testimonial-viewall">
          <Link href="/testimonials">
            <button>
              View All
              <span>
                <FiArrowUpRight />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}