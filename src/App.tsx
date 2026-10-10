
import { useState } from "react";

import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";

import Footer from "./components/Footer";
import CyberCursor from "./components/CyberCursor";
import HostBasedProject from "./pages/HostBasedProject";
import WindowsEventLogProject from "./pages/WindowsEventLogProject";
import AIChat from "./components/AIChat";

function App() {
  const [activePage, setActivePage] = useState<"home" | "host" | "windows">("home");

  return (
    <div
      className="relative min-h-screen bg-secondary-bg font-inter"
      style={{ animation: "portfolioFadeIn 0.8s ease forwards" }}
    >
      <CyberCursor />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: "rgba(11, 19, 32, 0.4)" }}
      ></div>

      <div className="relative z-10">
        {activePage === "home" && (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects
              onViewHostProject={() => setActivePage("host")}
              onViewWindowsProject={() => setActivePage("windows")}
            />
            <Certifications />
            <Contact />
            <Footer />
          </>
        )}

        {activePage === "host" && (
          <>
            <button
              onClick={() => setActivePage("home")}
              className="text-[#b46a55] px-6 pt-6 hover:text-[#c7b8a6] transition-colors"
            >
              ← Back to Home
            </button>
            <HostBasedProject />
          </>
        )}

        {activePage === "windows" && (
          <>
            <button
              onClick={() => setActivePage("home")}
              className="text-[#b46a55] px-6 pt-6 hover:text-[#c7b8a6] transition-colors"
            >
              ← Back to Home
            </button>
            <WindowsEventLogProject />
          </>
        )}
      </div>

      <AIChat />
    </div>
  );
}

export default App;
