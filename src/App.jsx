import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TechMarquee from "./components/TechMarquee.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import TerminalSection from "./components/TerminalSection.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import InteractiveBackground from "./components/InteractiveBackground.jsx";
import { LanguageProvider } from "./i18n/LanguageContext";
import { UIProvider } from "./context/UIContext.jsx";

// The WhatsApp widget bundles its own sound and images (~230 KB gzipped),
// so it is loaded only after the page has finished loading.
const Whatsapp = lazy(() => import("./components/Whatsapp.jsx"));

function useAfterLoad() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setTimeout(() => setReady(true), 1500);
    if (document.readyState === "complete") {
      const id = start();
      return () => clearTimeout(id);
    }
    let id;
    const onLoad = () => (id = start());
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(id);
    };
  }, []);
  return ready;
}

function App() {
  const showWhatsapp = useAfterLoad();

  return (
    <LanguageProvider>
      <UIProvider>
        <InteractiveBackground />
        <Navbar />
        <main className="relative">
          <Hero />
          <TechMarquee />
          <Projects />
          <Skills />
          <TerminalSection />
          <Contact />
        </main>
        <Footer />
        {showWhatsapp && (
          <Suspense fallback={null}>
            <Whatsapp />
          </Suspense>
        )}
      </UIProvider>
    </LanguageProvider>
  );
}

export default App;
