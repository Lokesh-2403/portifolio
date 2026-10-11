
import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Shield } from "lucide-react";

const skills = [
  "Network Traffic Analysis",
  "Threat Detection",
  "Security Monitoring",
  "Log Analysis",
  "Incident Investigation",
  "MITRE ATT&CK Mapping",
  "Malware Analysis Fundamentals",
  "Phishing Investigation",
  "SIEM & Detection Fundamentals",
];

const tools = [
  "Splunk",
  "Wireshark",
  "Nmap",
  "Burp Suite",
  "Kali Linux",
  "Nessus",
  "Git & GitHub",
  "VirtualBox",
];

const categories = [
  {
    id: "skills",
    title: "Skills",
    subtitle: "Core cybersecurity skills",
    icon: Shield,
    items: skills,
  },
  {
    id: "tools",
    title: "Tools",
    subtitle: "Security and analysis tools",
    icon: Wrench,
    items: tools,
  },
];

const pillStyle = {
  backgroundColor: "#c7b8a6",
  color: "#0b1320",
  border: "1px solid rgba(31,42,68,0.12)",
};

export default function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="skills" className="relative bg-[#0b1320] py-28">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-[#f2efe8] lg:text-5xl">
            Skills & Tools
          </h2>

          <p className="mx-auto max-w-xl leading-relaxed text-[#c7b8a6]">
            Practical cybersecurity skills and tools focused on security
            monitoring, log analysis, threat detection and incident
            investigation.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isHovered = hovered === category.id;
            const isOtherHovered =
              hovered !== null && hovered !== category.id;

            return (
              <motion.div
                key={category.id}
                onMouseEnter={() => setHovered(category.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(category.id)}
                onBlur={() => setHovered(null)}
                animate={{
                  scale: isHovered ? 1.035 : 1,
                  opacity: isOtherHovered ? 0.55 : 1,
                  y: isHovered ? -5 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  mass: 0.8,
                }}
                className="relative min-w-0 rounded-[2rem] border p-6 sm:p-8"
                style={{
                  backgroundColor: "#f2efe8",
                  borderColor: isHovered
                    ? "#b46a55"
                    : "rgba(180,106,85,0.35)",
                  boxShadow: isHovered
                    ? "0 20px 45px rgba(180,106,85,0.22)"
                    : "0 8px 24px rgba(0,0,0,0.12)",
                  transition:
                    "border-color 250ms ease, box-shadow 250ms ease",
                }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f2a44] text-[#f2efe8]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#0b1320]">
                      {category.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#1f2a44]">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-2.5">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex max-w-full items-center rounded-full px-3.5 py-2 text-sm font-medium leading-snug transition-colors duration-200 hover:bg-[#b46a55]"
                      style={pillStyle}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
