import { LuCheck } from "react-icons/lu";

export default function Toast({ toast }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className="card flex items-center gap-2 bg-ink-800/95 px-4 py-2.5 text-sm text-fg shadow-xl motion-safe:animate-[pop-in_200ms_ease-out]"
        >
          <LuCheck className="h-4 w-4 text-accent-400" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
