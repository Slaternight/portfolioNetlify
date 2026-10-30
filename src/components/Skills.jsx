import { useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import { skillGroups } from "../data/skills";

// Feeds the cursor position to the .spotlight background of the hovered card
const trackPointer = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

export default function Skills() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="skills" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p data-reveal className="section-label">{t.skills.label}</p>
          <h2 data-reveal className="section-title mt-3">{t.skills.title}</h2>
          <p data-reveal className="mt-4 leading-relaxed">{t.skills.description}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {skillGroups.map(({ key, icon: GroupIcon, items }) => (
            <article
              key={key}
              data-reveal
              onPointerMove={trackPointer}
              className="card spotlight group relative overflow-hidden p-6 transition-colors hover:border-accent-400/25 [&:not(:hover)]:bg-none"
            >
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
                  <GroupIcon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-fg">{t.skills.groups[key]}</h3>
                <span className="ml-auto font-mono text-xs text-muted/70">{String(items.length).padStart(2, "0")}</span>
              </header>
              <ul className="mt-5 flex flex-wrap gap-2">
                {items.map(({ name, icon: Icon }) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-ink-800/80 px-3 py-2 text-sm text-fg/90 transition hover:-translate-y-0.5 hover:border-accent-400/40 hover:text-fg"
                  >
                    <Icon className="h-4 w-4 text-accent-400" />
                    {name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
