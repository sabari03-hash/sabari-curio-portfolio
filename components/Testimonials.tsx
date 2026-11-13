"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/content/site";
import { Pause, Play } from "./Icons";
import Reveal from "./Reveal";

const ROTATE_MS = 4000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // user pressed pause
  const [hovering, setHovering] = useState(false); // pointer/focus inside
  const count = testimonials.length;

  useEffect(() => {
    if (count < 2 || paused || hovering) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, hovering]);

  if (count === 0) return null;

  return (
    <section className="section" id="feedback" aria-labelledby="feedback-title">
      <div className="container">
        <Reveal className="section-head" >
          <div>
            <div className="eyebrow">06 · Feedback</div>
            <h2 className="section-title" id="feedback-title">
              What <span className="accent">clients say</span>
            </h2>
          </div>
        </Reveal>

        <Reveal
          className="quotes"
          aria-roledescription="carousel"
          aria-label="Client feedback"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          <div className="quote-stage" aria-live={paused ? "polite" : "off"}>
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className={`quote glass ${i === index ? "active" : ""}`}
                aria-hidden={i !== index}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                style={{ margin: 0 }}
              >
                {t.sample && <span className="sample-badge">Sample</span>}
                <span className="mark" aria-hidden>
                  &ldquo;
                </span>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="q-avatar" src={t.avatar} alt="" loading="lazy" />
                  ) : (
                    <span className="q-avatar" aria-hidden>
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span className="q-who">
                    <strong>{t.name}</strong>
                    {t.role && <span>{t.role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {count > 1 && (
            <div className="quote-controls">
              <button
                type="button"
                className="pause-btn"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume auto-rotate" : "Pause auto-rotate"}
              >
                {paused ? <Play /> : <Pause />}
              </button>
              <div className="dots" role="group" aria-label="Choose feedback">
                {testimonials.map((t, i) => (
                  <button
                    type="button"
                    key={i}
                    aria-label={`Show feedback ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
