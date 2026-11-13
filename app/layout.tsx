import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"], display: "swap" });

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: `${brand.name}: ${brand.intro}`,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.intro,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030807" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f3" },
  ],
};

// Sets the saved theme before the page paints (dark by default) to avoid a flash.
const themeScript = `try{var t=localStorage.getItem('curio-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
