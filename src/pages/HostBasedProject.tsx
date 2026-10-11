
import { useEffect, useState } from "react";

import screenshot1 from "../assets/projects/host-based/screenshot1.png";
import screenshot3 from "../assets/projects/host-based/screenshot3.png";
import screenshot5 from "../assets/projects/host-based/screenshot5.png";
import screenshot6 from "../assets/projects/host-based/screenshot6.png";
import screenshot7 from "../assets/projects/host-based/screenshot7.png";

const sections = [
  {
    title: "1. Host Discovery (Ping Scan)",
    image: screenshot1,
    command: "nmap -sn 192.168.xx.xx",
    explanation:
      "The -sn option performs a ping scan to check if the host is active without scanning ports.",
  },
  {
    title: "2. TCP SYN Scan",
    image: screenshot3,
    command: "sudo nmap -sS 192.168.xx.xx",
    explanation:
      "The -sS option performs a SYN scan to identify open TCP ports.",
  },
  {
    title: "3. Service & Version Detection",
    image: screenshot6,
    command: "sudo nmap -sS -sV -p 22,80,443,8080 192.168.xx.xx",
    explanation:
      "The -sV option enables version detection to identify running services.",
  },
  {
    title: "4. OS Detection",
    image: screenshot5,
    command: "sudo nmap -O 192.168.xx.xx",
    explanation:
      "The -O option performs OS fingerprinting to estimate the target operating system.",
  },
  {
    title: "5. Full Scan & Report Generation",
    image: screenshot7,
    command:
      "sudo nmap -sS -sV -O -p- 192.168.xx.xx -oN reconnaissance_report.txt",
    explanation:
      "Performs a full port scan with service and OS detection, then saves the output to a text file.",
  },
];

const infoCards = [
  { label: "Project Type", value: "Network Reconnaissance" },
  { label: "Tools Used", value: "Nmap, Kali Linux" },
  { label: "Environment", value: "Virtual Lab" },
  { label: "Skill Level", value: "Beginner Security Analyst" },
];

const HostBasedProject = () => {
  const [showModal, setShowModal] = useState(false);
  const [reportContent, setReportContent] = useState("Loading scan report...");

  useEffect(() => {
    fetch("/reports/reconnaissance_report.txt")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load report");
        return res.text();
      })
      .then(setReportContent)
      .catch(() => {
        setReportContent(
          "The scan report could not be loaded. Please try again later."
        );
      });
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  return (
    <main className="min-h-screen bg-[#0b1320] px-4 py-12 text-[#f2efe8] sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 border-b border-[#b46a55]/25 pb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c7b8a6]">
            Cybersecurity Project · Network Reconnaissance
          </p>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-[#f2efe8] sm:text-4xl lg:text-5xl">
            Host-Based Network Reconnaissance & Service Enumeration
          </h1>

          <p className="max-w-4xl text-base leading-8 text-[#c7b8a6] sm:text-lg">
            Practical network reconnaissance performed in a controlled lab
            environment using Nmap to identify active hosts, enumerate services,
            and document observations.
          </p>
        </header>

        <section
          aria-label="Project overview"
          className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {infoCards.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#b46a55]/25 bg-[#1f2a44] p-5"
            >
              <p className="mb-2 text-sm text-[#c7b8a6]">{item.label}</p>
              <p className="font-semibold leading-6 text-[#f2efe8]">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-16">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="mb-5 border-l-4 border-[#b46a55] pl-4 text-xl font-bold text-[#f2efe8] sm:text-2xl">
                {section.title}
              </h2>

              <img
                src={section.image}
                alt={section.title}
                loading="lazy"
                className="mb-5 block h-auto w-full rounded-xl border border-[#c7b8a6]/20 bg-[#1f2a44] shadow-xl"
              />

              <div className="mb-4 overflow-x-auto rounded-lg border border-[#b46a55]/20 bg-[#1f2a44] p-4">
                <code className="whitespace-pre-wrap break-words font-mono text-sm text-[#c7b8a6]">
                  {section.command}
                </code>
              </div>

              <p className="max-w-4xl leading-8 text-[#c7b8a6]">
                {section.explanation}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16 flex flex-col items-center gap-10">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-xl border border-[#b46a55] bg-[#b46a55] px-7 py-3 font-semibold text-[#0b1320] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c7b8a6] hover:bg-[#c7b8a6]"
          >
            View Scanned Output
          </button>

          <div className="w-full rounded-2xl border border-[#b46a55]/25 bg-[#1f2a44] p-6 shadow-xl md:w-4/5">
            <h3 className="mb-5 text-xl font-bold text-[#f2efe8]">
              Final Observations & Conclusion
            </h3>

            <ul className="list-disc space-y-3 pl-5 leading-7 text-[#c7b8a6]">
              <li>Target host was successfully discovered and confirmed active.</li>
              <li>Port 8080 was identified as open in the lab scan.</li>
              <li>
                The recorded service on port 8080 was Python SimpleHTTPServer.
              </li>
              <li>
                OS fingerprinting suggested a Linux kernel in the 5.x–6.x
                range.
              </li>
              <li>
                No critical vulnerabilities were identified during this basic
                enumeration; this does not establish that the host is
                vulnerability-free.
              </li>
              <li>
                The detailed scan output was saved for further analysis.
              </li>
            </ul>
          </div>
        </section>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1320]/90 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scan-report-title"
            className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#b46a55]/40 bg-[#1f2a44] p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Close scan report"
              className="absolute right-4 top-4 rounded-lg px-3 py-1 text-xl text-[#c7b8a6] transition-colors hover:bg-[#0b1320] hover:text-[#f2efe8]"
            >
              ×
            </button>

            <h3
              id="scan-report-title"
              className="mb-5 pr-10 text-lg font-bold text-[#f2efe8]"
            >
              Reconnaissance Scan Output
            </h3>

            <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#c7b8a6]/10 bg-[#0b1320] p-4 font-mono text-sm leading-6 text-[#c7b8a6]">
              {reportContent}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
};

export default HostBasedProject;
