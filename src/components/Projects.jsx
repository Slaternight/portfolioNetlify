import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import { useLanguage } from "../i18n/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import { useMediaQuery } from "../hooks/useReducedMotion";
import { projectCategories, projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const ALL = "all";
// Horizontal scroll-jacking only on large, tall-enough screens and when motion is welcome
const PIN_QUERY = "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";
const CARD_GAP = 24; // matches gap-6 on the track

export default function Projects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(ALL);
  const [selected, setSelected] = useState(null);
  const [current, setCurrent] = useState(0);
  const pinned = useMediaQuery(PIN_QUERY);

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const triggerRef = useRef(null);
  const firstRender = useRef(true);

  useReveal(sectionRef);

  const filtered = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  // Desktop: pin the section and translate the track horizontally while scrolling
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const distance = () => track.scrollWidth - viewportRef.current.clientWidth;
    if (distance() <= 0) return; // every card already fits on screen

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            setCurrent(Math.round(self.progress * (filtered.length - 1)));
          },
        },
      });
      triggerRef.current = tween.scrollTrigger;
    });
    // The pin adds scroll space, so triggers further down need new positions
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      triggerRef.current = null;
    };
  }, [pinned, filtered]);

  // Animate cards in when the filter changes (initial reveal is handled by useReveal)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(trackRef.current.children, { y: 40, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 });
    });
    return () => mm.revert();
  }, [filtered]);

  const changeFilter = (next) => {
    if (next === filter) return;
    // Jump back to the start of the gallery so the new set begins at card 01
    const trigger = triggerRef.current;
    if (trigger && window.scrollY > trigger.start) window.scrollTo({ top: trigger.start, behavior: "instant" });
    viewportRef.current.scrollLeft = 0;
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    setCurrent(0);
    setFilter(next);
  };

  // Mobile / reduced motion: native horizontal scroll with snap
  const onViewportScroll = (e) => {
    if (pinned) return;
    const el = e.currentTarget;
    const card = trackRef.current.firstElementChild;
    if (!card) return;
    const max = el.scrollWidth - el.clientWidth;
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 1})`;
    setCurrent(Math.min(filtered.length - 1, Math.round(el.scrollLeft / (card.offsetWidth + CARD_GAP))));
  };

  const scrollByCard = (direction) => {
    const card = trackRef.current.firstElementChild;
    if (!card) return;
    viewportRef.current.scrollBy({ left: direction * (card.offsetWidth + CARD_GAP), behavior: "smooth" });
  };

  const tabs = [{ value: ALL, label: t.projects.all }, ...projectCategories.map((c) => ({ value: c, label: c }))];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`relative ${pinned ? "flex h-screen flex-col justify-center pt-16" : "py-24"}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p data-reveal className="section-label">{t.projects.label}</p>
            {/* Pinned layout must fit in one screen: smaller title, description only on tall screens */}
            <h2 data-reveal className={`section-title mt-3 ${pinned ? "sm:text-4xl" : ""}`}>{t.projects.title}</h2>
            <p data-reveal className={`mt-4 leading-relaxed ${pinned ? "[@media(max-height:820px)]:hidden" : ""}`}>
              {t.projects.description}
            </p>
          </div>

          <div data-reveal role="tablist" aria-label={t.projects.category} className="flex flex-wrap gap-2">
            {tabs.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                onClick={() => changeFilter(value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition cursor-pointer ${
                  filter === value
                    ? "border-accent-400/50 bg-accent-500/15 text-accent-300"
                    : "border-white/10 text-muted hover:border-white/20 hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={viewportRef}
        onScroll={onViewportScroll}
        className={`shrink-0 py-3 ${pinned ? "mt-6 overflow-hidden" : "no-scrollbar mt-10 snap-x snap-mandatory overflow-x-auto"}`}
      >
        <ul
          ref={trackRef}
          className="flex w-max gap-6 px-4 will-change-transform sm:px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {filtered.map((project, index) => (
            <li key={project.id} data-reveal className="flex">
              <ProjectCard project={project} index={index} onOpen={setSelected} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <span className="font-mono text-sm text-fg">
          {String(current + 1).padStart(2, "0")}
          <span className="text-muted"> / {String(filtered.length).padStart(2, "0")}</span>
        </span>
        <div className="h-px flex-1 overflow-hidden bg-white/10">
          <div ref={progressRef} className="h-full origin-left bg-accent-400" style={{ transform: "scaleX(0)" }} />
        </div>
        {!pinned && (
          <>
            <span className="flex items-center gap-1.5 text-xs text-muted sm:hidden">
              {t.projects.swipe} <LuArrowRight className="h-3.5 w-3.5 motion-safe:animate-pulse" />
            </span>
            <div className="hidden gap-2 sm:flex">
              {[-1, 1].map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => scrollByCard(direction)}
                  aria-label={direction < 0 ? t.projects.prev : t.projects.next}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted transition hover:border-accent-400/50 hover:text-fg cursor-pointer"
                >
                  {direction < 0 ? <LuChevronLeft className="h-4 w-4" /> : <LuChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
