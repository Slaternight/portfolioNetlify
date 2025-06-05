import { BadgeCheckIcon, ChipIcon, FlagIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faBehance,
  faInstagram,
  faLinkedinIn,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
     <footer className="text-center bg-black-900">
      <div className="py-6">
        <div className="flex justify-center space-x-6 text-gray-700 text-xl">
          <a href="https://www.facebook.com/slayder.reyes" target="_blank"><FontAwesomeIcon icon={faFacebookF} className="hover:text-blue-600 transition text-2xl" /></a>
          <a href="https://x.com/slaydermanreyes" target="_blank"><FontAwesomeIcon icon={faTwitter} className="hover:text-sky-500 transition text-2xl" /></a>
          <a href="https://www.behance.net/slayderreyes/projects" target="_blank"><FontAwesomeIcon icon={faBehance} className="hover:text-red-500 transition text-2xl" /></a>
          <a href="https://www.instagram.com/slaternight/" target="_blank"><FontAwesomeIcon icon={faInstagram} className="hover:text-pink-500 transition text-2xl" /></a>
          <a href="https://www.linkedin.com/in/slayder-reyes-cuellar-2b7b801a0/" target="_blank"><FontAwesomeIcon icon={faLinkedinIn} className="hover:text-blue-700 transition text-2xl" /></a>
          <a href="https://github.com/Slaternight" target="_blank"><FontAwesomeIcon icon={faGithub} className="hover:text-black transition text-2xl" /></a>
        </div>
      </div>
      <div className="text-sm text-white-800 py-4">
        © 2025 · Designed & developed by <a href="https://www.linkedin.com/in/slayder-reyes-cuellar-2b7b801a0/" className="hover:underline" target="_blank">Slayder Reyes Cuellar </a>
      </div>
    </footer>
  );
}