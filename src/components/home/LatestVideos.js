"use client";


const DEFAULT_VIDEOS = [
  {
    id: "video-1",
    videoId: "vfh6bi7jkDk",
    title: "Valentine’s Day Special – Limited Time Offer! ",
    description: "Choose from our stunning red rose bouquets – classic, elegant, and guaranteed to make hearts flutter!",
  },
  {
    id: "video-2",
    videoId: "dLCNL6UOHgw",
    title: "Customised Flower Bouquets Just for You!",
    description: "Our expertise lies in creating unique, personalised flower bouquets tailored to your desires. Whether it’s for a special occasion or a heartfelt gift, we design each bouquet to match your vision perfectly.",
  },
  {
    id: "video-3",
    videoId: "Tkadi2qgJ50",
    title: "Grand Opening Ceremony Flower Decor! ",
    description: "Make your event unforgettable with our exquisite flower decor arrangements, crafted to bring elegance and charm to your special day. ",
  },
  {
    id: "video-4",
    videoId: "k-Uzrmrp8E4",
    title: "Future looks so green! ",
    description: "We at Green Art Factory (GAF) are delighted to be a part of the Dubai International Academy Winter Souk, an event that brings together creativity, community, and sustainability.",
  },
  {
    id: "video-5",
    videoId: "RHFO6IqkPrQ",
    title: "Tolerance Day Festival GAF Plants Stall",
    description: "We were thrilled to be part of the Tolerance Day Festival at Collegiate International School, showcasing our stunning collection at the GAF Plants Stall. Celebrating diversity and unity through nature, our display featured a variety of greenery solutions, from lush indoor plants to artistic arrangements, inspiring sustainable and inclusive spaces.",
  },
  {
    id: "video-6",
    videoId: "v7_MoCsVjNM",
    title: "Indoor Plants!",
    description: "Breathe life into your home or office with our vibrant indoor plants. 🌱 From lush greens to elegant designs, create a fresh and calming atmosphere effortlessly! ",
  },
];

const CHANNEL_URL = "https://youtube.com/@greenartfactory";

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