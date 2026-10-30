import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades and lifts every `[data-reveal]` element inside `ref` when the
 * container scrolls into view. Skipped for users who prefer reduced motion.
 */
export function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = root.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
    });

    return () => mm.revert();
  }, [ref]);
}
