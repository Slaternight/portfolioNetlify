import esferosWeb from "../assets/esferos.webm";
import runksWeb from "../assets/runks.webm";
import lumenxWeb from "../assets/lumenx.webm";
import tiendaFliv from "../assets/tiendafliv.webm";
import flivWeb from "../assets/fliv.webm";
import catalogoWeb from "../assets/catalogo.webm";
import globalCyg from "../assets/globalcyg.webm";

export const projects = [
  {
    id: "boton-promo",
    title: "Boton Promo",
    type: { en: "E-commerce", es: "E-commerce" },
    category: "Shopify & Liquid",
    description: {
      en: "Online store built on Shopify with Liquid, JavaScript and Bootstrap 5, focused on accessibility and a responsive shopping experience.",
      es: "Tienda online en Shopify desarrollada con Liquid, JavaScript y Bootstrap 5, enfocada en accesibilidad y una experiencia de compra responsive.",
    },
    tech: ["Shopify", "Liquid", "JavaScript", "Bootstrap 5"],
    video: esferosWeb,
    link: "https://esferos.com",
  },
  {
    id: "runks",
    title: "Runks Electric",
    type: { en: "E-commerce", es: "E-commerce" },
    category: "WordPress & Elementor Pro",
    description: {
      en: "E-commerce site for electric vehicles built with WordPress, PHP and Elementor Pro, designed to be accessible and responsive.",
      es: "E-commerce de vehículos eléctricos hecho con WordPress, PHP y Elementor Pro, pensado para ser accesible y responsive.",
    },
    tech: ["WordPress", "Elementor Pro", "PHP"],
    video: runksWeb,
    link: "https://runks.com.co",
  },
  {
    id: "lumenx",
    title: "Lumenx",
    type: { en: "E-commerce", es: "E-commerce" },
    category: "WordPress & Elementor Pro",
    description: {
      en: "Online store built with WordPress, PHP and Elementor Pro, styled for accessibility and responsive behavior.",
      es: "Tienda online construida con WordPress, PHP y Elementor Pro, con estilos accesibles y comportamiento responsive.",
    },
    tech: ["WordPress", "Elementor Pro", "PHP"],
    video: lumenxWeb,
    link: "https://lumenx.com.co",
  },
  {
    id: "tienda-fliv",
    title: "Tienda Industrias Fliv",
    type: { en: "E-commerce", es: "E-commerce" },
    category: "WordPress & Elementor Pro",
    description: {
      en: "WooCommerce store built with WordPress, PHP and Elementor Pro, with a responsive catalog and checkout.",
      es: "Tienda WooCommerce construida con WordPress, PHP y Elementor Pro, con catálogo y checkout responsive.",
    },
    tech: ["WordPress", "WooCommerce", "Elementor Pro", "PHP"],
    video: tiendaFliv,
    link: "https://tienda.fliv.com",
  },
  {
    id: "fliv",
    title: "Industrias Fliv",
    type: { en: "Corporate website", es: "Sitio corporativo" },
    category: "WordPress & Elementor Pro",
    description: {
      en: "Corporate website built with WordPress, PHP and Elementor Pro, styled for accessibility and responsive behavior.",
      es: "Sitio corporativo hecho con WordPress, PHP y Elementor Pro, con estilos accesibles y comportamiento responsive.",
    },
    tech: ["WordPress", "Elementor Pro", "PHP"],
    video: flivWeb,
    link: "https://fliv.com.co",
  },
  {
    id: "catalogo-espacial",
    title: "Catalogo Espacial",
    type: { en: "Website", es: "Sitio web" },
    category: "Shopify & Liquid",
    description: {
      en: "Catalog website built on Shopify with Liquid and API integrations, styled for accessibility and responsive behavior.",
      es: "Sitio de catálogo en Shopify con Liquid e integraciones vía API, con estilos accesibles y comportamiento responsive.",
    },
    tech: ["Shopify", "Liquid", "API"],
    video: catalogoWeb,
    link: "https://catalogoespacial.com",
  },
  {
    id: "global-cyg",
    title: "Global CYG",
    type: { en: "Tourism website", es: "Sitio de turismo" },
    category: "WordPress & Elementor Pro",
    description: {
      en: "Tourism website built with WordPress and Elementor Pro, styled for accessibility and responsive behavior.",
      es: "Sitio de turismo hecho con WordPress y Elementor Pro, con estilos accesibles y comportamiento responsive.",
    },
    tech: ["WordPress", "Elementor Pro"],
    video: globalCyg,
    link: "https://globalcyg.com",
  },
];

export const projectCategories = [...new Set(projects.map((p) => p.category))];
