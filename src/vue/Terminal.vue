<script setup>
/**
 * Interactive terminal written in Vue 3 and mounted inside the React app
 * through <VueIsland>. Data comes in as props from React; actions that affect
 * the React side (scrolling, language, modals) go out as emitted events.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, version as vueVersion } from "vue";

const props = defineProps({
  lang: { type: String, default: "en" },
  reactVersion: { type: String, default: "" },
  profile: { type: Object, required: true },
  socials: { type: Array, default: () => [] },
  skills: { type: Array, default: () => [] },
  projects: { type: Array, default: () => [] },
  sections: { type: Array, default: () => [] },
});

const emit = defineEmits(["navigate", "open-cv", "set-lang", "open-palette"]);

const STRINGS = {
  en: {
    boot: ["slaternight.sh v2.0", `Vue ${vueVersion} island mounted inside React ✔`, "Type 'help' to see what I can do."],
    help: "Available commands:",
    commands: {
      help: "show this list",
      about: "who is Slayder?",
      skills: "my tech stack",
      projects: "list my projects",
      "open <n>": "open project number n",
      contact: "how to reach me",
      social: "find me online",
      cv: "download my CV",
      "goto <section>": "scroll to a section",
      "lang <en|es>": "switch language",
      neofetch: "system info",
      clear: "clear the screen",
    },
    about: (p) => [
      `${p.name} — web developer based in ${p.location}.`,
      "I build websites, online stores and web apps with React, Vue, Shopify and WordPress,",
      "and I care about fast, accessible and good-looking interfaces.",
    ],
    projectsHint: "Type 'open <number>' to visit one.",
    openInvalid: (n) => `No project #${n}. Type 'projects' to see the list.`,
    opening: (title) => `Opening ${title}…`,
    contactHint: "…or just type 'sudo hire-me' 😉",
    cv: "Opening the CV dialog…",
    gotoUsage: "Usage: goto <section>. Available:",
    going: (s) => `Scrolling to ${s}…`,
    langUsage: "Usage: lang <en|es>",
    langSet: "Language switched to English.",
    hire: ["[sudo] password for visitor: ********", "Access granted ✔ Taking you to the contact form…"],
    sudo: "visitor is not in the sudoers file. This incident will be reported 👀 (try 'sudo hire-me')",
    exit: "Nice try 😄 There's no exit — but there's a 'contact' command.",
    notFound: (c) => `command not found: ${c}. Type 'help' for the list.`,
    palette: "Opening command palette… (tip: Ctrl/⌘ + K works anywhere)",
    try: "Try:",
    inputLabel: "Terminal command",
    uptime: "Uptime",
  },
  es: {
    boot: ["slaternight.sh v2.0", `Isla de Vue ${vueVersion} montada dentro de React ✔`, "Escribe 'help' para ver lo que puedo hacer."],
    help: "Comandos disponibles:",
    commands: {
      help: "muestra esta lista",
      about: "¿quién es Slayder?",
      skills: "mis tecnologías",
      projects: "lista de proyectos",
      "open <n>": "abre el proyecto número n",
      contact: "cómo contactarme",
      social: "mis redes",
      cv: "descarga mi CV",
      "goto <sección>": "ir a una sección",
      "lang <en|es>": "cambiar idioma",
      neofetch: "info del sistema",
      clear: "limpiar la pantalla",
    },
    about: (p) => [
      `${p.name} — desarrollador web en ${p.location}.`,
      "Construyo sitios, tiendas online y aplicaciones web con React, Vue, Shopify y WordPress,",
      "y me importa que las interfaces sean rápidas, accesibles y se vean bien.",
    ],
    projectsHint: "Escribe 'open <número>' para visitar uno.",
    openInvalid: (n) => `No existe el proyecto #${n}. Escribe 'projects' para ver la lista.`,
    opening: (title) => `Abriendo ${title}…`,
    contactHint: "…o simplemente escribe 'sudo hire-me' 😉",
    cv: "Abriendo la ventana del CV…",
    gotoUsage: "Uso: goto <sección>. Disponibles:",
    going: (s) => `Yendo a ${s}…`,
    langUsage: "Uso: lang <en|es>",
    langSet: "Idioma cambiado a español.",
    hire: ["[sudo] contraseña para visitor: ********", "Acceso concedido ✔ Te llevo al formulario de contacto…"],
    sudo: "visitor no está en el archivo sudoers. Este incidente será reportado 👀 (prueba 'sudo hire-me')",
    exit: "Buen intento 😄 No hay salida, pero sí hay un comando 'contact'.",
    notFound: (c) => `comando no encontrado: ${c}. Escribe 'help' para ver la lista.`,
    palette: "Abriendo la paleta de comandos… (tip: Ctrl/⌘ + K funciona en todo el sitio)",
    try: "Prueba:",
    inputLabel: "Comando de la terminal",
    uptime: "Tiempo activo",
  },
};

const COMMAND_NAMES = [
  "help", "about", "whoami", "skills", "projects", "open", "contact", "social", "cv",
  "goto", "cd", "ls", "lang", "neofetch", "date", "echo", "history", "clear", "palette", "sudo", "exit",
];
const SUGGESTIONS = ["help", "about", "projects", "skills", "neofetch", "sudo hire-me"];

const s = computed(() => STRINGS[props.lang] ?? STRINGS.en);
const lines = ref([]);
const input = ref("");
const history = ref([]);
const historyIndex = ref(-1);
const bodyEl = ref(null);
const inputEl = ref(null);
const rootEl = ref(null);
const startedAt = Date.now();
let lineId = 0;
let observer;
let bootTimers = [];

const print = (...parts) => {
  lines.value.push({
    id: lineId++,
    parts: parts.map((part) => (typeof part === "string" ? { text: part } : part)),
  });
};
const printCommand = (cmd) => lines.value.push({ id: lineId++, cmd });

const scrollToBottom = () =>
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight;
  });

function boot() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  s.value.boot.forEach((text, i) => {
    const kind = i === 1 ? "accent" : i === 0 ? "fg" : "muted";
    if (reduced) print({ text, kind });
    else bootTimers.push(setTimeout(() => (print({ text, kind }), scrollToBottom()), 250 * (i + 1)));
  });
}

function sectionById(arg) {
  const query = arg?.toLowerCase().replace(/\/$/, "");
  return props.sections.find((sec) => sec.id === query || sec.label.toLowerCase() === query);
}

function run(raw) {
  const commandLine = raw.trim();
  printCommand(commandLine);
  if (commandLine) {
    history.value.push(commandLine);
    historyIndex.value = history.value.length;
  }
  const [name = "", ...args] = commandLine.split(/\s+/);
  const command = name.toLowerCase();
  const str = s.value;

  switch (command) {
    case "":
      break;
    case "help":
      print({ text: str.help, kind: "fg" });
      Object.entries(str.commands).forEach(([cmd, desc]) =>
        print({ text: `  ${cmd.padEnd(16)}`, kind: "accent" }, { text: desc, kind: "muted" })
      );
      break;
    case "about":
    case "whoami":
      str.about(props.profile).forEach((text) => print(text));
      break;
    case "skills":
      props.skills.forEach((group) =>
        print({ text: `▸ ${group.title}: `, kind: "accent" }, group.items.join(", "))
      );
      break;
    case "projects":
      props.projects.forEach((project, i) =>
        print(
          { text: `  ${String(i + 1).padStart(2, "0")}  `, kind: "accent" },
          { text: project.title, kind: "fg" },
          { text: ` — ${project.type}`, kind: "muted" }
        )
      );
      print({ text: str.projectsHint, kind: "muted" });
      break;
    case "open": {
      const project = props.projects[Number(args[0]) - 1];
      if (!project) {
        print({ text: str.openInvalid(args[0] ?? "?"), kind: "error" });
        break;
      }
      print({ text: str.opening(project.title), kind: "muted" });
      window.open(project.link, "_blank", "noopener");
      break;
    }
    case "contact":
      print({ text: "email    ", kind: "accent" }, { text: props.profile.email, href: `mailto:${props.profile.email}` });
      print({ text: "whatsapp ", kind: "accent" }, { text: props.profile.phone, href: `https://wa.me/${props.profile.phoneRaw.replace("+", "")}` });
      print({ text: "location ", kind: "accent" }, props.profile.location);
      print({ text: str.contactHint, kind: "muted" });
      break;
    case "social":
      props.socials.forEach((social) =>
        print({ text: `  ${social.name.padEnd(11)}`, kind: "accent" }, { text: social.url, href: social.url })
      );
      break;
    case "cv":
      print({ text: str.cv, kind: "muted" });
      emit("open-cv");
      break;
    case "ls":
      print(...props.sections.map((sec) => ({ text: `${sec.id}/  `, kind: "accent" })));
      break;
    case "goto":
    case "cd": {
      const section = sectionById(args[0]);
      if (!section) {
        print({ text: str.gotoUsage, kind: "error" });
        print({ text: `  ${props.sections.map((sec) => sec.id).join("  ")}`, kind: "accent" });
        break;
      }
      print({ text: str.going(section.label), kind: "muted" });
      emit("navigate", section.id);
      break;
    }
    case "lang": {
      const next = args[0]?.toLowerCase();
      if (next !== "en" && next !== "es") {
        print({ text: str.langUsage, kind: "error" });
        break;
      }
      print({ text: STRINGS[next].langSet, kind: "accent" });
      emit("set-lang", next);
      break;
    }
    case "neofetch": {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      const info = [
        ["visitor@slaternight", ""],
        ["OS", "Portfolio v2.0"],
        ["Host", `React ${props.reactVersion}`],
        ["Shell", `Vue ${vueVersion}`],
        ["Bundler", "Vite"],
        ["Styles", "Tailwind CSS"],
        ["Motion", "GSAP + ScrollTrigger"],
        ["Theme", "Slaternight Teal"],
        [str.uptime, `${seconds}s`],
      ];
      const width = Math.max(...info.slice(1).map(([key]) => key.length)) + 2;
      info.forEach(([key, value], i) =>
        i === 0 ? print({ text: key, kind: "accent" }) : print({ text: key.padEnd(width), kind: "accent" }, value)
      );
      break;
    }
    case "date":
      print(new Date().toLocaleString(props.lang === "es" ? "es-CO" : "en-US"));
      break;
    case "echo":
      print(args.join(" "));
      break;
    case "history":
      history.value.forEach((cmd, i) => print({ text: `  ${String(i + 1).padStart(3)}  `, kind: "muted" }, cmd));
      break;
    case "clear":
    case "cls":
      lines.value = [];
      break;
    case "palette":
      print({ text: str.palette, kind: "muted" });
      emit("open-palette");
      break;
    case "sudo":
    case "hire-me":
      if (command === "hire-me" || args[0]?.toLowerCase() === "hire-me") {
        str.hire.forEach((text, i) => print({ text, kind: i === 1 ? "accent" : "muted" }));
        setTimeout(() => emit("navigate", "contact"), 700);
      } else {
        print({ text: str.sudo, kind: "error" });
      }
      break;
    case "exit":
      print({ text: str.exit, kind: "muted" });
      break;
    default:
      print({ text: str.notFound(name), kind: "error" });
  }
  scrollToBottom();
}

function submit() {
  run(input.value);
  input.value = "";
}

function autocomplete() {
  const value = input.value;
  const [cmd, arg] = value.split(/\s+/);
  let pool;
  let prefix = "";
  if (value.includes(" ")) {
    if (["goto", "cd"].includes(cmd)) pool = props.sections.map((sec) => sec.id);
    else if (cmd === "lang") pool = ["en", "es"];
    else return;
    prefix = `${cmd} `;
  } else {
    pool = COMMAND_NAMES;
  }
  const typed = (value.includes(" ") ? arg : cmd) ?? "";
  const matches = pool.filter((option) => option.startsWith(typed.toLowerCase()));
  if (matches.length === 1) input.value = `${prefix}${matches[0]}${prefix ? "" : " "}`;
  else if (matches.length > 1) {
    printCommand(value);
    print({ text: matches.join("  "), kind: "muted" });
    scrollToBottom();
  }
}

function onKeydown(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    autocomplete();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!history.value.length) return;
    historyIndex.value = Math.max(0, historyIndex.value - 1);
    input.value = history.value[historyIndex.value];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    historyIndex.value = Math.min(history.value.length, historyIndex.value + 1);
    input.value = history.value[historyIndex.value] ?? "";
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    lines.value = [];
  }
}

function focusInput() {
  // Don't steal focus while the visitor is selecting text to copy it
  if (window.getSelection()?.toString()) return;
  inputEl.value?.focus({ preventScroll: true });
}

function runSuggestion(cmd) {
  run(cmd);
}

onMounted(() => {
  // Boot when the terminal first scrolls into view
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      boot();
    },
    { threshold: 0.3 }
  );
  observer.observe(rootEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  bootTimers.forEach(clearTimeout);
});

const kindClass = {
  fg: "text-fg",
  muted: "text-muted",
  accent: "text-accent-400",
  error: "text-red-400",
};
</script>

<template>
  <div ref="rootEl">
    <div class="terminal card overflow-hidden bg-ink-950/90 shadow-2xl shadow-black/50">
      <div class="flex items-center gap-2 border-b border-white/[0.06] bg-ink-900/80 px-4 py-3">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span class="h-3 w-3 rounded-full bg-[#28c840]" />
        <span class="ml-3 truncate font-mono text-xs text-muted">visitor@slaternight: ~</span>
        <span class="ml-auto flex shrink-0 items-center gap-1.5 rounded-md bg-[#42b883]/15 px-2 py-0.5 font-mono text-[11px] text-[#42b883]">
          <svg viewBox="0 0 24 24" class="h-3 w-3" aria-hidden="true"><path fill="currentColor" d="M2 3h3.5L12 15l6.5-12H22L12 21zm4.5 0h3L12 7.58L14.5 3h3L12 13.08z" /></svg>
          Vue {{ vueVersion }}
        </span>
      </div>

      <div
        ref="bodyEl"
        class="h-[22rem] cursor-text overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[24rem] sm:text-sm"
        @click="focusInput"
      >
        <div v-for="line in lines" :key="line.id" class="whitespace-pre-wrap break-words">
          <template v-if="line.cmd !== undefined">
            <span class="text-accent-400">visitor@slaternight</span><span class="text-muted">:</span><span class="text-sky-400">~</span><span class="text-muted">$ </span><span class="text-fg">{{ line.cmd }}</span>
          </template>
          <template v-else>
            <template v-for="(part, i) in line.parts" :key="i">
              <a
                v-if="part.href"
                :href="part.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-fg underline decoration-accent-400/50 underline-offset-2 hover:text-accent-300"
              >{{ part.text }}</a>
              <span v-else :class="kindClass[part.kind] ?? 'text-muted'">{{ part.text }}</span>
            </template>
          </template>
        </div>

        <form class="flex items-center" @submit.prevent="submit">
          <label for="terminal-input" class="shrink-0 whitespace-pre">
            <span class="text-accent-400">visitor@slaternight</span><span class="text-muted">:</span><span class="text-sky-400">~</span><span class="text-muted">$ </span>
          </label>
          <input
            id="terminal-input"
            ref="inputEl"
            v-model="input"
            :aria-label="s.inputLabel"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            enterkeyhint="send"
            class="min-w-0 flex-1 bg-transparent text-fg caret-accent-400 outline-none"
            @keydown="onKeydown"
          />
        </form>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
      <span class="text-muted">{{ s.try }}</span>
      <button
        v-for="cmd in SUGGESTIONS"
        :key="cmd"
        type="button"
        class="cursor-pointer rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-fg/90 transition hover:border-accent-400/50 hover:text-accent-300"
        @click="runSuggestion(cmd)"
      >
        {{ cmd }}
      </button>
    </div>
  </div>
</template>
