"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getYoutubeVideosRequest } from "../../redux/YoutubeVideos/actions"; // adjust path to match your folders

const CHANNEL_URL = "https://www.youtube.com/@greenmosswall";

// Prefer the embed link from the API; fall back to building one from the id
function getEmbedSrc(video) {
  const base =
    video.embed_url ||
    (video.video_id
      ? `https://www.youtube-nocookie.com/embed/${video.video_id}`
      : null);

  if (!base) return null;
  return `${base}${base.includes("?") ? "&" : "?"}rel=0`;
}

function VideoCard({ video, index, priority }) {
  const src = getEmbedSrc(video);
  if (!src) return null;

  // The API doesn't send titles yet; this keeps the iframe accessible and
  // shows real titles automatically if the API starts returning them.
  const iframeTitle = video.title || `Green Art Factory video ${index + 1}`;

  return (
    <div className="latestVideosCard">
      <div className="latestVideosFrame">
        <iframe
          src={src}
          title={iframeTitle}
          loading={priority ? "eager" : "lazy"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="latestVideosIframe"
        />
      </div>

      {video.title && <h3 className="latestVideosCardTitle">{video.title}</h3>}
      {video.description && (
        <p className="latestVideosCardDescription">{video.description}</p>
      )}
    </div>
  );
}

export default function LatestVideos({
  eyebrow = "Our Channel",
  title = "Watch Our Latest Videos",
  description = "See our installations, process, and green design ideas in motion.",
  channelUrl = CHANNEL_URL,
  limit = 6, // how many videos to show; pass a bigger number to show more
}) {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.YoutubeVideos ?? {}
  );

  useEffect(() => {
    dispatch(getYoutubeVideosRequest());
  }, [dispatch]);

  const videos = (data ?? []).slice(0, limit);

  // Nothing to show: hide the whole section instead of an empty heading
  if (!loading && (error || videos.length === 0)) {
    return null;
  }

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

        {loading && videos.length === 0 ? (
          <p className="latestVideosDescription" role="status">
            Loading videos…
          </p>
        ) : (
          <div className="latestVideosGrid">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id ?? video.video_id}
                video={video}
                index={i}
                priority={i === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}