import { useRef, useState } from "react";
import { LuCopy, LuLoaderCircle, LuMail, LuMapPin, LuSend } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { useLanguage } from "../i18n/LanguageContext";
import { useUI } from "../context/UIContext.jsx";
import { useReveal } from "../hooks/useReveal";
import { profile } from "../data/profile";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const inputClass =
  "peer w-full rounded-lg border border-white/10 bg-ink-800/80 px-4 pb-2.5 pt-6 text-fg outline-none transition placeholder:text-transparent focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20";
const labelClass =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-muted transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs";

export default function Contact() {
  const { t } = useLanguage();
  const { copyEmail } = useUI();
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "", "bot-field": "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  useReveal(sectionRef);

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Netlify Forms: POST url-encoded data to "/" with the form-name field.
  // Only works on the deployed site, not on the local dev server.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", message: "" });
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      if (response.ok) {
        setStatus({ state: "success", message: t.contact.form.success });
        setForm({ name: "", email: "", message: "", "bot-field": "" });
      } else {
        setStatus({ state: "error", message: `${t.contact.form.error} (${response.status})` });
      }
    } catch {
      setStatus({ state: "error", message: t.contact.form.network });
    }
  };

  const whatsappUrl = `https://wa.me/${profile.phoneRaw.replace("+", "")}`;

  return (
    <section id="contact" ref={sectionRef} className="py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p data-reveal className="section-label">{t.contact.label}</p>
          <h2 data-reveal className="section-title mt-3">{t.contact.title}</h2>
          <p data-reveal className="mt-4 max-w-md leading-relaxed">{t.contact.description}</p>

          <ul className="mt-10 flex flex-col gap-3">
            <li data-reveal className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
                <LuMail className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-muted/80">{t.contact.email}</p>
                <a href={`mailto:${profile.email}`} className="block truncate text-fg hover:text-accent-400">
                  {profile.email}
                </a>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={t.contact.copy}
                title={t.contact.copy}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-white/5 hover:text-fg cursor-pointer"
              >
                <LuCopy className="h-4 w-4" />
              </button>
            </li>
            <li data-reveal className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
                <FaWhatsapp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted/80">{t.contact.phone}</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-accent-400">
                  {profile.phone}
                </a>
              </div>
            </li>
            <li data-reveal className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
                <LuMapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted/80">{t.contact.location}</p>
                <p className="text-fg">{profile.location}</p>
              </div>
            </li>
          </ul>
        </div>

        <form
          data-reveal
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="card flex flex-col gap-4 p-6 sm:p-8"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" value={form["bot-field"]} onChange={update} />
            </label>
          </p>

          <div className="relative">
            <input id="name" name="name" type="text" required placeholder=" " autoComplete="name" value={form.name} onChange={update} className={inputClass} />
            <label htmlFor="name" className={labelClass}>{t.contact.form.name}</label>
          </div>
          <div className="relative">
            <input id="email" name="email" type="email" required placeholder=" " autoComplete="email" value={form.email} onChange={update} className={inputClass} />
            <label htmlFor="email" className={labelClass}>{t.contact.form.email}</label>
          </div>
          <div className="relative">
            <textarea id="message" name="message" required placeholder=" " rows={6} value={form.message} onChange={update} className={`${inputClass} resize-none`} />
            <label htmlFor="message" className={labelClass}>{t.contact.form.message}</label>
          </div>

          <p
            role="status"
            className={`min-h-5 text-sm ${status.state === "success" ? "text-accent-300" : "text-red-400"}`}
          >
            {status.message}
          </p>

          <button type="submit" disabled={status.state === "sending"} className="btn btn-primary w-full py-3">
            {status.state === "sending" ? (
              <>
                <LuLoaderCircle className="h-4 w-4 animate-spin" />
                {t.contact.form.sending}
              </>
            ) : (
              <>
                {t.contact.form.send}
                <LuSend className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
