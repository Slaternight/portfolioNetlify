import { useEffect, useState } from "react";
import { LuCommand, LuMenu, LuSearch, LuX } from "react-icons/lu";
import logo from "../assets/logo_1.svg";
import ScrollProgress from "./ScrollProgress.jsx";
import { useLanguage } from "../i18n/LanguageContext";
import { useUI } from "../context/UIContext.jsx";
import { useActiveSection } from "../hooks/useActiveSection";
import { sections } from "../data/profile";
import { modKeyLabel, scrollToSection } from "../lib/scroll";

const NAV_ITEMS = sections.filter((id) => id !== "home");

export default function Navbar() {
  const { t } = useLanguage();
  const { openPalette } = useUI();
  const active = useActiveSection(sections);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <a href="#home" onClick={go("home")} className="mr-4 shrink-0">
          <img src={logo} alt="Slaternight" className="h-7 w-auto" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={go(id)}
                aria-current={active === id ? "true" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active === id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t.nav[id]}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent-400 transition-transform duration-300 ${
                    active === id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted transition hover:border-white/20 hover:text-fg sm:flex cursor-pointer"
          >
            <LuSearch className="h-4 w-4" />
            <span className="hidden lg:inline">{t.nav.search}</span>
            <kbd className="kbd">{modKeyLabel()} K</kbd>
          </button>
          <button
            type="button"
            onClick={openPalette}
            aria-label={t.nav.search}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-muted sm:hidden cursor-pointer"
          >
            <LuCommand className="h-4 w-4" />
          </button>

          <LanguageToggle />

          <a href="#contact" onClick={go("contact")} className="btn btn-primary hidden py-1.5 md:inline-flex">
            {t.nav.hire}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-fg md:hidden cursor-pointer"
          >
            {menuOpen ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/[0.06] px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((id, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  className={`flex items-baseline gap-3 py-3 font-display text-2xl ${
                    active === id ? "text-fg" : "text-muted"
                  }`}
                >
                  <span className="font-mono text-xs text-accent-400">0{i + 1}</span>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={go("contact")} className="btn btn-primary mt-3 w-full">
            {t.nav.hire}
          </a>
        </div>
      )}

      <ScrollProgress />
    </header>
  );
}

function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div role="group" aria-label={t.nav.language} className="relative flex rounded-lg border border-white/10 p-0.5 font-mono text-xs">
      <span
        aria-hidden="true"
        className={`absolute inset-y-0.5 w-[calc(50%-2px)] rounded-md bg-accent-500/20 transition-transform duration-300 ${
          lang === "es" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {["en", "es"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`relative z-10 w-9 rounded-md py-1.5 uppercase transition-colors cursor-pointer ${
            lang === code ? "text-accent-300" : "text-muted hover:text-fg"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
