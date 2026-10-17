
import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Github,
} from "lucide-react";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
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
    title: "SIH26237: Cryptographic Attribution & Immutable Decryption Provenance",
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
    demo: "https://sih-26237.vercel.app",
  },
];

interface ProjectsProps {
  onViewHostProject: (index: number) => void;
  onViewWindowsProject: (index: number) => void;
  initialActiveIndex?: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

export default function Projects({
  onViewHostProject,
  onViewWindowsProject,
  initialActiveIndex = 0,
}: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cursorGlow, setCursorGlow] = useState<
    Record<string, CursorPosition>
  >({});

  const viewportRef = useRef<HTMLDivElement>(null);

  const total = projects.length;

  useEffect(() => {
    setActiveIndex(
      Math.min(Math.max(initialActiveIndex, 0), total - 1)
    );
  }, [initialActiveIndex, total]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });

    observer.observe(viewport);
    setViewportWidth(viewport.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const cardWidth = Math.min(360, Math.max(0, viewportWidth));
  const gap = viewportWidth < 640 ? 16 : 32;

  const nextProject = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  const previousProject = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const handleCardMouseMove = (
    event: React.MouseEvent<HTMLElement>,
    title: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setCursorGlow((current) => ({
      ...current,
      [title]: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    }));
  };

  const handleCardMouseLeave = (title: string) => {
    setCursorGlow((current) => {
      const next = { ...current };
      delete next[title];
      return next;
    });
  };

  const trackOffset =
    viewportWidth > 0
      ? viewportWidth / 2 -
        cardWidth / 2 -
        activeIndex * (cardWidth + gap)
      : 0;

  return (
    <section
      id="projects"
      className="w-full"
      style={{
        backgroundColor: "#0b1320",
        padding: "24px 0 32px",
        overflow: "hidden",
        scrollMarginTop: "0px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 40px)",
          boxSizing: "border-box",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              color: "#f2efe8",
              fontSize: "clamp(30px, 4vw, 48px)",
              lineHeight: 1.15,
              fontWeight: 700,
              margin: "0 0 12px",
            }}
          >
            Security Projects
          </h2>

          <p
            style={{
              color: "#c7b8a6",
              fontSize: "15px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Hands-on cybersecurity projects built in controlled lab
            environments.
          </p>
        </header>

        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={previousProject}
            aria-label="Previous project"
            style={{
              position: "absolute",
              left: viewportWidth < 640 ? "-8px" : "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#b46a55",
              color: "#0b1320",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            <ChevronLeft size={23} />
          </button>

          <div
            ref={viewportRef}
            style={{
              width: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
              padding: "24px 0",
              margin: "-24px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: `${gap}px`,
                width: "max-content",
                transform: `translateX(${trackOffset}px)`,
                transition: "transform 350ms ease",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            >
              {projects.map((project, index) => {
                const isActive = index === activeIndex;
                const glow = cursorGlow[project.title];

                return (
                  <article
                    key={project.title}
                    onMouseMove={(event) =>
                      handleCardMouseMove(event, project.title)
                    }
                    onMouseLeave={() =>
                      handleCardMouseLeave(project.title)
                    }
                    style={{
                      position: "relative",
                      isolation: "isolate",
                      zIndex: isActive ? 10 : 1,
                      transformOrigin: "center center",
                      width: `${cardWidth || 360}px`,
                      maxWidth: "100%",
                      flexShrink: 0,
                      boxSizing: "border-box",
                      backgroundColor: "#f2efe8",
                      border: isActive
                        ? "2px solid #b46a55"
                        : "2px solid transparent",
                      borderRadius: "18px",
                      padding: "clamp(18px, 2.5vw, 28px)",
                      display: "flex",
                      flexDirection: "column",
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive
                        ? "scale(1.02)"
                        : "scale(0.8)",
                      transition:
                        "opacity 350ms ease, transform 350ms ease, border-color 350ms ease, box-shadow 350ms ease",
                      boxShadow: isActive
                        ? "0 18px 40px rgba(180, 106, 85, 0.25)"
                        : "none",
                    }}
                  >
                    {/* Cursor-following terracotta glow */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        pointerEvents: "none",
                        zIndex: 0,
                        opacity: glow ? 1 : 0,
                        transition: "opacity 250ms ease",
                        background: glow
                          ? `radial-gradient(
                              220px circle at ${glow.x}px ${glow.y}px,
                              rgba(180, 106, 85, 0.25) 0%,
                              rgba(180, 106, 85, 0.12) 35%,
                              rgba(180, 106, 85, 0.04) 58%,
                              transparent 75%
                            )`
                          : "transparent",
                      }}
                    />

                    <h3
                      style={{
                        position: "relative",
                        zIndex: 1,
                        color: "#0b1320",
                        fontSize: "clamp(17px, 1.8vw, 21px)",
                        lineHeight: 1.45,
                        fontWeight: 700,
                        margin: "0 0 16px",
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      style={{
                        position: "relative",
                        zIndex: 1,
                        color: "#1f2a44",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        margin: "0 0 20px",
                      }}
                    >
                      {project.description}
                    </p>

                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginBottom: "24px",
                      }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "#c7b8a6",
                            color: "#0b1320",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            fontSize: "11px",
                            lineHeight: 1.3,
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "auto",
                      }}
                    >
                      {index === 0 && (
                        <button
                          type="button"
                          onClick={() => onViewHostProject(index)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            backgroundColor: "#b46a55",
                            color: "#f2efe8",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          View Details
                          <ExternalLink size={15} />
                        </button>
                      )}

                      {index === 1 && (
                        <button
                          type="button"
                          onClick={() => onViewWindowsProject(index)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            backgroundColor: "#b46a55",
                            color: "#f2efe8",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          View Details
                          <ExternalLink size={15} />
                        </button>
                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            border: "1px solid #1f2a44",
                            borderRadius: "8px",
                            padding: "9px 12px",
                            color: "#1f2a44",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          <Github size={15} />
                          GitHub
                        </a>
                      )}

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            borderRadius: "8px",
                            padding: "10px 13px",
                            backgroundColor: "#1f2a44",
                            color: "#f2efe8",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Live Demo
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={nextProject}
            aria-label="Next project"
            style={{
              position: "absolute",
              right: viewportWidth < 640 ? "-8px" : "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#b46a55",
              color: "#0b1320",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            <ChevronRight size={23} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <span
            style={{
              color: "#c7b8a6",
              fontSize: "13px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {activeIndex + 1} / {total}
          </span>

          <div style={{ display: "flex", gap: "6px" }}>
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show project ${index + 1}`}
                style={{
                  width: index === activeIndex ? "22px" : "7px",
                  height: "7px",
                  borderRadius: "999px",
                  padding: 0,
                  border: "none",
                  backgroundColor:
                    index === activeIndex ? "#b46a55" : "#c7b8a6",
                  cursor: "pointer",
                  transition: "width 200ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
