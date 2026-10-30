import { useLanguage } from "../i18n/LanguageContext";
import { allSkills } from "../data/skills";

/** Infinite scrolling strip of technologies (pauses on hover). */
export default function TechMarquee() {
  const { t } = useLanguage();
  // Rendered twice so the -50% translate loops seamlessly
  const loop = [...allSkills, ...allSkills];

  return (
    <div className="relative border-y border-white/[0.06] bg-ink-900/40 py-5">
      <h2 className="sr-only">{t.marquee}</h2>
      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
          {loop.map(({ name, icon: Icon }, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= allSkills.length}
              className="flex shrink-0 items-center gap-2.5 text-sm text-muted transition-colors hover:text-fg"
            >
              <Icon className="h-5 w-5 text-accent-400" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
