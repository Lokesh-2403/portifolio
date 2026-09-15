import { useState, useEffect } from "react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  status: "Planned" | "Underway" | "Completed";
  githubLink?: string;
}

interface ProjectsProps {
  onViewHostProject: () => void;
  onViewWindowsProject: () => void;
}

export default function Projects({
  onViewHostProject,
  onViewWindowsProject,
}: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* Always scroll to top when page opens */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projects: Project[] = [
    {
      title: "Host-Based Network Reconnaissance & Service Enumeration",
      status: "Completed",
      description:
        "Performed controlled network reconnaissance using Nmap to identify live hosts, enumerate open ports, detect services, and perform basic OS fingerprinting in a lab environment.",
      tags: [
        "Kali Linux",
        "Nmap",
        "TCP SYN Scan",
        "Service Enumeration",
        "OS Detection",
      ],
      githubLink:
        "https://github.com/Lokesh-2403/host-based-reconnaissance",
    },

    {
      title: "Windows Security Event Log Analysis & Threat Detection",
      status: "Completed",
      description:
        "Analyzed Windows Security Event Logs to investigate authentication activity and identify suspicious login patterns using a practical log investigation workflow.",
      tags: [
        "Windows Event Viewer",
        "Log Analysis",
        "Threat Detection",
        "Security Monitoring",
      ],
      githubLink: "https://github.com/Lokesh-2403/windows-login",
    },

    {
      title: "Linux SSH Brute Force Detection System",
      status: "Completed",
      description:
        "Analyzed Linux authentication logs and used Bash, Python, and regular expressions to identify repeated failed SSH login attempts associated with brute-force activity.",
      tags: [
        "Kali Linux",
        "Bash",
        "Python",
        "Regex",
        "Log Analysis",
      ],
      githubLink: "https://github.com/Lokesh-2403/ssh-brute-force",
    },

    {
      title: "Endpoint Security Monitoring",
      status: "Underway",
      description:
        "Building a controlled Linux endpoint monitoring lab to observe system activity, authentication events, processes, and security-related logs.",
      tags: ["Wazuh", "Auditd", "Syslog", "Endpoint Monitoring"],
    },

    {
      title: "Web Application Security Testing Lab",
      status: "Planned",
      description:
        "Planned hands-on lab for learning common web application vulnerabilities and understanding how security testing tools are used to identify them.",
      tags: ["Burp Suite", "OWASP ZAP", "SQL Injection", "XSS"],
    },

    {
      title: "SIEM & Threat Hunting Lab",
      status: "Planned",
      description:
        "Planned security monitoring lab focused on collecting logs, creating basic detections, investigating security events, and learning threat-hunting workflows.",
      tags: ["Splunk", "ELK", "Log Analysis", "Threat Hunting"],
    },

    {
      title: "Active Directory Security Lab",
      status: "Planned",
      description:
        "Planned Windows Active Directory lab for learning common attack techniques, authentication weaknesses, privilege escalation concepts, and defensive detection.",
      tags: ["Active Directory", "BloodHound", "Windows Security"],
    },

    {
      title: "Cloud Security Assessment Lab",
      status: "Planned",
      description:
        "Planned lab for learning how cloud environments are assessed for common configuration and security issues across identity, storage, networking, and access controls.",
      tags: ["AWS", "Azure", "Prowler", "Cloud Security"],
    },

    {
      title: "Malware Analysis Fundamentals Lab",
      status: "Planned",
      description:
        "Planned isolated lab for learning the fundamentals of static and dynamic malware analysis, including file behavior, indicators, and basic analysis techniques.",
      tags: ["Ghidra", "Static Analysis", "Dynamic Analysis", "Malware Analysis"],
    },
  ];

  const total = projects.length;

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const CARD_WIDTH = 360;
  const GAP = 40;

  const getStatusStyle = (status: Project["status"]) => {
    if (status === "Completed") return { color: "#6ee7b7" };
    if (status === "Underway") return { color: "#93c5fd" };
    return { color: "#fde68a" };
  };

  return (
    <section
      id="projects"
      style={{
        background: "#000",
        padding: "120px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "70px",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Security Projects
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Hands-on cybersecurity projects built in controlled lab
            environments.
          </p>
        </div>

        {/* Navigation */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={prev}
            aria-label="Previous project"
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Carousel */}

          <div
            style={{
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: `${GAP}px`,
                transform: `translateX(calc(50% - ${
                  CARD_WIDTH / 2
                }px - ${activeIndex * (CARD_WIDTH + GAP)}px))`,
                transition:
                  "transform 0.6s cubic-bezier(.22,1,.36,1)",
              }}
            >
              {projects.map((project, index) => {
                const diff = index - activeIndex;
                const isActive = diff === 0;

                return (
                  <div
                    key={index}
                    style={{
                      width: `${CARD_WIDTH}px`,
                      flexShrink: 0,
                      transform: isActive
                        ? "scale(1)"
                        : "scale(0.85)",
                      opacity: isActive ? 1 : 0.4,
                      transition: "all 0.5s ease",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "18px",
                        padding: "28px",
                        border: isActive
                          ? "1px solid #06b6d4"
                          : "1px solid rgba(255,255,255,0.08)",
                        background: isActive
                          ? "rgba(6,182,212,0.05)"
                          : "rgba(255,255,255,0.02)",
                        boxShadow: isActive
                          ? "0 0 40px rgba(6,182,212,0.25)"
                          : "none",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Status */}

                      <span
                        style={{
                          fontSize: "11px",
                          ...getStatusStyle(project.status),
                        }}
                      >
                        {project.status}
                      </span>

                      {/* Title */}

                      <h3
                        style={{
                          color: "#fff",
                          fontSize: "18px",
                          margin: "10px 0",
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}

                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "14px",
                          lineHeight: "1.7",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Tags */}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginTop: "18px",
                        }}
                      >
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "11px",
                              padding: "4px 9px",
                              borderRadius: "999px",
                              background:
                                "rgba(255,255,255,0.04)",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                              color: "#9ca3af",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Buttons */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "auto",
                          paddingTop: "24px",
                        }}
                      >
                        {/* DETAILS */}

                        <button
                          onClick={
                            index === 0
                              ? onViewHostProject
                              : index === 1
                              ? onViewWindowsProject
                              : undefined
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#e5e7eb",
                            cursor:
                              index === 0 || index === 1
                                ? "pointer"
                                : "default",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          Details <ExternalLink size={14} />
                        </button>

                        {/* GITHUB */}

                        {project.githubLink && (
                          <button
                            onClick={() =>
                              window.open(
                                project.githubLink,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            style={{
                              background: "none",
                              border: "none",
                              color: "#9ca3af",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Github size={15} /> GitHub
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Next project"
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Project Counter */}

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#374151",
            fontSize: "12px",
            letterSpacing: "0.2em",
          }}
        >
          {activeIndex + 1} / {total}
        </p>
      </div>
    </section>
  );
}