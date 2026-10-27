"use client";


const DEFAULT_VIDEOS = [
  {
    id: "video-1",
    videoId: "j8PRFKxgWDY",
    title: "Preserved Moss Wall Installation",
    description:
      "Watch how a bespoke preserved moss wall comes together, from first layout to the final finishing touches.",
  },
  {
    id: "video-2",
    videoId: "rzmQpTqmZTU",
    title: "Transform Your Space With Green Walls",
    description:
      "See how a blank wall becomes a lush, maintenance-free feature that brings nature into the interior.",
  },
  {
    id: "video-3",
    videoId: "hA2J_ANjOHU",
    title: "Custom Moss Logos & Brand Walls",
    description:
      "Your brand, shaped in natural moss. A look at how custom logo installations are designed and crafted.",
  },
  {
    id: "video-4",
    videoId: "xYrj4UhqQvM",
    title: "Behind the Scenes at Green Art Factory",
    description:
      "A glimpse into our workshop and the craftsmanship that goes into every moss and greenery project.",
  },
  {
    id: "video-5",
    videoId: "_Y4vZ1OMbUg",
    title: "Moss Art Panels & Frames",
    description:
      "Textured, handcrafted moss artworks that add warmth and character to offices, hotels and homes.",
  },
  {
    id: "video-6",
    videoId: "5yrt1XcUb1k",
    title: "Our Latest Project Walkthrough",
    description:
      "Take a tour of a recently completed installation and see the finished space in detail.",
  },
];

const CHANNEL_URL = "https://www.youtube.com/@greenmosswall";

function VideoCard({ video, priority }) {
  return (
    <div className="latestVideosCard">
      <div className="latestVideosFrame">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          loading={priority ? "eager" : "lazy"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="latestVideosIframe"
        />
      </div>

      <h3 className="latestVideosCardTitle">{video.title}</h3>
      {video.description && (
        <p className="latestVideosCardDescription">{video.description}</p>
      )}
    </div>
  );
}

export default function LatestVideos({
  videos = DEFAULT_VIDEOS,
  eyebrow = "Our Channel",
  title = "Watch Our Latest Videos",
  description = "See our installations, process, and green design ideas in motion.",
  channelUrl = CHANNEL_URL,
}) {
  return (
    <section className="latestVideosSection" aria-label="Latest videos">
      <div className="latestVideosInner">
        <div className="latestVideosHeader">
          <div className="latestVideosHeaderText">
            <span className="latestVideosEyebrow">{eyebrow}</span>
            <h2 className="latestVideosTitle">{title}</h2>
            <p className="latestVideosDescription">{description}</p>
          </div>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="latestVideosCta"
          >
            <span>Visit Our Channel</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17L17 7M17 7H8M17 7V16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="latestVideosGrid">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}