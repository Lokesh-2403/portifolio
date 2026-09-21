import { useState, useEffect } from "react";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Github,
  Youtube,
} from "lucide-react";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  youtube?: string;
}

export const projects: Project[] = [
  {
    title: "Host-Based Network Reconnaissance & Service Enumeration",
    description:
      "Performed controlled network reconnaissance using Nmap to identify live hosts, enumerate open ports, detect services, and perform basic OS fingerprinting in a lab environment.",
    tags: [
      "Kali Linux",
      "Nmap",
      "TCP SYN Scan",
      "Service Enumeration",
      "OS Detection",
    ],
  },

  {
    title: "Windows Security Event Log Analysis & Threat Detection",
    description:
      "Analyzed Windows Security Event Logs to investigate authentication activity and identify suspicious login patterns using a practical log investigation workflow.",
    tags: [
      "Windows Event Viewer",
      "Log Analysis",
      "Threat Detection",
      "Security Monitoring",
    ],
  },

  {
    title:
      "SIH26237: Cryptographic Attribution & Immutable Decryption Provenance",
    description:
      "A post-quantum secure document distribution system that generates recipient- and session-specific forensic watermarks during decryption, cryptographically signs each decryption event, and records the evidence in an offline tamper-evident distributed ledger for verifiable leak attribution.",
    tags: [
      "Python",
      "FastAPI",
      "AES-256-GCM",
      "ML-KEM-768",
      "ML-DSA-65",
      "Forensic Watermarking",
      "Distributed Ledger",
    ],
    github: "https://github.com/Lokesh-2403/SIH26237",
    youtube: "https://www.youtube.com/watch?v=wMYIlkYO_ok",
  },
];

interface ProjectsProps {
  onViewHostProject: () => void;
  onViewWindowsProject: () => void;
}

export default function Projects({
  onViewHostProject,
  onViewWindowsProject,
}: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = projects.length;

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const CARD_WIDTH = 360;
  const GAP = 40;

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
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "auto",
                          paddingTop: "24px",
                        }}
                      >
                        {/* DETAILS */}
                        {(index === 0 || index === 1) && (
                          <button
                            onClick={
                              index === 0
                                ? onViewHostProject
                                : onViewWindowsProject
                            }
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "7px",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(6,182,212,0.45)",
                              background:
                                "rgba(6,182,212,0.08)",
                              color: "#67e8f9",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(6,182,212,0.18)";
                              e.currentTarget.style.borderColor =
                                "#06b6d4";
                              e.currentTarget.style.boxShadow =
                                "0 0 14px rgba(6,182,212,0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(6,182,212,0.08)";
                              e.currentTarget.style.borderColor =
                                "rgba(6,182,212,0.45)";
                              e.currentTarget.style.boxShadow =
                                "none";
                            }}
                          >
                            Details <ExternalLink size={14} />
                          </button>
                        )}

                        {/* GITHUB */}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "7px",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(255,255,255,0.18)",
                              background:
                                "rgba(255,255,255,0.04)",
                              color: "#e5e7eb",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.1)";
                              e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.35)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.04)";
                              e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.18)";
                            }}
                          >
                            <Github size={15} />
                            GitHub
                          </a>
                        )}

                        {/* YOUTUBE */}
                        {project.youtube && (
                          <a
                            href={project.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "7px",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(255,255,255,0.18)",
                              background:
                                "rgba(255,255,255,0.04)",
                              color: "#e5e7eb",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.1)";
                              e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.35)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.04)";
                              e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.18)";
                            }}
                          >
                            <Youtube size={16} />
                            Demo
                          </a>
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
          {activeIndex + 1}
        </p>
      </div>
    </section>
  );
}