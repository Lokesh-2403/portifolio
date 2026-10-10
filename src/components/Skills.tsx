
import { useState } from "react";
import { Wrench, Shield } from "lucide-react";

export default function Skills() {

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const skills = [
    "Network Traffic Analysis",
    "Threat Detection",
    "Security Monitoring",
    "Log Analysis",
    "Incident Investigation",
    "MITRE ATT&CK Mapping",
    "Malware Analysis Fundamentals",
    "Phishing Investigation",
    "SIEM & Detection Fundamentals"
  ];

  const tools = [
    "Splunk",
    "Wireshark",
    "Nmap",
    "Burp Suite",
    "Kali Linux",
    "Nessus",
    "Git & GitHub",
    "VirtualBox"
  ];

  return (
    <section id="skills" className="relative py-28 bg-[#0b1320]">

      <div className="container mx-auto px-6">

        {/* SECTION TITLE */}

        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#f2efe8] mb-4">
            Skills & Tools
          </h2>

          <p className="text-[#c7b8a6] max-w-xl mx-auto">
            Practical cybersecurity skills and tools focused on security monitoring,
            log analysis, threat detection and incident investigation.
          </p>
        </div>

        {/* CARD CONTAINER */}

        <div className="flex justify-center items-center">

          <div
            onClick={() => setOpen(true)}
            className={`relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${open ? "w-[700px] h-[352px]" : "w-[360px] h-[130px]"}`}
          >

            {/* INITIAL CARD */}

            {!open && (

              <div
                className="flex flex-col items-center justify-center h-full rounded-2xl border cursor-pointer"
                style={{
                  borderColor: "rgba(180,106,85,0.4)",
                  boxShadow: "0 0 25px rgba(180,106,85,0.2)",
                  background: "rgba(242,239,232,0.02)",
                  transition: "all 0.5s ease"
                }}
              >

                <h3 className="text-xl font-semibold text-[#f2efe8]">
                  Skills & Tools
                </h3>

                <p className="text-[#c7b8a6] text-sm mt-2">
                  Click to explore
                </p>

              </div>

            )}

            {/* SPLIT CARDS */}

            {open && (

              <div className="flex gap-6 h-full">

                {/* SKILLS CARD */}

                <div
                  onMouseEnter={() => setHovered("skills")}
                  onMouseLeave={() => setHovered(null)}
                  className="flex-1 rounded-2xl border p-6 transition-all duration-500"
                  style={{
                    borderColor: "rgba(180,106,85,0.4)",
                    background: "rgba(242,239,232,0.02)",
                    transform: hovered === "skills" ? "scale(1.05)" : "scale(1)",
                    boxShadow:
                      hovered === "skills"
                        ? "0 0 35px rgba(180,106,85,0.4)"
                        : "none"
                  }}
                >

                  <div className="flex items-center gap-3 mb-5">

                    <div className="p-2 rounded-lg bg-[#b46a55] text-[#f2efe8]">
                      <Shield className="w-5 h-5"/>
                    </div>

                    <h3 className="text-lg font-semibold text-[#b46a55]">
                      Skills
                    </h3>

                  </div>

                  <ul className="space-y-2">

                    {skills.map((skill, i) => (

                      <li
                        key={i}
                        className="flex gap-2 text-[#c7b8a6] text-sm"
                      >
                        <span className="text-[#b46a55]">▹</span>
                        {skill}
                      </li>

                    ))}

                  </ul>

                </div>

                {/* TOOLS CARD */}

                <div
                  onMouseEnter={() => setHovered("tools")}
                  onMouseLeave={() => setHovered(null)}
                  className="flex-1 rounded-2xl border p-6 transition-all duration-500"
                  style={{
                    borderColor: "rgba(180,106,85,0.4)",
                    background: "rgba(242,239,232,0.02)",
                    transform: hovered === "tools" ? "scale(1.05)" : "scale(1)",
                    boxShadow:
                      hovered === "tools"
                        ? "0 0 35px rgba(180,106,85,0.4)"
                        : "none"
                  }}
                >

                  <div className="flex items-center gap-3 mb-5">

                    <div className="p-2 rounded-lg bg-[#b46a55] text-[#f2efe8]">
                      <Wrench className="w-5 h-5"/>
                    </div>

                    <h3 className="text-lg font-semibold text-[#b46a55]">
                      Tools
                    </h3>

                  </div>

                  <ul className="space-y-2">

                    {tools.map((tool, i) => (

                      <li
                        key={i}
                        className="flex gap-2 text-[#c7b8a6] text-sm"
                      >
                        <span className="text-[#b46a55]">▹</span>
                        {tool}
                      </li>

                    ))}

                  </ul>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}
