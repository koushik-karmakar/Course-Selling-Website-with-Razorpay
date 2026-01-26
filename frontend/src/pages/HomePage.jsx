import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import Courses from "../components/Courses.jsx";
import Testimonials from "../components/Testimonials.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
function HomePage() {

  
  const [darkMode] = useState(true);
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900 transition-colors duration-300">
        <Navbar />
        <Hero />
        <Features />
        <Courses />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
