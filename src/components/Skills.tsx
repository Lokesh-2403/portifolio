
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  ShieldCheck,
  Layers3,
  Network,
  ArrowUpRight,
} from "lucide-react";

type ArsenalItem = {
  name: string;
  description: string;
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Code2;
  items: ArsenalItem[];
};

const categories: Category[] = [
  {
    id: "languages",
    title: "Languages & Scripting",
    subtitle: "Code, automate and investigate",
    icon: Code2,
    items: [
      { name: "Python", description: "Automate tasks and analyse security logs" },
      { name: "Bash", description: "Automate Linux commands and repetitive tasks" },
      { name: "PowerShell", description: "Inspect Windows systems and automate investigations" },
      { name: "SQL", description: "Query and filter structured security data" },
    ],
  },
  {
    id: "tools",
    title: "Security Tools",
    subtitle: "Analyse, detect and investigate",
    icon: ShieldCheck,
    items: [
      { name: "Splunk", description: "Search logs and investigate security events" },
      { name: "Wireshark", description: "Inspect packets and investigate suspicious network traffic" },
      { name: "Nmap", description: "Discover hosts and identify open network ports" },
      { name: "Kali Linux", description: "Practise security testing in authorised labs" },
      { name: "Burp Suite", description: "Inspect HTTP requests and test web applications" },
      { name: "Nessus", description: "Scan systems for known security vulnerabilities" },
      { name: "VirtualBox", description: "Build virtual machines for isolated security labs" },
      { name: "Git & GitHub", description: "Track changes and publish security projects" },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & Standards",
    subtitle: "Understand security systematically",
    icon: Layers3,
    items: [
      { name: "MITRE ATT&CK", description: "Map attacker behaviours to documented techniques" },
      { name: "NIST CSF", description: "Structure cybersecurity risk management activities" },
      { name: "OWASP", description: "Understand common web application security risks" },
    ],
  },
  {
    id: "systems",
    title: "Systems & Networking",
    subtitle: "Understand what happens underneath",
    icon: Network,
    items: [
      { name: "Windows", description: "Investigate system events, processes and user activity" },
      { name: "Linux", description: "Explore permissions, processes and system logs" },
      { name: "TCP/IP", description: "Understand network communication and transport protocols" },
      { name: "DNS", description: "Understand name resolution and suspicious domain lookups" },
      { name: "HTTP / HTTPS", description: "Understand web requests, responses and encrypted communication" },
    ],
  },
];

const colors = {
  background: "#0b1320",
  ivory: "#f2efe8",
  sand: "#c7b8a6",
  terracotta: "#b46a55",
  navy: "#1f2a44",
};

export default function Skills() {
  const [selectedItems, setSelectedItems] = useState<
    Record<string, string | null>
  >({});

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`
    );

    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`
    );
  };

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 sm:py-28"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(180,106,85,0.055)" }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center sm:mb-16"
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: colors.terracotta }}
          >
            My Technical Arsenal
          </p>

          <h2
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{ color: colors.ivory }}
          >
            Skills & Technologies
          </h2>

          <p
            className="mx-auto max-w-2xl text-sm leading-7 sm:text-base"
            style={{ color: colors.sand }}
          >
            The languages, security tools, frameworks and systems
            behind my cybersecurity learning and practical work.
          </p>

          <div
            className="mx-auto mt-6 h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, #b46a55, transparent)",
            }}
          />
        </motion.div>

        {/* Equal-sized cards */}
        <div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
          style={{ gridAutoRows: "1fr" }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const selectedName = selectedItems[category.id] ?? null;

            const selectedItem =
              category.items.find(
                (item) => item.name === selectedName
              ) ?? null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                onPointerMove={handlePointerMove}
                className="group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border p-6 sm:p-8"
                style={{
                  backgroundColor: colors.ivory,
                  borderColor: "rgba(180,106,85,0.24)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                  ["--mouse-x" as string]: "-1000px",
                  ["--mouse-y" as string]: "-1000px",
                }}
              >
                {/* Cursor-following fading glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(180,106,85,0.24), rgba(199,184,166,0.12) 35%, transparent 72%)",
                  }}
                />

                <div className="relative z-10 flex h-full flex-1 flex-col">
                  {/* Card heading */}
                  <div className="mb-7 flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: colors.navy,
                        color: colors.ivory,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-xl font-bold sm:text-2xl"
                        style={{ color: colors.background }}
                      >
                        {category.title}
                      </h3>

                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.navy }}
                      >
                        {category.subtitle}
                      </p>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 opacity-40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                      style={{ color: colors.terracotta }}
                    />
                  </div>

                  {/* Skill buttons */}
                  <div className="flex flex-wrap items-start gap-2">
                    {category.items.map((item) => {
                      const isSelected = selectedName === item.name;

                      return (
                        <motion.button
                          key={item.name}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            setSelectedItems((previous) => ({
                              ...previous,
                              [category.id]: isSelected
                                ? null
                                : item.name,
                            }))
                          }
                          aria-expanded={isSelected}
                          className="rounded-full border px-3.5 py-2 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          style={{
                            color: colors.background,
                            backgroundColor: isSelected
                              ? "#e4c5b8"
                              : "rgba(199,184,166,0.65)",
                            borderColor: isSelected
                              ? colors.terracotta
                              : "rgba(31,42,68,0.12)",
                            ["--tw-ring-color" as string]:
                              colors.terracotta,
                          }}
                        >
                          {item.name}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Selected skill description */}
                  <AnimatePresence initial={false}>
                    {selectedItem && (
                      <motion.div
                        key={selectedItem.name}
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 rounded-full border px-4 py-3 text-sm leading-relaxed"
                          style={{
                            backgroundColor: "rgba(199,184,166,0.65)",
                            borderColor: "rgba(31,42,68,0.12)",
                            color: colors.background,
                          }}
                        >
                          <span className="font-semibold">
                            {selectedItem.name}
                          </span>
                          <span aria-hidden="true"> — </span>
                          {selectedItem.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom helper text */}
                  <p
                    className="mt-auto pt-5 text-xs"
                    style={{ color: "#655d55" }}
                  >
                    Select an item to explore its practical use.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
