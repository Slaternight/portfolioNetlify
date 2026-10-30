import {
  FaBehance,
  FaFacebookF,
  FaGithub,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaGalacticRepublic,
} from "react-icons/fa6";

export const profile = {
  name: "Slayder Reyes Cuellar",
  shortName: "Slayder",
  handle: "slaternight",
  email: "slaternightdev@gmail.com",
  phone: "+57 320 844 1575",
  phoneRaw: "+573208441575",
  location: "Bogotá, Colombia",
  cvUrl: "/cv-slayder.pdf",
};

export const socials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/slaternight", icon: FaLinkedinIn },
  { name: "GitHub", url: "https://github.com/Slaternight", icon: FaGithub },
  { name: "Behance", url: "https://www.behance.net/slaternight", icon: FaBehance },
  { name: "Instagram", url: "https://www.instagram.com/slaternight", icon: FaInstagram },
  { name: "X", url: "https://x.com/slaydermanreyes", icon: FaXTwitter },
  { name: "Facebook", url: "https://www.facebook.com/slayder.reyes", icon: FaFacebookF },
  { name: "Carrd", url: "https://slaternight.carrd.co", icon: FaGalacticRepublic },
  { name: "Google Dev", url: "https://g.dev/slaternight", icon: FaGoogle },
];

// Sections in page order; ids match the <section id="..."> of each component.
export const sections = ["home", "projects", "skills", "terminal", "contact"];
