import {
  SiAdobeaftereffects,
  SiAdobedreamweaver,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBootstrap,
  SiCss3,
  SiElementor,
  SiExpress,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiReact,
  SiSass,
  SiShopify,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiWoocommerce,
  SiWordpress,
} from "react-icons/si";
import { LuCode, LuServer, LuShoppingBag, LuPalette } from "react-icons/lu";

// `key` maps to translations.skills.groups.<key>
export const skillGroups = [
  {
    key: "frontend",
    icon: LuCode,
    items: [
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss3 },
      { name: "Sass", icon: SiSass },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React", icon: SiReact },
      { name: "Vue.js", icon: SiVuedotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Bootstrap", icon: SiBootstrap },
    ],
  },
  {
    key: "backend",
    icon: LuServer,
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Git / GitHub", icon: SiGit },
      { name: "Webpack", icon: SiWebpack },
      { name: "Vite", icon: SiVite },
    ],
  },
  {
    key: "cms",
    icon: LuShoppingBag,
    items: [
      { name: "WordPress", icon: SiWordpress },
      { name: "Elementor Pro", icon: SiElementor },
      { name: "WooCommerce", icon: SiWoocommerce },
      { name: "Shopify", icon: SiShopify },
    ],
  },
  {
    key: "design",
    icon: LuPalette,
    items: [
      { name: "Figma", icon: SiFigma },
      { name: "Photoshop", icon: SiAdobephotoshop },
      { name: "Illustrator", icon: SiAdobeillustrator },
      { name: "Premiere Pro", icon: SiAdobepremierepro },
      { name: "After Effects", icon: SiAdobeaftereffects },
      { name: "Dreamweaver", icon: SiAdobedreamweaver },
    ],
  },
];

export const allSkills = skillGroups.flatMap((group) => group.items);
