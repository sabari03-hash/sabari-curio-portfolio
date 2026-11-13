/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site becomes plain HTML/JS in /out,
  // so it deploys for free on Vercel, Netlify, GitHub Pages, anywhere.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
