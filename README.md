# Curio — portfolio

> It starts with a question.

Portfolio site for **Curio**, a YouTube channel focused on video editing and motion graphics.
Dark, cinematic, glassy, with a 3D parrot you can pet to flip the card and see who's behind the channel.

Built with **Next.js + React + Three.js** (react-three-fiber). It exports as a plain static site, so hosting is free.

---

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev        # open http://localhost:3000
```

```bash
npm run build      # builds the static site into /out
npm start          # preview the built site
```

---

## Updating content (no coding needed)

**Everything on the site comes from one file: [`content/site.ts`](content/site.ts).**
Open it, change the text between the quotes, save. Lines marked `✏️ PLACEHOLDER` are the ones to replace with your real details.

Media files go in the `public/` folder:

| Folder | What goes there | Used as |
| --- | --- | --- |
| `public/videos/` | your edits (`.mp4`, ideally under 20 MB each) | `"/videos/name.mp4"` |
| `public/thumbnails/` | cover images for those videos (`.jpg`, 1280×720) | `"/thumbnails/name.jpg"` |
| `public/instagram/` | screenshots/covers of your Instagram posts | `"/instagram/name.jpg"` |
| `public/profile/` | your photo (square, e.g. 600×600), client photos | `"/profile/photo.jpg"` |
| `public/resume/` | your CV | `"/resume/resume.pdf"` |

Anything you leave empty shows a neat "coming soon" state, so the site never looks broken.

### ➕ Add a video (showreel / projects)

1. Copy the video to `public/videos/my-edit.mp4` and a cover image to `public/thumbnails/my-edit.jpg`.
2. In `content/site.ts`, find `export const videos` and add an entry inside the `[ ]`:

```ts
export const videos: Video[] = [
  {
    id: "my-edit",
    title: "Why do cats knock things over?",
    description: "Explainer edit with kinetic type and sound design.",
    src: "/videos/my-edit.mp4",
    poster: "/thumbnails/my-edit.jpg",
    tags: ["Explainer", "Motion graphics"],
    featured: true, // ← this one becomes the big "master video"
  },
  {
    id: "reel-02",
    title: "60-second fact reel",
    src: "/videos/reel-02.mp4",
    poster: "/thumbnails/reel-02.jpg",
    aspect: "9:16", // vertical video
  },
];
```

- The video marked `featured: true` (or the first one) is the big master video. All others go in the sideways-scrolling row.
- Videos play automatically after a visitor stays on them for 2 seconds, and pause when they move away.
- Already on YouTube? Skip the file and use `youtubeId: "dQw4w9WgXcQ"` (the part after `watch?v=`) instead of `src`. The thumbnail is fetched automatically.
- Big files: if a video is over ~50 MB, upload it to YouTube (unlisted is fine) and use `youtubeId`, or host it elsewhere and put the full `https://...mp4` link in `src`.

### ➕ Add a client testimonial

In `content/site.ts`, find `export const testimonials` and add:

```ts
{
  quote: "Our watch time doubled after K took over the edits.",
  name: "Priya S.",
  role: "Tech YouTuber, 120K subs",
  avatar: "/profile/priya.jpg", // optional
},
```

The three entries with `sample: true` are placeholders and show a "Sample" badge. **Delete them** once you have real feedback. Cards rotate every 4 seconds and pause on hover.

### ➕ Add Instagram posts

Put a cover image in `public/instagram/` and add to `instagramPosts`:

```ts
{ url: "https://www.instagram.com/reel/XXXXXXXX/", image: "/instagram/reel-01.jpg", caption: "Travel edit", reel: true },
```

Also set your profile link and handle in `socials.instagram`.

### ➕ Add YouTube videos

Add to `youtubeVideos` (thumbnails load automatically):

```ts
{ youtubeId: "dQw4w9WgXcQ", title: "What if the moon disappeared?" },
{ youtubeId: "abc123XYZ00", title: "60-second fact", short: true },
```

Set your channel link and handle in `socials.youtube`.

### Your personal details (back of the parrot card)

Edit `profile` (name, photo, two-line bio, education, skills, resume) and `contact` (email, phone, WhatsApp) in `content/site.ts`.
For WhatsApp, use your number with country code and digits only, e.g. `"919876543210"`.

### Skills & tools

Edit the `tools` list. `level` is 0–100 and draws the glowing bar. `badge` is the 2-letter icon.

---

## Contact form setup

The form works out of the box: with no setup it opens the visitor's email app with their message already filled in (addressed to `contact.email`).

For messages delivered straight to your inbox (free, 50 per month):

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy the form id from its endpoint, e.g. `https://formspree.io/f/xyzabcd` → `xyzabcd`.
3. Paste it in `content/site.ts`: `formspreeId: "xyzabcd"`.
4. Redeploy. The first submission asks you to confirm your email in Formspree.

---

## Deploy for free

### Option A: Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub and import `sabari-curio-portfolio`.
3. Leave every setting as detected (Framework: Next.js) and click **Deploy**.

You get a free link like `curio-portfolio.vercel.app`. Every push to `main` updates the site automatically.

### Option B: Netlify

1. Go to [app.netlify.com/start](https://app.netlify.com/start) and connect the GitHub repo.
2. Settings are read from `netlify.toml` (build command `npm run build`, publish folder `out`). Click **Deploy**.

You get a free link like `curio-portfolio.netlify.app`.

**Workflow after that:** edit `content/site.ts` (you can even do it on github.com with the pencil icon), commit, and the site redeploys in about a minute.

---

## What's inside

```
content/site.ts          ← all text, links, videos, testimonials (edit this)
public/                  ← your media files
app/                     ← page layout, global styles, theme colours
components/
  ParrotScene.tsx        ← the 3D parrot, built from code (blinks, tilts, follows the mouse, reacts to scroll)
  Hero.tsx               ← intro + flip card (front: parrot, back: about you)
  DwellVideo.tsx         ← video tile that plays after 2s and pauses when you leave
  Work.tsx               ← master video + horizontal project row
  Socials.tsx            ← Instagram + YouTube showcases
  Skills.tsx, Contact.tsx, Testimonials.tsx, Nav.tsx, Footer.tsx
```

- **Theme:** dark by default, with a light mode toggle (top right). Colours live at the top of `app/globals.css`.
- **Performance:** the 3D parrot loads after the page and stops rendering when it's off screen or flipped. Videos only download when they start playing.
- **Accessibility:** respects "reduce motion" (no autoplay, no idle animation), keyboard-friendly flip button, pausable testimonials.
