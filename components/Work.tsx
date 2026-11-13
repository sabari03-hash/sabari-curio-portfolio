"use client";

import { useRef } from "react";
import { videos, type Video } from "@/content/site";
import DwellVideo from "./DwellVideo";
import { ArrowLeft, ArrowRight } from "./Icons";
import Reveal from "./Reveal";

// Placeholder tiles shown until real projects are added in content/site.ts
const COMING_SOON: Video[] = [
  { id: "soon-1", title: "Explainer edit", description: "Kinetic type, sound design and pacing.", tags: ["Coming soon"] },
  { id: "soon-2", title: "Short-form reel", description: "Vertical edit built for retention.", tags: ["Coming soon"] },
  { id: "soon-3", title: "Motion graphics", description: "Animated titles and lower thirds.", tags: ["Coming soon"] },
  { id: "soon-4", title: "Colour grade", description: "Before / after cinematic look.", tags: ["Coming soon"] },
];

export default function Work() {
  const reelRef = useRef<HTMLDivElement>(null);
  const master = videos.find((v) => v.featured) ?? videos[0];
  const rest = videos.filter((v) => v !== master);
  const projects = rest.length ? rest : COMING_SOON;

  const scrollBy = (dir: 1 | -1) => {
    const el = reelRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">01 · Showreel</div>
            <h2 className="section-title" id="work-title">
              The <span className="accent">master cut</span>
            </h2>
            <p className="section-sub">Stay on a video for two seconds and it starts playing. Move away and it pauses.</p>
          </div>
        </Reveal>

        <Reveal className="master glass glass-glow">
          <DwellVideo
            video={master}
            large
            emptyTitle="The showreel is in the edit bay"
            emptyText="First cut dropping soon. Questions take time to answer well."
          />
          {master && (
            <div className="master-meta">
              <div>
                <h3>{master.title}</h3>
                {master.description && <p>{master.description}</p>}
              </div>
              {master.tags && (
                <ul className="tags chips">
                  {master.tags.map((t) => (
                    <li className="chip" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Reveal>

        <div className="reel-head">
          <h3>More projects</h3>
          <div className="reel-nav">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous projects">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Next projects">
              <ArrowRight />
            </button>
          </div>
        </div>

        <div className="reel" ref={reelRef} tabIndex={0} aria-label="Projects, scroll sideways">
          {projects.map((v) => (
            <article className="reel-card glass glass-glow" key={v.id}>
              <DwellVideo video={v} />
              <div className="reel-card-body">
                <h4>{v.title}</h4>
                {v.description && <p>{v.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
