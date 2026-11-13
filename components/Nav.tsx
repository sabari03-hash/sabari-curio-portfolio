import { brand } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  ["#work", "Work"],
  ["#instagram", "Instagram"],
  ["#youtube", "YouTube"],
  ["#skills", "Skills"],
  ["#feedback", "Feedback"],
] as const;

export default function Nav() {
  return (
    <header className="nav glass">
      <a className="nav-logo" href="#top" aria-label={`${brand.name} home`}>
        <span className="dot" aria-hidden />
        {brand.name}
      </a>
      <nav aria-label="Sections">
        <ul className="nav-links">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <a className="btn btn-primary" href="#contact">
          Contact
        </a>
      </div>
    </header>
  );
}
