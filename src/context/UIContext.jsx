import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data/profile";
import { useLanguage } from "../i18n/LanguageContext";
import CommandPalette from "../components/CommandPalette.jsx";
import CvModal from "../components/CvModal.jsx";
import Toast from "../components/Toast.jsx";

const UIContext = createContext(null);

/**
 * Global UI state shared by React components and the Vue terminal:
 * command palette, CV modal and toast notifications.
 */
export function UIProvider({ children }) {
  const { t } = useLanguage();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      notify(t.contact.copied);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }, [notify, t]);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const openCv = useCallback(() => setCvOpen(true), []);

  // Global Ctrl/Cmd + K shortcut
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const value = useMemo(
    () => ({ openPalette, openCv, copyEmail, notify }),
    [openPalette, openCv, copyEmail, notify]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      {/* Mounted only while open so every opening starts with a fresh search */}
      {paletteOpen && (
        <CommandPalette open onClose={() => setPaletteOpen(false)} copyEmail={copyEmail} openCv={openCv} />
      )}
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
      <Toast toast={toast} />
    </UIContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
