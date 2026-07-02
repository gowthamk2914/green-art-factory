"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Hannah Schmitt",
    designation: "Lead Designer",
    image: "/images/testimonials1.jpg",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis.",
  },
  {
    id: 2,
    name: "Olivia Johnson",
    designation: "Interior Consultant",
    image: "/images/testimonials2.jpg",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed magna eget nibh in turpis.",
  },
  {
    id: 3,
    name: "Michael Brown",
    designation: "Architect",
    image: "/images/testimonials3.jpg",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus venenatis felis id augue sit cursus pellentesque enim.",
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Business Owner",
    image: "/images/testimonials4.jpg",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 5,
    name: "James Carter",
    designation: "CEO",
    image: "/images/testimonials5.jpg",
    review:
      "Lorem ipsum dolor sit amet.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
        
      <div
        className="testimonials-wrapper"
        
      >
        <h5 className="testimonial-small-title">
          TESTIMONIALS
        </h5>

        <h2 className="testimonial-title">
          What Our Customers Say
        </h2>

        <p className="testimonial-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nunc vulputate libero et velit interdum, ac aliquet odio
          mattis. Class aptent taciti sociosqu ad litora torquent.
        </p>

        <Swiper
          modules={[Navigation, Autoplay]}
          centeredSlides={true}
          loop={true}
          speed={900}
          slidesPerView={3}
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
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-card-wrapper">

                <div className="testimonial-green-shape">

  <Image
    src="/images/left-green.png"
    alt=""
    fill
    className="green-left"
  />

  <Image
    src="/images/center-green.png"
    alt=""
    fill
    className="green-center"
  />

  <Image
    src="/images/right-green.png"
    alt=""
    fill
    className="green-right"
  />

</div>

<div className="testimonial-white-shape">

  <Image
    src="/images/left-white.png"
    alt=""
    fill
    className="white-left"
  />

  <Image
    src="/images/center-white.png"
    alt=""
    fill
    className="white-center"
  />

  <Image
    src="/images/right-white.png"
    alt=""
    fill
    className="white-right"
  />

</div>

                {/* CONTENT */}

                <div className="testimonial-content">

                  <div className="testimonial-avatar">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  <h3>{item.name}</h3>

                  <span>{item.designation}</span>

                  <div className="testimonial-quote">“</div>

                  <p>{item.review}</p>

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