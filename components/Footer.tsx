import { brand, contact, socials } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>
          © {new Date().getFullYear()} {brand.name} · {brand.tagline}
        </span>
        <div className="footer-links">
          <a href={socials.youtube.url} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
