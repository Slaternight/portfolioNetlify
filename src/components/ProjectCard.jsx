import { useEffect, useRef } from "react";
import { LuArrowUpRight, LuMaximize2 } from "react-icons/lu";
import { useLanguage } from "../i18n/LanguageContext";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function ProjectCard({ project, index, onOpen }) {
  const { t, lang } = useLanguage();
  const reduced = useReducedMotion();
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  // Only play the preview while the card is on screen (saves CPU and data)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    if (!reduced) {
      card.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    }
  };

  const onPointerLeave = () => {
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onMouseEnter={() => reduced && videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => reduced && videoRef.current?.pause()}
      className="group w-[82vw] max-w-[26rem] shrink-0 snap-center [perspective:1000px] sm:w-[26rem]"
    >
      <div className="card relative flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-200 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-hover:border-accent-400/30">
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`${t.projects.details}: ${project.title}`}
          className="relative block aspect-video w-full overflow-hidden bg-ink-800 text-left cursor-pointer"
        >
          <video
            ref={videoRef}
            src={`${project.video}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-md bg-ink-950/70 px-2 py-1 font-mono text-xs text-accent-300 backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-ink-950/70 text-fg opacity-0 backdrop-blur transition group-hover:opacity-100">
            <LuMaximize2 className="h-4 w-4" />
          </span>
        </button>

        {/* Cursor-following glare */}
        <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex flex-1 flex-col p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-400">{project.type[lang]}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed">{project.description[lang]}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted">
                {tech}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-3 pt-5">
            <button type="button" onClick={() => onOpen(project)} className="btn btn-ghost flex-1">
              {t.projects.details}
            </button>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
              {t.projects.visit}
              <LuArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
