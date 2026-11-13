"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { brand, contact, profile } from "@/content/site";
import { Download, Flip, Mail, Phone, WhatsApp } from "./Icons";
import { useInView, useReducedMotion } from "./hooks";

// Three.js is heavy: load it only in the browser, after the page is interactive.
const ParrotScene = dynamic(() => import("./ParrotScene"), {
  ssr: false,
  loading: () => (
    <div className="parrot-fallback" aria-hidden>
      <div className="egg" />
    </div>
  ),
});

export default function Hero() {
  const [flipped, setFlipped] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reduced = useReducedMotion();
  const [stageRef, stageVisible] = useInView<HTMLDivElement>({ threshold: 0.05 });
  const flipTimer = useRef<number | undefined>(undefined);
  const backRef = useRef<HTMLDivElement>(null);
  const frontBtnRef = useRef<HTMLButtonElement>(null);

  const flipTo = useCallback((value: boolean) => {
    setFlipped(value);
    // move keyboard focus to the newly visible side
    window.setTimeout(() => {
      if (value) backRef.current?.focus({ preventScroll: true });
      else frontBtnRef.current?.focus({ preventScroll: true });
    }, 50);
  }, []);

  // Petting: let the parrot squish happily first, then flip
  const onPet = useCallback(() => {
    window.clearTimeout(flipTimer.current);
    flipTimer.current = window.setTimeout(() => setFlipped(true), reduced ? 0 : 650);
  }, [reduced]);

  useEffect(() => () => window.clearTimeout(flipTimer.current), []);

  const initial = profile.name.trim().charAt(0).toUpperCase() || "C";
  const whatsappUrl = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;
  const telUrl = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="hero" id="top" aria-label="Intro">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="kicker">Video editing · Motion graphics</span>
          <h1 className="hero-title">{brand.name}</h1>
          <p className="hero-tagline">
            It starts with a <em>question.</em>
          </p>
          <p className="hero-intro">{brand.intro}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#work">
              See the work
            </a>
            <a className="btn" href="#contact">
              Work with me
            </a>
          </div>
        </div>

        <div className={`flip ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-inner">
            {/* FRONT — the parrot */}
            <div className="flip-face flip-front glass" aria-hidden={flipped}>
              <p className="pet-hint">
                <span className="paw" aria-hidden>
                  ✋
                </span>
                {brand.petHint}
              </p>
              <div className="parrot-stage" ref={stageRef}>
                <ParrotScene onPet={onPet} reduced={reduced} active={stageVisible && !flipped} />
              </div>
              <div className="card-foot">
                <div className="card-name">
                  {brand.name}
                  <small>{brand.tagline}</small>
                </div>
                <button
                  ref={frontBtnRef}
                  type="button"
                  className="flip-btn"
                  onClick={() => flipTo(true)}
                  aria-label="Flip the card to see who is behind Curio"
                >
                  <Flip /> Flip
                </button>
              </div>
            </div>

            {/* BACK — the person behind Curio */}
            <div
              className="flip-face flip-back glass"
              aria-hidden={!flipped}
              ref={backRef}
              tabIndex={-1}
              aria-label="About me"
            >
              <div className="me-head">
                {profile.photo && !photoFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="me-photo"
                    src={profile.photo}
                    alt={profile.name}
                    loading="lazy"
                    onError={() => setPhotoFailed(true)}
                  />
                ) : (
                  <div className="me-photo" aria-hidden>
                    {initial}
                  </div>
                )}
                <div>
                  <h2 className="me-name">{profile.name}</h2>
                  <div className="me-role">{profile.role}</div>
                </div>
              </div>

              <p className="me-bio">
                {profile.bio.slice(0, 2).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <div className="me-block">
                <h3>Education</h3>
                <div className="me-edu">
                  <strong>{profile.education.degree}</strong>
                  <span>
                    {profile.education.status} · {profile.education.school} · {profile.education.years}
                  </span>
                </div>
              </div>

              <div className="me-block">
                <h3>Skills</h3>
                <ul className="chips">
                  {profile.skills.map((s) => (
                    <li className="chip" key={s}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="me-contact">
                <a href={`mailto:${contact.email}`}>
                  <Mail />
                  Email
                </a>
                <a href={telUrl}>
                  <Phone />
                  Call
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsApp />
                  WhatsApp
                </a>
              </div>

              <div className="me-actions">
                {profile.resume ? (
                  <a className="btn btn-primary" href={profile.resume} download>
                    <Download /> Download resume
                  </a>
                ) : (
                  <span className="btn" aria-disabled="true" title="Add your resume in content/site.ts">
                    <Download /> Resume coming soon
                  </span>
                )}
                <button type="button" className="flip-btn" onClick={() => flipTo(false)}>
                  <Flip /> Back to Curio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#work" aria-label="Scroll to work">
        Scroll
        <span />
      </a>
    </section>
  );
}
