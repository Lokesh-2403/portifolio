import { useState } from "react";

import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Resume from "./components/Resume";
import Footer from "./components/Footer";
import CyberCursor from './components/CyberCursor';
import HostBasedProject from "./pages/HostBasedProject";
import WindowsEventLogProject from "./pages/WindowsEventLogProject";
import PortfolioAssistant from "./components/Assistant.tsx";

function App() {
  const [activePage, setActivePage] = useState<"home" | "host" | "windows">("home");

  return (
    <div
      className="relative min-h-screen bg-secondary-bg font-inter"
      style={{ animation: "portfolioFadeIn 0.8s ease forwards" }}
    >
      <CyberCursor />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

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
            <Resume />
            <Footer />
          </>
        )}

        {activePage === "host" && (
          <>
            <button
              onClick={() => setActivePage("home")}
              className="text-cyan-400 px-6 pt-6 hover:text-cyan-300 transition-colors"
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
              className="text-cyan-400 px-6 pt-6 hover:text-cyan-300 transition-colors"
            >
              ← Back to Home
            </button>
            <WindowsEventLogProject />
          </>
        )}

      </div>

      <PortfolioAssistant /> {/* ← ADD THIS */}
    </div>
  );
}

export default App;