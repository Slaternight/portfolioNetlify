import logo from "../assets/logo_1.svg";
import { useLanguage } from "../i18n/LanguageContext";
import { profile, socials } from "../data/profile";
import { modKeyLabel } from "../lib/scroll";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/[0.06] bg-ink-950/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <img src={logo} alt="Slaternight" className="h-6 w-auto opacity-80" />
        <ul className="flex flex-wrap justify-center gap-2">
          {socials.map(({ name, url, icon: Icon }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="grid h-10 w-10 place-items-center rounded-lg text-muted transition hover:-translate-y-0.5 hover:bg-white/5 hover:text-accent-400"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 border-t border-white/[0.04] px-4 py-6 text-center text-xs sm:px-6 md:flex-row md:justify-between md:text-left">
        <p>
          © {new Date().getFullYear()} · {t.footer.built}{" "}
          <a href={socials[0].url} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-accent-400">
            {profile.name}
          </a>
          <span className="hidden sm:inline"> · {t.footer.stack}</span>
        </p>
        <p className="hidden items-center gap-1.5 md:flex">
          <kbd className="kbd">{modKeyLabel()}</kbd>
          <kbd className="kbd">K</kbd>
          {t.footer.hint}
        </p>
      </div>
    </footer>
  );
}
