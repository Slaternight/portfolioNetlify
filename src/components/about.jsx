import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import pictureMine from "../assets/profile/ft.png";
import gifAdventure from "../assets/catAdventure.gif";

const TYPING_WORDS = ["React", "NodeJS", "ExpressJS", "Html", "Sass", "Webpack", "Wordpress", "Shopify"];

export default function About() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const wordRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Animar salida
      gsap.to(wordRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          // Cambiar palabra
          setCurrentWordIndex((prev) =>
            prev === TYPING_WORDS.length - 1 ? 0 : prev + 1
          );
        },
      });
    }, 2000); // Cambia cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animar entrada
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }, [currentWordIndex]);

  return (
    <section id="about" className="bg-[url(./assets/sunsetWallpaper.jpeg)] bg-top bg-cover bg-no-repeat bg-fixed p-4">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center  rounded-md backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 bg-clip-padding">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            Hi, i'm Invin....
            <br className="hidden lg:inline-block" />
            I love building web applications.
          </h1>
          <p className="mb-8 leading-relaxed text-white">
            I am a web developer with experience in building web applications with technologies such as{" "}
            <span
              ref={wordRef}
              className="text-green-400 font-semibold inline-block"
            >
              {TYPING_WORDS[currentWordIndex]}
            </span>
          </p>
          <div className="flex justify-center">
            <a
              href="#contact"
              className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
            >
              Work with me
            </a>
            <a
              href="#projects"
              className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
            >
              See my previous work
            </a>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded"
            alt="heroo"
            src={gifAdventure}
          />
        </div>
      </div>
    </section>
  );
}
