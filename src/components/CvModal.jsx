import { useState } from "react";
import { LuDownload, LuFileText, LuLoaderCircle } from "react-icons/lu";
import Modal from "./Modal.jsx";
import { useLanguage } from "../i18n/LanguageContext";
import { profile } from "../data/profile";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc51F-16M-7QNz5_UGcG190Ed-D3WPDWB-PUppxwYYp_UcW2Q/formResponse";
const STORAGE_KEY = "slaternight:cv-requested";

function alreadyRequested() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function CvModal({ open, onClose }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(() => (alreadyRequested() ? "done" : "idle"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData();
    formData.append("entry.173880551", name);
    formData.append("entry.904923825", email);

    try {
      // Google Forms doesn't send CORS headers, so the response is opaque.
      await fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body: formData });
    } catch {
      // Don't block the download if the lead couldn't be recorded.
    }
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage unavailable: the visitor will see the form again next time.
    }
    setStatus("done");
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-ink-800 px-3.5 py-2.5 text-fg placeholder:text-muted/70 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20";

  return (
    <Modal open={open} onClose={onClose} labelledBy="cv-title" closeLabel={t.projects.close} className="max-w-md">
      <div className="p-6 sm:p-8">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent-500/15 text-accent-400">
          <LuFileText className="h-6 w-6" />
        </div>
        <h2 id="cv-title" className="font-display text-2xl font-semibold text-fg">
          {t.cv.title}
        </h2>

        {status === "done" ? (
          <div className="mt-3">
            <p>{t.cv.ready}</p>
            <a href={profile.cvUrl} download className="btn btn-primary mt-6 w-full" onClick={onClose}>
              <LuDownload className="h-4 w-4" />
              {t.cv.download}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
            <p className="mb-2">{t.cv.description}</p>
            <input
              type="text"
              placeholder={t.cv.name}
              aria-label={t.cv.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className={inputClass}
            />
            <input
              type="email"
              placeholder={t.cv.email}
              aria-label={t.cv.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
            <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-2">
              {status === "sending" ? (
                <>
                  <LuLoaderCircle className="h-4 w-4 animate-spin" />
                  {t.cv.sending}
                </>
              ) : (
                t.cv.submit
              )}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
