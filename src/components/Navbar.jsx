import { ArrowRightIcon } from "@heroicons/react/solid";
import React from 'react';
import miLogo from '../assets/logo_1.svg';

export default function Navbar() {
  return (
    <header className="bg-black/38 md:sticky top-0 z-10 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap p-0 flex-col md:flex-row items-center">
        <a className="mb-4 md:mb-0">
          <a href="#about" className="ml-3">
           
          <img src={miLogo} className="logo" alt="My Icon" />
          </a>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
          <a href="#projects" className="mr-5 hover:text-white">
            Previous Works
          </a>
          <a href="#skills" className="mr-5 hover:text-white">
            Skills
          </a>
          {/* <a href="#testimonials" className="mr-5 hover:text-white">
            Testimonios
          </a> */}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
          ¡Hire me!
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </a>
      </div>
    </header>
  );
}