import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const GAP = 30; // px between dots
const RADIUS = 180; // px of cursor influence
const ACCENT = "#2ec9c3";
const BASE = "#8b98a6";

/**
 * Fixed full-screen dot grid drawn on a canvas. Dots breathe with a slow
 * wave and light up around the cursor. Static when reduced motion is on.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let width = 0;
    let height = 0;
    let frame = 0;

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      for (let x = GAP / 2; x < width; x += GAP) {
        for (let y = GAP / 2; y < height; y += GAP) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
          const wave = reduced ? 0.5 : (Math.sin(time * 0.0008 + x * 0.012 + y * 0.008) + 1) / 2;
          const size = 1.2 + near * 2.4;
          ctx.globalAlpha = Math.min(1, 0.08 + wave * 0.07 + near * 0.8);
          ctx.fillStyle = near > 0.02 ? ACCENT : BASE;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw();
    };

    const loop = (time) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onPointerLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibility);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute -bottom-60 -right-40 h-[40rem] w-[40rem] rounded-full bg-accent-900/40 blur-3xl" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Fade the grid towards the edges so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink-950)_95%)]" />
    </div>
  );
}
