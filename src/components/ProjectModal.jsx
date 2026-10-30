import { LuArrowUpRight } from "react-icons/lu";
import Modal from "./Modal.jsx";
import { useLanguage } from "../i18n/LanguageContext";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function ProjectModal({ project, onClose }) {
  const { t, lang } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <Modal open={Boolean(project)} onClose={onClose} labelledBy="project-title" closeLabel={t.projects.close} className="max-w-3xl">
      {project && (
        <div className="max-h-[85vh] overflow-y-auto">
          <video
            key={project.id}
            src={project.video}
            autoPlay={!reduced}
            controls={reduced}
            muted
            loop
            playsInline
            className="aspect-video max-h-[45vh] w-full bg-ink-800 object-cover object-top"
          />
          <div className="p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-400">
              {project.type[lang]} · {project.category}
            </p>
            <h2 id="project-title" className="mt-2 font-display text-3xl font-semibold text-fg">
              {project.title}
            </h2>
            <p className="mt-3 leading-relaxed">{project.description[lang]}</p>

            <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted/80">{t.projects.stack}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li key={tech} className="rounded-md border border-accent-400/20 bg-accent-500/10 px-2.5 py-1 font-mono text-xs text-accent-300">
                  {tech}
                </li>
              ))}
            </ul>

            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
              {t.projects.visit}
              <LuArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
