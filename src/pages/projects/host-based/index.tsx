
import React from "react";

import screenshot1 from "../assets/projects/host/Screenshot1.png";
import screenshot3 from "../assets/projects/host/Screenshot3.png";
import screenshot6 from "../assets/projects/host/Screenshot6.png";
import screenshot5 from "../assets/projects/host/Screenshot5.png";
import screenshot7 from "../assets/projects/host/Screenshot7.png";

const HostBasedProject: React.FC = () => {
  const sections = [
    {
      title: "1. Host Discovery (Ping Scan)",
      image: screenshot1,
      command: "nmap -sn 192.168.xx.xx",
      explanation:
        "The -sn option performs a ping scan to check if the host is active without scanning ports. This confirms reachability before deeper reconnaissance."
    },
    {
      title: "2. TCP SYN Scan",
      image: screenshot3,
      command: "sudo nmap -sS 192.168.xx.xx",
      explanation:
        "The -sS option performs a stealth SYN scan to identify open TCP ports. It is faster and less detectable than full TCP connect scans."
    },
    {
      title: "3. Service & Version Detection",
      image: screenshot6,
      command: "sudo nmap -sS -sV -p 22,80,443,8080 192.168.xx.xx",
      explanation:
        "The -sV option enables version detection to identify running services and their versions, which is important for vulnerability analysis."
    },
    {
      title: "4. OS Detection",
      image: screenshot5,
      command: "sudo nmap -O 192.168.xx.xx",
      explanation:
        "The -O option performs OS fingerprinting to detect the operating system of the target system."
    },
    {
      title: "5. Full Scan & Report Generation",
      image: screenshot7,
      command:
        "sudo nmap -sS -sV -O -p- 192.168.xx.xx -oN reconnaissance_report.txt",
      explanation:
        "This command performs a full port scan, service detection, OS detection, and saves the output into a text file for documentation."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1320] text-[#f2efe8] px-6 md:px-20 py-16">

      <h1 className="text-4xl font-bold text-[#b46a55] mb-6">
        Host-Based Network Reconnaissance & Service Enumeration
      </h1>

      <p className="text-[#c7b8a6] max-w-4xl mb-16 leading-relaxed">
        This project demonstrates practical network reconnaissance performed
        on my local system using Nmap. The objective was to identify live hosts,
        enumerate open ports, detect services, and determine the operating system.
      </p>

      {sections.map((section, index) => (
        <div key={index} className="mb-24">
          <h2 className="text-2xl font-semibold text-[#c7b8a6] mb-6">
            {section.title}
          </h2>

          <img
            src={section.image}
            alt={section.title}
            className="rounded-xl border border-[#b46a55]/20 shadow-lg mb-6"
          />

          <div className="bg-[#1f2a44] p-4 rounded-lg mb-4 text-[#c7b8a6] font-mono">
            {section.command}
          </div>

          <p className="text-[#c7b8a6] leading-relaxed">
            {section.explanation}
          </p>
        </div>
      ))}

      <div className="bg-[#1f2a44] p-8 rounded-xl border border-[#b46a55]/20">
        <h2 className="text-2xl text-[#b46a55] font-semibold mb-4">
          Final Reconnaissance Report
        </h2>

        <ul className="list-disc list-inside text-[#c7b8a6] space-y-2">
          <li>Host is active and reachable.</li>
          <li>Port 8080 is open.</li>
          <li>Service running: SimpleHTTPServer (Python 3.13.11).</li>
          <li>Operating System detected: Linux Kernel 5.x–6.x.</li>
          <li>Scan results saved in reconnaissance_report.txt.</li>
        </ul>
      </div>

    </div>
  );
};

export default HostBasedProject;
