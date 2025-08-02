import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import gifAdventure from "../assets/catAdventure.gif";

const TYPING_WORDS = ["React", "NodeJS", "ExpressJS", "Html", "Sass", "Tailwind", "Bootstrap5", "Webpack", "Wordpress", "Shopify"];

export default function About() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const wordRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("entry.173880551", name); // Reemplaza con tu ID real
    formData.append("entry.904923825", email); // Reemplaza con tu ID real

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSc51F-16M-7QNz5_UGcG190Ed-D3WPDWB-PUppxwYYp_UcW2Q/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }).then(() => {
      setSubmitted(true);
      setShowModal(false);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(wordRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          setCurrentWordIndex((prev) =>
            prev === TYPING_WORDS.length - 1 ? 0 : prev + 1
          );
        },
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }, [currentWordIndex]);

  return (
    <section id="about" className="bg-[url(./assets/sunsetWallpaper.jpeg)] bg-top bg-cover bg-no-repeat bg-fixed p-9">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center rounded-md backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 bg-clip-padding">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            Hi, I'm Slayder Reyes Cuellar
            <br className="hidden lg:inline-block" />
            I love building web applications.
          </h1>
          <p className="mb-8 leading-relaxed text-white">
            I am a web developer with experience in building web applications with technologies such as{" "}
            <span ref={wordRef} className="text-green-400 font-semibold inline-block">
              {TYPING_WORDS[currentWordIndex]}
            </span>
          </p>

          <div className="flex flex-wrap justify-center gap-4">
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

            {!submitted ? (
              <button
                onClick={() => setShowModal(true)}
                className="text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg"
              >
                Download CV
              </button>
            ) : (
              <a
                href="/cv-slayder.pdf"
                download
                className="text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded text-lg"
              >
                Download CV
              </a>
            )}
          </div>
        </div>

        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded" alt="heroo" src={gifAdventure} />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Fill this to download my CV</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit & Download
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
