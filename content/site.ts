/**
 * ─────────────────────────────────────────────────────────────
 *  CURIO — SITE CONTENT
 *  This is the ONLY file you need to edit to update the website.
 *  Every section reads from here. Empty lists show a tidy
 *  "coming soon" state, so nothing ever looks broken.
 *
 *  Anything marked  ✏️ PLACEHOLDER  should be replaced with your
 *  real details. See README.md → "Updating content" for examples.
 * ─────────────────────────────────────────────────────────────
 */

/* ---------- Types (you don't need to change these) ---------- */

export type Video = {
  /** Short unique id, e.g. "travel-reel-01" */
  id: string;
  title: string;
  description?: string;
  /** A file in /public/videos (e.g. "/videos/my-edit.mp4") or a full https URL to an .mp4/.webm */
  src?: string;
  /** Alternative to src: a YouTube video id (the part after watch?v=) */
  youtubeId?: string;
  /** Cover image, e.g. "/thumbnails/my-edit.jpg". Optional for YouTube videos. */
  poster?: string;
  /** Small labels shown on the card, e.g. ["Motion graphics", "Reel"] */
  tags?: string[];
  /** Shown as the big "master video" at the top. Only one should be true. */
  featured?: boolean;
  /** "16:9" (default) or "9:16" for vertical reels/shorts */
  aspect?: "16:9" | "9:16";
};

export type InstagramPost = {
  /** Link to the post, e.g. "https://www.instagram.com/p/XXXX/" */
  url: string;
  /** Image in /public/instagram, e.g. "/instagram/reel-01.jpg" */
  image?: string;
  caption?: string;
  /** true if it is a reel (shows a play icon) */
  reel?: boolean;
};

export type YouTubeVideo = {
  /** The id after watch?v=  e.g. for youtube.com/watch?v=dQw4w9WgXcQ use "dQw4w9WgXcQ" */
  youtubeId: string;
  title: string;
  /** true for YouTube Shorts (vertical) */
  short?: boolean;
};

export type Tool = {
  name: string;
  /** 2-letter badge shown on the card */
  badge: string;
  /** Badge colour (any CSS colour) */
  color: string;
  /** 0–100, drawn as a glowing bar */
  level: number;
  note?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  /** Optional photo in /public, e.g. "/profile/client-1.jpg" */
  avatar?: string;
  /** true = sample text. Shows a "Sample" badge. Delete samples once you have real feedback. */
  sample?: boolean;
};

/* ---------- Brand ---------- */

export const brand = {
  name: "Curio",
  tagline: "It starts with a question.",
  /** Line under the tagline on the front card */
  intro: "Faceless storytelling, video editing and motion graphics.",
  /** Small hint shown above the parrot */
  petHint: "Pet me to see inside me",
};

/* ---------- About you (back of the parrot card) ---------- */

export const profile = {
  name: "K", // ✏️ PLACEHOLDER — your name as you want it shown
  role: "Video Editor & Motion Designer",
  /** ✏️ PLACEHOLDER — put a square photo at /public/profile/photo.jpg and set "/profile/photo.jpg". Empty = shows a monogram. */
  photo: "",
  /** Exactly two short lines */
  bio: [
    "I turn curious questions into tight, cinematic edits.", // ✏️ PLACEHOLDER
    "Pacing, sound and motion that keep people watching till the end.", // ✏️ PLACEHOLDER
  ],
  education: {
    degree: "B.Tech in Information Technology", // ✏️ PLACEHOLDER
    status: "Final year",
    school: "Your College Name", // ✏️ PLACEHOLDER
    years: "2023 – 2027", // ✏️ PLACEHOLDER
  },
  skills: [
    "Video editing",
    "Motion graphics",
    "Colour grading",
    "Sound design",
    "Storytelling",
    "Thumbnail design",
  ],
  /** ✏️ PLACEHOLDER — put your CV at /public/resume/resume.pdf and set "/resume/resume.pdf". Empty = button shows "coming soon". */
  resume: "",
};

/* ---------- Contact details ---------- */

export const contact = {
  email: "your.email@example.com", // ✏️ PLACEHOLDER
  phone: "+91 00000 00000", // ✏️ PLACEHOLDER (shown as written)
  /** ✏️ PLACEHOLDER — WhatsApp number with country code, digits only, e.g. "919876543210" */
  whatsapp: "910000000000",
  /**
   * Contact form delivery. Leave empty to use the email fallback
   * (the form opens the visitor's mail app with the message filled in).
   * For real form delivery, create a free form at https://formspree.io
   * and paste its id here, e.g. "xyzabcd" (from https://formspree.io/f/xyzabcd).
   */
  formspreeId: "",
};

/* ---------- Social links ---------- */

export const socials = {
  instagram: {
    handle: "@curio", // ✏️ PLACEHOLDER
    url: "https://www.instagram.com/", // ✏️ PLACEHOLDER — your profile URL
  },
  youtube: {
    name: "Curio",
    handle: "@curio", // ✏️ PLACEHOLDER
    url: "https://www.youtube.com/", // ✏️ PLACEHOLDER — your channel URL
  },
};

/* ---------- 1) Videos: master video + horizontal project reel ---------- */
/*
 * Add a video:
 *   1. Drop the file in /public/videos   (e.g. my-edit.mp4, keep it under ~20 MB)
 *   2. Drop a cover image in /public/thumbnails (e.g. my-edit.jpg)
 *   3. Add an entry below. Set featured: true on the one you want at the top.
 *
 * Example:
 *   {
 *     id: "my-edit",
 *     title: "Why do cats knock things over?",
 *     description: "Explainer edit with kinetic type and sound design.",
 *     src: "/videos/my-edit.mp4",
 *     poster: "/thumbnails/my-edit.jpg",
 *     tags: ["Explainer", "Motion graphics"],
 *     featured: true,
 *   },
 *
 * Or use a YouTube video instead of a file:
 *   { id: "yt-1", title: "My best edit", youtubeId: "dQw4w9WgXcQ" },
 */
export const videos: Video[] = [];

/* ---------- 2) Instagram showcase ---------- */
/*
 * Example:
 *   { url: "https://www.instagram.com/reel/XXXX/", image: "/instagram/reel-01.jpg", caption: "60s edit", reel: true },
 */
export const instagramPosts: InstagramPost[] = [];

/* ---------- 3) YouTube showcase ---------- */
/*
 * Example:
 *   { youtubeId: "dQw4w9WgXcQ", title: "What if the moon disappeared?" },
 *   { youtubeId: "abc123XYZ00", title: "60-second fact", short: true },
 */
export const youtubeVideos: YouTubeVideo[] = [];

/* ---------- 4) Skills & tools ---------- */

export const tools: Tool[] = [
  { name: "Premiere Pro", badge: "Pr", color: "#9999ff", level: 90, note: "Story edits, pacing, multicam" },
  { name: "After Effects", badge: "Ae", color: "#cf96fd", level: 85, note: "Motion graphics, kinetic type, VFX" },
  { name: "DaVinci Resolve", badge: "Da", color: "#ff7b5c", level: 75, note: "Colour grading, Fusion" },
  { name: "Photoshop", badge: "Ps", color: "#31a8ff", level: 80, note: "Thumbnails, compositing" },
  { name: "Audition", badge: "Au", color: "#00e4bb", level: 70, note: "Sound design, voice clean-up" },
  { name: "Blender", badge: "Bl", color: "#f5792a", level: 50, note: "Simple 3D scenes" },
];

/* ---------- 6) Client feedback ---------- */
/*
 * The three below are SAMPLES (they show a "Sample" badge).
 * Replace them with real feedback and remove `sample: true`.
 */
export const testimonials: Testimonial[] = [
  {
    quote: "Sample feedback — the edit kept our audience hooked from the first second. Replace this with a real client quote.",
    name: "Client Name",
    role: "YouTube creator",
    sample: true,
  },
  {
    quote: "Sample feedback — fast turnaround, clean motion graphics and great communication throughout.",
    name: "Client Name",
    role: "Brand / Agency",
    sample: true,
  },
  {
    quote: "Sample feedback — our reels started getting far more watch time after the new editing style.",
    name: "Client Name",
    role: "Instagram creator",
    sample: true,
  },
];
