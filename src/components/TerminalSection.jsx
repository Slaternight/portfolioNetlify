import { useMemo, useRef, version as reactVersion } from "react";
import { SiVuedotjs } from "react-icons/si";
import VueIsland from "./VueIsland.jsx";
import Terminal from "../vue/Terminal.vue";
import { useLanguage } from "../i18n/LanguageContext";
import { useUI } from "../context/UIContext.jsx";
import { useReveal } from "../hooks/useReveal";
import { profile, sections, socials } from "../data/profile";
import { skillGroups } from "../data/skills";
import { projects } from "../data/projects";
import { scrollToSection } from "../lib/scroll";

export default function TerminalSection() {
  const { t, lang, setLang } = useLanguage();
  const { openCv, openPalette } = useUI();
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  // Plain, serialisable data for the Vue side (no React components inside)
  const terminalProps = useMemo(
    () => ({
      lang,
      reactVersion,
      profile,
      socials: socials.map(({ name, url }) => ({ name, url })),
      skills: skillGroups.map((group) => ({
        title: t.skills.groups[group.key],
        items: group.items.map((item) => item.name),
      })),
      projects: projects.map((p) => ({ title: p.title, type: p.type[lang], link: p.link })),
      sections: sections.map((id) => ({ id, label: t.nav[id] })),
      onNavigate: scrollToSection,
      onOpenCv: openCv,
      onSetLang: setLang,
      onOpenPalette: openPalette,
    }),
    [lang, t, openCv, openPalette, setLang]
  );

  return (
    <section id="terminal" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="section-label">{t.terminal.label}</p>
          <h2 data-reveal className="section-title mt-3">{t.terminal.title}</h2>
          <p data-reveal className="mt-4 leading-relaxed">{t.terminal.description}</p>
          <p data-reveal className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#42b883]/30 bg-[#42b883]/10 px-3 py-1 text-xs font-medium text-[#42b883]">
            <SiVuedotjs className="h-3.5 w-3.5" />
            {t.terminal.badge}
          </p>
        </div>

        <div data-reveal className="mt-10">
          <VueIsland component={Terminal} props={terminalProps} />
        </div>
      </div>
    </section>
  );
}
