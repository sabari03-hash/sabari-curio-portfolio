"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/content/site";
import { Film, Mute, Play, Volume } from "./Icons";
import { useNoHover, useReducedMotion } from "./hooks";

const DWELL_MS = 2000;

export function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * A video tile that starts playing once the visitor has stayed on it for
 * 2 seconds (hover on desktop, on-screen on phones) and pauses when they leave.
 * Works with a local/hosted video file (src) or a YouTube id.
 * With no video at all it shows a "coming soon" panel.
 */
export default function DwellVideo({
  video,
  emptyTitle = "Coming soon",
  emptyText = "A new edit is on the timeline.",
  large = false,
}: {
  video?: Video;
  emptyTitle?: string;
  emptyText?: string;
  large?: boolean;
}) {
  const reduced = useReducedMotion();
  const noHover = useNoHover();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [dwelling, setDwelling] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const vertical = video?.aspect === "9:16";
  const hasFile = !!video?.src;
  const hasYouTube = !hasFile && !!video?.youtubeId;

  const start = useCallback(() => {
    setDwelling(false);
    setPlaying(true);
    const v = videoRef.current;
    if (v) v.play().catch(() => setPlaying(false));
  }, []);

  const stop = useCallback(() => {
    window.clearTimeout(timer.current);
    setDwelling(false);
    setPlaying(false);
    videoRef.current?.pause();
  }, []);

  const beginDwell = useCallback(() => {
    if (reduced || playing) return; // reduced motion: only play when clicked
    window.clearTimeout(timer.current);
    setDwelling(true);
    timer.current = window.setTimeout(start, DWELL_MS);
  }, [reduced, playing, start]);

  // Touch devices: dwell = the tile stays mostly on screen for 2s
  useEffect(() => {
    if (!noHover || !video || (!hasFile && !hasYouTube)) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.intersectionRatio >= 0.7 ? beginDwell() : stop()),
      { threshold: [0, 0.7] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [noHover, video, hasFile, hasYouTube, beginDwell, stop]);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVis = () => document.hidden && stop();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(timer.current);
    };
  }, [stop]);

  if (!video || (!hasFile && !hasYouTube)) {
    return (
      <div className={`media empty ${vertical ? "vertical" : ""}`}>
        <div className="scan" />
        <div className="empty-inner">
          <div className="ring">
            <Film />
          </div>
          <strong>{video?.title ?? emptyTitle}</strong>
          <span style={{ fontSize: large ? "0.95rem" : "0.82rem" }}>{emptyText}</span>
        </div>
      </div>
    );
  }

  const poster = video.poster ?? (video.youtubeId ? ytThumb(video.youtubeId) : undefined);

  return (
    <div
      ref={wrapRef}
      className={`media ${vertical ? "vertical" : ""} ${dwelling ? "dwelling" : ""} ${playing ? "playing" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && beginDwell()}
      onPointerLeave={(e) => e.pointerType === "mouse" && stop()}
    >
      {hasFile ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={poster}
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label={video.title}
        />
      ) : playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${video.youtubeId}`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" loading="lazy" />
      )}

      {!reduced && <span className="media-badge">{noHover ? "Stay here 2s to play" : "Hover 2s to play"}</span>}
      <div className="dwell-bar" aria-hidden />

      <button type="button" className="play-btn" onClick={start} aria-label={`Play ${video.title}`}>
        <Play />
      </button>

      {hasFile && playing && (
        <button
          type="button"
          className="sound-btn"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <Mute /> : <Volume />}
        </button>
      )}
    </div>
  );
}
