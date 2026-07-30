"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/* One entry per tab. Replace every image/video path with your real
   files in /public. `video` can point to the same clip reused across
   tabs if you don't have a unique one for each yet. */
const TABS = [
  {
    id: "overview",
    label: "Overview",
    badge: "Overview",
    heading: "The Full Picture",
    paragraphs: [
      "Green Art Factory brings together design, craftsmanship, and sustainability under one roof, delivering green installations that are as functional as they are beautiful.",
      "From first sketch to final install, every project is treated as a long-term investment in the space it lives in.",
    ],
    image: "/images/about-stories-1.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
  {
    id: "introduction",
    label: "Introduction",
    badge: "Introduction",
    heading: "Who We Are",
    paragraphs: [
      "We're a team of designers, horticulturists, and builders who believe interiors should feel alive — not decorated at, but genuinely inhabited by nature.",
      "Every installation starts with the space itself: its light, its use, and the people who move through it every day.",
    ],
    image: "/images/about-stories-2.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
  {
    id: "origins",
    label: "Origins",
    badge: "Origin",
    heading: "Where It All Began",
    paragraphs: [
      "Green Art Factory was founded with a simple belief: every space deserves the calming presence of nature. What began as a passion for botanical design has grown into a brand dedicated to crafting premium green installations that combine artistry, innovation, and lasting quality. From handcrafted moss creations to bespoke landscapes, our journey is rooted in transforming interiors into timeless, inspiring environments.",
      "Our journey began with a passion for bringing nature closer to everyday living. Guided by creativity and craftsmanship, we set out to design botanical installations that inspire, endure, and elevate every environment. Every project reflects our dedication to quality, innovation, and attention to detail. Today, we continue to create timeless green spaces that leave a lasting impression.",
    ],
    image: "/images/about-stories-3.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
  {
    id: "purpose",
    label: "Purpose",
    badge: "Purpose",
    heading: "Why We Do This",
    paragraphs: [
      "Wellbeing isn't a mood board word for us — it's measurable. Greenery lowers stress, improves air quality, and makes people want to spend more time in the spaces they occupy.",
      "Every installation is built around that outcome first, aesthetics second — though we've found the two are rarely in conflict.",
    ],
    image: "/images/about-stories-4.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
  {
    id: "services",
    label: "Services",
    badge: "Services",
    heading: "What We Build",
    paragraphs: [
      "Preserved moss walls, living green walls, vertical gardens, bespoke artificial trees, and full biophilic design and build — each service engineered for the specific climate and light conditions of its space.",
      "We handle everything from initial concept through installation and ongoing care, so the result stays as striking on day 1000 as it was on day one.",
    ],
    image: "/images/about-stories-5.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
  {
    id: "story",
    label: "Story",
    badge: "Story",
    heading: "The Road Here",
    paragraphs: [
      "From a single moss wall commission to a full-scale interior landscaping studio — every project along the way taught us something about what makes a green space actually work, not just look good in a photo.",
      "That accumulated craft is what goes into every installation we deliver today.",
    ],
    image: "/images/about-stories-6.jpg",
    video: "/videos/about-stories-video-1.mp4",
  },
];

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7-11-7Z" fill="#1a1a12" />
    </svg>
  );
}

function AboutVideo({ tab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="gaf-about-video-wrap">
      <video
        key={tab.id}
        ref={videoRef}
        src={tab.video}
        // poster={tab.videoPoster}
        controls={isPlaying}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="gaf-about-video"
      />
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${tab.label} video`}
          className="gaf-about-play-btn"
        >
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

export default function AboutStories() {
  const [activeId, setActiveId] = useState("origins");
  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0];

  /* Drives the tab switch through the View Transitions API when the
     browser supports it, so the image/video/badge/heading crossfade
     and morph instead of hard-cutting. Falls back to a plain state
     update (which still gets the CSS fade-in below) everywhere else. */
  const handleTabClick = (id) => {
    if (id === activeId) return;

    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => setActiveId(id));
    } else {
      setActiveId(id);
    }
  };

  return (
    <section className="gaf-about-section">
      <h1 className="gaf-about-title">About Us</h1>

      <div className="gaf-about-card">
        <div className="gaf-about-media" key={`${activeTab.id}-media`}>
          <div className="gaf-about-image-wrap">
            <Image
              src={activeTab.image}
              alt={activeTab.heading}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="gaf-about-image"
            />
          </div>
          <AboutVideo tab={activeTab} />
        </div>

        <div className="gaf-about-content" key={`${activeTab.id}-content`}>
          <span className="gaf-about-badge">{activeTab.badge}</span>
          <h2 className="gaf-about-heading">{activeTab.heading}</h2>
          {activeTab.paragraphs.map((p, i) => (
            <p key={i} className="gaf-about-paragraph">
              {p}
            </p>
          ))}
        </div>
      </div>

      <nav className="gaf-about-tabs">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`gaf-about-tab ${
              activeId === tab.id ? "gaf-about-tab--active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </section>
  );
}