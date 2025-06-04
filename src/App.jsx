import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import About from "./components/about.jsx";
import Contact from "./components/contact.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Footer from "./components/Footer.jsx";
import Whatsapp from "./components/Whatsapp.jsx";



function App() {

  return (
    <main className="text-gray-400 bg-gray-900 body-font">
      <Navbar />
      <About />
      <Projects />
      <Skills />
      {/* <Testimonials /> */}
      <Contact />
      <Whatsapp />
      <Footer />

     
    </main>
  )
}

export default App