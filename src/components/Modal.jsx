import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

/**
 * Accessible dialog shell: portal, backdrop, Esc to close, scroll lock
 * and focus restore. `position="top"` is used by the command palette.
 */
export default function Modal({ open, onClose, labelledBy, closeLabel = "Close", position = "center", className = "", children }) {
  const panelRef = useRef(null);
  // Keep the latest onClose without re-running the open/close effect on every render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab") trapFocus(e, panelRef.current);
    };
    document.addEventListener("keydown", onKeyDown);

    // Focus the first field if there is one, otherwise the first control (or the panel)
    const panel = panelRef.current;
    const first =
      panel?.querySelector("input, textarea") ?? panel?.querySelector("button, a[href]") ?? panel;
    first?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex justify-center p-4 ${
        position === "top" ? "items-start pt-[12vh]" : "items-center"
      }`}
    >
      <div
        className="absolute inset-0 bg-ink-950/75 backdrop-blur-md motion-safe:animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`card relative w-full overflow-hidden bg-ink-900/95 shadow-2xl shadow-black/60 outline-none motion-safe:animate-[pop-in_200ms_cubic-bezier(0.2,0.9,0.3,1.2)] ${className}`}
      >
        {position !== "top" && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 z-10 rounded-full bg-ink-950/60 p-2 text-fg/80 backdrop-blur transition hover:bg-ink-950/90 hover:text-fg cursor-pointer"
          >
            <LuX className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

function trapFocus(e, container) {
  if (!container) return;
  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
