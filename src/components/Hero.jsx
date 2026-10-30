import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LuArrowDown, LuArrowRight, LuDownload } from "react-icons/lu";
import gifAdventure from "../assets/catAdventure.gif";
import { useLanguage } from "../i18n/LanguageContext";
import { useUI } from "../context/UIContext.jsx";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTypewriter } from "../hooks/useTypewriter";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { modKeyLabel, scrollToSection } from "../lib/scroll";

const TYPING_WORDS = ["React", "Vue", "Node.js", "Express", "Tailwind", "Sass", "WordPress", "Shopify"];
const FLOATING_TAGS = [
  { label: "<React />", className: "-left-2 top-10 sm:-left-10" },
  { label: "v-if=\"vue\"", className: "-right-2 top-1/3 sm:-right-12 [animation-delay:-2s]" },
  { label: "{ shopify }", className: "-bottom-5 left-8 [animation-delay:-4s]" },
];

export default function Hero() {
  const { t } = useLanguage();
  const { openCv, openPalette } = useUI();
  const reduced = useReducedMotion();
  const word = useTypewriter(TYPING_WORDS, { reduced });
  const rootRef = useRef(null);
  const windowRef = useRef(null);

  // Intro timeline
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-item]", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 })
          .from("[data-hero-window]", { y: 40, opacity: 0, duration: 1 }, "-=0.6");
      },
      rootRef
    );
    return () => mm.revert();
  }, []);

  // Subtle 3D tilt of the gif window following the cursor
  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !windowRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    windowRef.current.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    windowRef.current.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
  };

  return (
    <section
      id="home"
      ref={rootRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] items-center pb-20 pt-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <p
            data-hero-item
            className="inline-flex items-center gap-2 rounded-full border border-accent-400/25 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent-400 motion-safe:animate-pulse-ring" />
              <span className="relative h-2 w-2 rounded-full bg-accent-400" />
            </span>
            {t.hero.status}
          </p>

          <h1 data-hero-item className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-6xl">
            {t.hero.greeting}{" "}
            <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-600 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>

          <p data-hero-item className="mt-5 font-mono text-base text-fg sm:text-lg">
            {t.hero.tagline}{" "}
            <span className="text-accent-400" aria-live="off">
              {word}
            </span>
            <span aria-hidden="true" className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 bg-accent-400 motion-safe:animate-blink" />
          </p>

          <p data-hero-item className="mx-auto mt-5 max-w-xl text-base leading-relaxed lg:mx-0">
            {t.hero.description}
          </p>

          <div data-hero-item className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="btn btn-primary group"
            >
              {t.hero.ctaPrimary}
              <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
              className="btn btn-ghost"
            >
              {t.hero.ctaSecondary}
            </a>
            <button type="button" onClick={openCv} className="btn btn-ghost">
              <LuDownload className="h-4 w-4" />
              {t.hero.ctaCv}
            </button>
          </div>

          <div data-hero-item className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm lg:justify-start">
            <span>
              <strong className="font-display text-2xl text-fg">{projects.length}</strong> {t.hero.live}
            </span>
            <span className="hidden h-6 w-px bg-white/10 sm:block" />
            <button
              type="button"
              onClick={openPalette}
              className="hidden items-center gap-1.5 text-muted transition hover:text-fg sm:flex cursor-pointer"
            >
              {t.hero.press} <kbd className="kbd">{modKeyLabel()}</kbd>
              <kbd className="kbd">K</kbd> {t.hero.hint}
            </button>
          </div>
        </div>

        {/* Gif inside an app window */}
        <div data-hero-window className="relative mx-auto w-full max-w-md [perspective:1200px]">
          <div
            ref={windowRef}
            className="relative transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]"
          >
            <div className="motion-safe:animate-float">
              <div className="card overflow-hidden shadow-2xl shadow-accent-900/40">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-xs text-muted">~/slaternight/adventure.gif</span>
                </div>
                <img src={gifAdventure} alt="Pixel art adventure animation" className="aspect-square w-full object-cover [image-rendering:pixelated]" />
              </div>
            </div>
            {FLOATING_TAGS.map((tag) => (
              <span
                key={tag.label}
                aria-hidden="true"
                className={`absolute rounded-lg border border-white/10 bg-ink-800/90 px-3 py-1.5 font-mono text-xs text-accent-300 shadow-lg backdrop-blur motion-safe:animate-float ${tag.className}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("projects")}
        aria-label={t.hero.ctaSecondary}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted transition hover:text-fg md:flex cursor-pointer"
      >
        {t.hero.scroll}
        <LuArrowDown className="h-4 w-4 motion-safe:animate-bounce" />
      </button>
    </section>
  );
}
