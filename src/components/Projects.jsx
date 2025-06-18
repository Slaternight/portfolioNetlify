import { CodeIcon } from "@heroicons/react/solid";
import { projects } from "../projects";
import { useState } from "react";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((project) => project.category === activeTab);

  return (
    <section id="projects" className="text-gray-400 bg-white-900 body-font">
      <div className="container px-5 py-10 mx-auto text-center lg:px-40">
        <div className="flex flex-col w-full mb-10">
          <CodeIcon className="mx-auto inline-block w-10 mb-4" />
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
            Applications I have built from scratch
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Check out some of the projects that I have worked, using various technologies and frameworks.
            <br />
            Always learning and improving the way I code and UI/UX design.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
                ${
                  activeTab === category
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="flex flex-wrap -m-4">
          {filteredProjects.map((project) => (
            <a
              href={project.link}
              key={project.image}
              className="sm:w-1/2 w-full p-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex relative h-[300px] overflow-hidden rounded-lg shadow-lg shadow-indigo-500/50">
                <video
                  autoPlay
                  muted
                  loop
                  alt="gallery"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  src={project.image}
                />
                <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                    {project.subtitle}
                  </h2>
                  <h1 className="title-font text-lg font-medium text-white mb-3">
                    {project.title}
                  </h1>
                  <p className="leading-relaxed">{project.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}