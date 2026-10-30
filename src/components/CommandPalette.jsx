import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuArrowRight,
  LuCopy,
  LuDownload,
  LuLanguages,
  LuSearch,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import Modal from "./Modal.jsx";
import { useLanguage } from "../i18n/LanguageContext";
import { profile, sections, socials } from "../data/profile";
import { scrollToSection } from "../lib/scroll";

// Lowercase and strip accents so "proyectos" matches "Proyectós", etc.
const normalize = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function CommandPalette({ open, onClose, copyEmail, openCv }) {
  const { t, toggleLang } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const commands = useMemo(() => {
    const p = t.palette;
    return [
      ...sections.map((id) => ({
        id: `goto-${id}`,
        group: p.groups.navigation,
        label: `${p.goto} ${t.nav[id]}`,
        keywords: id,
        icon: LuArrowRight,
        run: () => scrollToSection(id),
      })),
      { id: "lang", group: p.groups.actions, label: p.switchLang, keywords: "language idioma en es", icon: LuLanguages, run: toggleLang },
      { id: "copy-email", group: p.groups.actions, label: p.copyEmail, keywords: `email correo ${profile.email}`, icon: LuCopy, run: copyEmail },
      { id: "cv", group: p.groups.actions, label: p.downloadCv, keywords: "cv resume curriculum hoja de vida", icon: LuDownload, run: openCv },
      {
        id: "whatsapp",
        group: p.groups.actions,
        label: p.whatsapp,
        keywords: "whatsapp phone telefono chat",
        icon: FaWhatsapp,
        run: () => window.open(`https://wa.me/${profile.phoneRaw.replace("+", "")}`, "_blank", "noopener"),
      },
      ...socials.map((s) => ({
        id: `social-${s.name}`,
        group: p.groups.social,
        label: s.name,
        keywords: s.url,
        icon: s.icon,
        run: () => window.open(s.url, "_blank", "noopener"),
      })),
    ];
  }, [t, toggleLang, copyEmail, openCv]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter((c) => normalize(`${c.label} ${c.keywords}`).includes(q));
  }, [commands, query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const run = (command) => {
    onClose();
    // Let the modal close (and unlock page scroll) before running the action
    setTimeout(command.run, 0);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      run(results[activeIndex]);
    }
  };

  let lastGroup = null;

  return (
    <Modal open={open} onClose={onClose} labelledBy="palette-label" position="top" className="max-w-xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-4">
        <LuSearch className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <label id="palette-label" htmlFor="palette-input" className="sr-only">
          {t.palette.placeholder}
        </label>
        <input
          id="palette-input"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t.palette.placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
          autoComplete="off"
          spellCheck="false"
          className="h-14 w-full bg-transparent text-base text-fg placeholder:text-muted/70 outline-none"
        />
        <kbd className="kbd">esc</kbd>
      </div>

      <ul id="palette-list" ref={listRef} role="listbox" className="no-scrollbar max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-8 text-center text-sm">{t.palette.empty}</li>}
        {results.map((command, index) => {
          const showGroup = command.group !== lastGroup;
          lastGroup = command.group;
          const Icon = command.icon;
          const active = index === activeIndex;
          return (
            <li key={command.id} role="presentation">
              {showGroup && (
                <div className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-wider text-muted/70">
                  {command.group}
                </div>
              )}
              <div
                id={`cmd-${command.id}`}
                role="option"
                aria-selected={active}
                data-index={index}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => run(command)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-accent-500/15 text-fg" : "text-muted"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-accent-400" : ""}`} />
                <span className="flex-1">{command.label}</span>
                {active && <kbd className="kbd">↵</kbd>}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2.5 text-xs text-muted/80">
        <span className="flex items-center gap-1.5"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd>{t.palette.footerNavigate}</span>
        <span className="flex items-center gap-1.5"><kbd className="kbd">↵</kbd>{t.palette.footerSelect}</span>
        <span className="flex items-center gap-1.5"><kbd className="kbd">esc</kbd>{t.palette.footerClose}</span>
      </div>
    </Modal>
  );
}
