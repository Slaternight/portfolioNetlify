export function scrollToSection(id) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const isMac = () =>
  typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.userAgent);

export const modKeyLabel = () => (isMac() ? "⌘" : "Ctrl");
