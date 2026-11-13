"use client";

import { instagramPosts, socials, youtubeVideos } from "@/content/site";
import DwellVideo from "./DwellVideo";
import { External, Instagram as IgIcon, Reel, YouTube as YtIcon } from "./Icons";
import Reveal from "./Reveal";

export function InstagramShowcase() {
  const posts = instagramPosts;
  const ghosts = Math.max(0, 6 - posts.length);
  return (
    <section className="section" id="instagram" aria-labelledby="ig-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">02 · Instagram</div>
            <h2 className="section-title" id="ig-title">
              Reels &amp; <span className="accent">quick cuts</span>
            </h2>
            <p className="section-sub">Short, punchy edits made for the scroll.</p>
          </div>
        </Reveal>

        <div className="social-wrap">
          <Reveal className="profile-card glass">
            <div className="avatar">
              <div>
                <IgIcon />
              </div>
            </div>
            <div>
              <h3>{socials.instagram.handle}</h3>
              <p>Behind-the-scenes, reels and edit breakdowns.</p>
            </div>
            <a className="btn btn-primary" href={socials.instagram.url} target="_blank" rel="noopener noreferrer">
              Open Instagram <External />
            </a>
          </Reveal>

          <Reveal className="grid-posts" delay={120}>
            {posts.map((p) => (
              <a className="post" key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.caption ?? "Instagram post"}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" loading="lazy" />
                )}
                {p.reel && (
                  <span className="post-type">
                    <Reel />
                  </span>
                )}
                {p.caption && <span className="post-cap">{p.caption}</span>}
              </a>
            ))}
            {Array.from({ length: ghosts }).map((_, i) => (
              <div className="post ghost" key={`g${i}`} aria-hidden>
                <IgIcon />
              </div>
            ))}
            {posts.length === 0 && <p className="empty-note">New reels landing soon. Follow along on Instagram.</p>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function YouTubeShowcase() {
  const vids = youtubeVideos;
  return (
    <section className="section" id="youtube" aria-labelledby="yt-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">03 · YouTube</div>
            <h2 className="section-title" id="yt-title">
              Questions, <span className="accent">answered</span>
            </h2>
            <p className="section-sub">Stories and edits on the {socials.youtube.name} channel.</p>
          </div>
        </Reveal>

        <div className="social-wrap">
          <Reveal className="profile-card glass">
            <div className="avatar">
              <div>
                <YtIcon />
              </div>
            </div>
            <div>
              <h3>{socials.youtube.name}</h3>
              <p>
                {socials.youtube.handle} · It starts with a question.
              </p>
            </div>
            <a className="btn btn-primary" href={socials.youtube.url} target="_blank" rel="noopener noreferrer">
              Visit the channel <External />
            </a>
          </Reveal>

          <Reveal className="yt-grid" delay={120}>
            {(vids.length ? vids : [null, null]).map((v, i) => (
              <article className="yt-card glass glass-glow" key={v?.youtubeId ?? `empty${i}`}>
                <DwellVideo
                  video={
                    v
                      ? { id: v.youtubeId, title: v.title, youtubeId: v.youtubeId, aspect: v.short ? "9:16" : "16:9" }
                      : undefined
                  }
                  emptyTitle="Next upload"
                  emptyText="A new question is being researched."
                />
                <h4>{v ? v.title : "Coming soon"}</h4>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
