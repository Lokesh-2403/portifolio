import React, { useState, useEffect } from "react";

import screenshot1 from "../assets/projects/host-based/screenshot1.png";
import screenshot3 from "../assets/projects/host-based/screenshot3.png";
import screenshot5 from "../assets/projects/host-based/screenshot5.png";
import screenshot6 from "../assets/projects/host-based/screenshot6.png";
import screenshot7 from "../assets/projects/host-based/screenshot7.png";

const HostBasedProject: React.FC = () => {

  const [showModal, setShowModal] = useState(false);
  const [reportContent, setReportContent] = useState("");

  /* Always open page from top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("/reports/reconnaissance_report.txt")
      .then((res) => res.text())
      .then((data) => setReportContent(data))
      .catch((err) => console.error("Error loading report:", err));
  }, []);

  const sections = [
    {
      title: "1. Host Discovery (Ping Scan)",
      image: screenshot1,
      command: "nmap -sn 192.168.xx.xx",
      explanation:
        "The -sn option performs a ping scan to check if the host is active without scanning ports."
    },
    {
      title: "2. TCP SYN Scan",
      image: screenshot3,
      command: "sudo nmap -sS 192.168.xx.xx",
      explanation:
        "The -sS option performs a stealth SYN scan to identify open TCP ports."
    },
    {
      title: "3. Service & Version Detection",
      image: screenshot6,
      command: "sudo nmap -sS -sV -p 22,80,443,8080 192.168.xx.xx",
      explanation:
        "The -sV option enables version detection to identify running services."
    },
    {
      title: "4. OS Detection",
      image: screenshot5,
      command: "sudo nmap -O 192.168.xx.xx",
      explanation:
        "The -O option performs OS fingerprinting to detect the operating system."
    },
    {
      title: "5. Full Scan & Report Generation",
      image: screenshot7,
      command:
        "sudo nmap -sS -sV -O -p- 192.168.xx.xx -oN reconnaissance_report.txt",
      explanation:
        "Performs full scan and saves output to a text file."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 md:px-20 py-16">

      

      {/* Project Title */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">
        Host-Based Network Reconnaissance & Service Enumeration
      </h1>

      <p className="text-gray-300 max-w-4xl mb-12 leading-relaxed">
        Practical reconnaissance performed in a controlled lab environment using Nmap.
      </p>

      {/* ⭐ Project Info Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">

        <div className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-xl text-center">
          <p className="text-sm text-gray-400">Project Type</p>
          <p className="text-cyan-400 font-semibold mt-1">
            Network Reconnaissance
          </p>
        </div>

        <div className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-xl text-center">
          <p className="text-sm text-gray-400">Tools Used</p>
          <p className="text-cyan-400 font-semibold mt-1">
            Nmap, Kali Linux
          </p>
        </div>

        <div className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-xl text-center">
          <p className="text-sm text-gray-400">Environment</p>
          <p className="text-cyan-400 font-semibold mt-1">
            Virtual Lab
          </p>
        </div>

        <div className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-xl text-center">
          <p className="text-sm text-gray-400">Skill Level</p>
          <p className="text-cyan-400 font-semibold mt-1">
            Beginner Security Analyst
          </p>
        </div>

      </div>

      {/* Project Steps */}
      {sections.map((section, index) => (
        <div key={index} className="mb-24">

          <h2 className="text-2xl font-semibold text-cyan-300 mb-6">
            {section.title}
          </h2>

          <img
            src={section.image}
            alt={section.title}
            className="rounded-xl border border-cyan-500/20 shadow-lg mb-6"
          />

          <div className="bg-zinc-900 p-4 rounded-lg mb-4 text-green-400 font-mono">
            {section.command}
          </div>

          <p className="text-gray-300 leading-relaxed">
            {section.explanation}
          </p>

        </div>
      ))}

      {/* Bottom Section */}
      <div className="mt-20 flex flex-col items-center space-y-10">

        {/* Scan Output Button */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-cyan-600 hover:bg-cyan-500 
                     text-white text-center 
                     px-8 py-3 
                     rounded-xl 
                     cursor-pointer 
                     transition-all duration-300 
                     shadow-md hover:shadow-cyan-500/30"
        >
          <h2 className="text-base font-semibold">
            View Scanned Output
          </h2>
        </div>

        {/* Final Conclusion */}
        <div className="w-full md:w-2/3 bg-zinc-900 border border-cyan-500/20 
                        rounded-xl p-6 shadow-lg">

          <h3 className="text-xl text-cyan-400 mb-4 font-semibold">
            Final Observations & Conclusion
          </h3>

          <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
            <li>Target host was successfully discovered and confirmed active.</li>
            <li>Port 8080 was identified as open.</li>
            <li>Service running on port 8080: Python SimpleHTTPServer.</li>
            <li>Operating system fingerprinting suggests Linux kernel 5.x–6.x.</li>
            <li>No critical vulnerabilities detected during basic enumeration.</li>
            <li>Full detailed scan output documented for further security analysis.</li>
          </ul>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-zinc-900 w-[90%] md:w-[75%] h-[70%] rounded-xl border border-cyan-500/30 shadow-2xl p-6 relative overflow-hidden">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg text-cyan-400 mb-4">
              Reconnaissance Scan Output
            </h3>

            <div className="bg-black p-4 rounded-lg h-[85%] overflow-y-auto text-white font-mono text-sm whitespace-pre-wrap">
              {reportContent}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default HostBasedProject;