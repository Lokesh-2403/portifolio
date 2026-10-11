
import { useEffect, useState } from "react";

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

type ActivePage = "home" | "host" | "windows";

function App() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [returnToProjects, setReturnToProjects] = useState(false);

  useEffect(() => {
    if (activePage !== "home" || !returnToProjects) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setReturnToProjects(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePage, returnToProjects]);

  const openProject = (page: "host" | "windows", index: number) => {
    setSelectedProjectIndex(index);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const backToProjects = () => {
    setReturnToProjects(true);
    setActivePage("home");
  };

  return (
    <div
      className="relative min-h-screen bg-secondary-bg font-inter"
      style={{ animation: "portfolioFadeIn 0.8s ease forwards" }}
    >
      <CyberCursor />

      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: "rgba(11, 19, 32, 0.4)" }}
      />

      <div className="relative z-10">
        {activePage === "home" && (
          <>
            <Hero />
            <About />
            <Skills />

            <Projects
              initialActiveIndex={selectedProjectIndex}
              onViewHostProject={() => openProject("host", 0)}
              onViewWindowsProject={() => openProject("windows", 1)}
            />

            <Certifications />
            <Contact />
            <Footer />
          </>
        )}

        {activePage === "host" && (
          <>
            <div className="bg-[#0b1320] px-6 pt-6 md:px-20">
              <button
                onClick={backToProjects}
                className="inline-flex items-center gap-2 rounded-lg border border-[#b46a55]/40 px-4 py-2 text-sm font-semibold text-[#f2efe8] transition-all duration-300 hover:border-[#b46a55] hover:bg-[#1f2a44] hover:text-[#c7b8a6]"
              >
                <span aria-hidden="true">←</span>
                Back to Projects
              </button>
            </div>

            <HostBasedProject />
          </>
        )}

        {activePage === "windows" && (
          <>
            <div className="bg-[#0b1320] px-6 pt-6 md:px-20">
              <button
                onClick={backToProjects}
                className="inline-flex items-center gap-2 rounded-lg border border-[#b46a55]/40 px-4 py-2 text-sm font-semibold text-[#f2efe8] transition-all duration-300 hover:border-[#b46a55] hover:bg-[#1f2a44] hover:text-[#c7b8a6]"
              >
                <span aria-hidden="true">←</span>
                Back to Projects
              </button>
            </div>

            <WindowsEventLogProject />
          </>
        )}
      </div>

      <AIChat />
    </div>
  );
}

export default App;
