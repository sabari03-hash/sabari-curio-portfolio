"use client";

import { useState, type FormEvent } from "react";
import type React from "react";
import { contact, socials } from "@/content/site";
import { Instagram, Mail, Phone, Send, WhatsApp, YouTube } from "./Icons";
import Reveal from "./Reveal";

type Status = { kind: "idle" | "sending" | "ok" | "err"; text?: string };

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return; // bot

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const project = String(data.get("project") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Option A: Formspree (free) — real delivery to your inbox
    if (contact.formspreeId) {
      setStatus({ kind: "sending", text: "Sending…" });
      try {
        const res = await fetch(`https://formspree.io/f/${contact.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus({ kind: "ok", text: "Thanks! Your message is on its way. I'll reply soon." });
      } catch {
        setStatus({ kind: "err", text: `Couldn't send right now. Please email ${contact.email} directly.` });
      }
      return;
    }

    // Option B: no setup — open the visitor's email app with everything filled in
    const subject = encodeURIComponent(`Project enquiry${project ? ` · ${project}` : ""} — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setStatus({ kind: "ok", text: "Your email app should open with the message ready to send." });
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">05 · Contact</div>
            <h2 className="section-title" id="contact-title">
              Got a <span className="accent">question?</span>
            </h2>
            <p className="section-sub">Tell me about your video. I usually reply within a day.</p>
          </div>
        </Reveal>

        <div className="contact-wrap">
          <Reveal className="contact-side glass">
            <h3>Let&apos;s make something people finish watching.</h3>
            <p>Edits, reels, motion graphics and channel packaging.</p>
            <div className="contact-lines">
              <a href={`mailto:${contact.email}`}>
                <Mail /> {contact.email}
              </a>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
                <Phone /> {contact.phone}
              </a>
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                <WhatsApp /> Chat on WhatsApp
              </a>
              <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer">
                <Instagram /> {socials.instagram.handle}
              </a>
              <a href={socials.youtube.url} target="_blank" rel="noopener noreferrer">
                <YouTube /> {socials.youtube.name}
              </a>
            </div>
          </Reveal>

          <Reveal as="form" className="form glass" delay={120} onSubmit={onSubmit as unknown as React.FormEventHandler<HTMLElement>}>
            <FormFields status={status} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FormFields({ status }: { status: Status }) {
  return (
    <>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-project">Project type</label>
        <select id="cf-project" name="project" defaultValue="">
          <option value="">Choose one (optional)</option>
          <option>YouTube video edit</option>
          <option>Reels / Shorts</option>
          <option>Motion graphics</option>
          <option>Colour grading</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required placeholder="What are we making?" />
      </div>
      <input className="hp" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden />
      <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
        <Send /> {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className={`form-status ${status.kind === "ok" ? "ok" : status.kind === "err" ? "err" : ""}`} role="status" aria-live="polite">
        {status.text}
      </p>
    </>
  );
}
