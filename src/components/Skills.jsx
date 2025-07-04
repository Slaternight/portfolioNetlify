import { ChipIcon } from "@heroicons/react/solid";
import { skills } from "../data";
import "../effect";

export default function Skills() {
  return (
    <section id="skills">
      <div className="container px-5 py-10 mx-auto">
        <div className="text-center mb-20">
          <ChipIcon className="w-10 inline-block mb-4 text-white" />
          <h1 className="sm:text-4xl text-3xl font-medium title-font text-white mb-4">
            Skills and Tech
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-300">
            Here you will find the skills and technologies that I have used in my latest projects.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {skills.map(({ name, icon: Icon }) => (
            <div
  key={name}
  className="relative group w-24 h-24 flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 transition"
>
  <Icon className="text-3xl text-indigo-400" />

  {/* Tooltip */}
  <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-10 whitespace-nowrap">
    {name}
  </div>
</div>
          ))}
        </div>
      </div>
    </section>
  );
}