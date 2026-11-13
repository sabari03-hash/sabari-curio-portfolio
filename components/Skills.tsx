import { profile, tools } from "@/content/site";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">04 · Toolkit</div>
            <h2 className="section-title" id="skills-title">
              Skills &amp; <span className="accent">tools</span>
            </h2>
            <p className="section-sub">The software behind every cut, grade and animation.</p>
          </div>
        </Reveal>

        <div className="tools-grid">
          {tools.map((t, i) => (
            <Reveal key={t.name} className="tool glass glass-glow" delay={i * 70}>
              <div className="tool-top">
                <div className="tool-badge" style={{ color: t.color }} aria-hidden>
                  {t.badge}
                </div>
                <div>
                  <h3>{t.name}</h3>
                  {t.note && <p>{t.note}</p>}
                </div>
              </div>
              <div
                className="meter"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={t.level}
                aria-label={`${t.name} proficiency`}
              >
                <span style={{ ["--level" as string]: `${t.level}%` }} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <ul className="chips skill-chips">
            {profile.skills.map((s) => (
              <li className="chip" key={s}>
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
