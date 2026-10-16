
import { useEffect, useRef, useState } from "react";
import {
  Lock,
  ShieldCheck,
  Terminal,
  ArrowUpRight,
  ChevronDown,
  Award,
  Sparkles,
} from "lucide-react";

const certs = [
  {
    id: "security-plus",
    title: "CompTIA Security+",
    issuer: "CompTIA",
    icon: Lock,
    category: "Cybersecurity",
    description:
      "A cybersecurity certification associated with foundational security knowledge, including threats, vulnerabilities, risk management, and security operations.",
    accent: "#b46a55",
  },
  {
    id: "sc-200",
    title: "Microsoft SC-200",
    issuer: "Microsoft",
    icon: ShieldCheck,
    category: "Security Operations",
    description:
      "A Microsoft security operations certification focused on investigating threats, responding to incidents, and using Microsoft's security solutions.",
    accent: "#b46a55",
  },
  {
    id: "btl1",
    title: "BTL1",
    issuer: "Security Blue Team",
    icon: Terminal,
    category: "Blue Team",
    description:
      "A blue-team certification focused on practical defensive security skills, including security monitoring, investigation, and incident response.",
    accent: "#b46a55",
  },
];

const colors = {
  background: "#0b1320",
  ivory: "#f2efe8",
  sand: "#c7b8a6",
  terracotta: "#b46a55",
  navy: "#1f2a44",
};

export default function Certifications() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(certs.length).fill(false)
  );

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const timer = setTimeout(() => {
              setVisibleItems((previous) => {
                const next = [...previous];
                next[i] = true;
                return next;
              });
            }, i * 120);

            timers.push(timer);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <style>{`
        .cert-section {
          isolation: isolate;
        }

        .cert-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transition:
            opacity 0.35s ease,
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease,
            border-color 0.35s ease,
            background-color 0.35s ease;
          will-change: transform, opacity;
        }

        .cert-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(
              260px circle at var(--cert-x, 50%) var(--cert-y, 50%),
              rgba(180,106,85,0.15),
              transparent 72%
            );
          transition: opacity 0.3s ease;
        }

        .cert-card:hover::before,
        .cert-card:focus-within::before {
          opacity: 1;
        }

        .cert-card.visible-card {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .cert-card.hidden-card {
          opacity: 0;
          transform: translateY(28px) scale(0.97);
        }

        .cert-card.visible-card:hover {
          transform: translateY(-5px) scale(1.035);
          z-index: 2;
        }

        .cert-card.dimmed-card {
          opacity: 0.62;
        }

        .cert-card.expanded-card {
          border-color: ${colors.terracotta} !important;
          box-shadow: 0 18px 42px rgba(180,106,85,0.15);
        }

        .cert-action {
          transition:
            background-color 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .cert-card:hover .cert-action {
          transform: translateX(2px);
        }

        .cert-icon {
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.3s ease,
            color 0.3s ease;
        }

        .cert-card:hover .cert-icon {
          transform: rotate(-4deg) scale(1.06);
        }

        .cert-detail {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition:
            grid-template-rows 0.35s ease,
            opacity 0.25s ease,
            margin-top 0.35s ease;
          margin-top: 0;
        }

        .cert-detail.open {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 20px;
        }

        .cert-detail-inner {
          min-height: 0;
          overflow: hidden;
        }

        .cert-detail-content {
          transform: translateY(-6px);
          transition: transform 0.35s ease;
        }

        .cert-detail.open .cert-detail-content {
          transform: translateY(0);
        }

        .cert-top-line {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 2px;
          opacity: 0;
          transform: scaleX(0.35);
          background: linear-gradient(
            90deg,
            transparent,
            ${colors.terracotta},
            ${colors.sand},
            transparent
          );
          transition:
            opacity 0.3s ease,
            transform 0.4s ease;
        }

        .cert-card:hover .cert-top-line,
        .cert-card.expanded-card .cert-top-line {
          opacity: 1;
          transform: scaleX(1);
        }

        @media (max-width: 640px) {
          .cert-card.visible-card:hover {
            transform: translateY(-3px) scale(1.01);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cert-card,
          .cert-icon,
          .cert-action,
          .cert-detail,
          .cert-detail-content,
          .cert-top-line {
            transition: none !important;
          }

          .cert-card.hidden-card {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <section
        id="certifications"
        className="cert-section"
        style={{
          backgroundColor: colors.background,
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "15%",
            left: "-140px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(180,106,85,0.07)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-150px",
            bottom: "5%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(199,184,166,0.045)",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Section heading */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "56px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid rgba(180,106,85,0.3)",
                background: "rgba(180,106,85,0.08)",
                color: colors.sand,
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              <Sparkles size={14} color={colors.terracotta} />
              Learning & Credentials
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                color: colors.ivory,
                letterSpacing: "-1.2px",
                lineHeight: 1.2,
                marginBottom: "18px",
              }}
            >
              Certifications
              <span style={{ color: colors.terracotta }}>.</span>
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.95rem, 2vw, 1.08rem)",
                lineHeight: 1.9,
                color: colors.sand,
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Building a strong foundation in cybersecurity through
              continuous learning, hands-on practice, and focused
              development in security operations, threat detection,
              and defense.
            </p>

            <div
              aria-hidden="true"
              style={{
                width: "76px",
                height: "2px",
                margin: "28px auto 0",
                background:
                  "linear-gradient(90deg, transparent, #b46a55, transparent)",
              }}
            />
          </div>

          {/* Certification cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 285px), 1fr))",
              alignItems: "start",
              gap: "22px",
            }}
          >
            {certs.map((cert, i) => {
              const Icon = cert.icon;
              const isHovered = hoveredIndex === i;
              const isDimmed = hoveredIndex !== null && !isHovered;
              const isVisible = visibleItems[i];
              const isExpanded = expandedId === cert.id;

              return (
                <div
                  key={cert.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={[
                    "cert-card",
                    isVisible ? "visible-card" : "hidden-card",
                    isDimmed ? "dimmed-card" : "",
                    isExpanded ? "expanded-card" : "",
                  ].join(" ")}
                  onMouseEnter={(event) => {
                    setHoveredIndex(i);

                    const rect =
                      event.currentTarget.getBoundingClientRect();

                    event.currentTarget.style.setProperty(
                      "--cert-x",
                      `${event.clientX - rect.left}px`
                    );

                    event.currentTarget.style.setProperty(
                      "--cert-y",
                      `${event.clientY - rect.top}px`
                    );
                  }}
                  onMouseMove={(event) => {
                    const rect =
                      event.currentTarget.getBoundingClientRect();

                    event.currentTarget.style.setProperty(
                      "--cert-x",
                      `${event.clientX - rect.left}px`
                    );

                    event.currentTarget.style.setProperty(
                      "--cert-y",
                      `${event.clientY - rect.top}px`
                    );
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                      )
                    ) {
                      setHoveredIndex(null);
                    }
                  }}
                  style={{
                    borderRadius: "20px",
                    padding: "25px 23px 22px",
                    border: `1px solid ${
                      isHovered || isExpanded
                        ? colors.terracotta
                        : "rgba(180,106,85,0.24)"
                    }`,
                    background: colors.ivory,
                    boxShadow:
                      isHovered || isExpanded
                        ? "0 18px 42px rgba(180,106,85,0.14)"
                        : "0 8px 28px rgba(0,0,0,0.13)",
                    minWidth: 0,
                  }}
                >
                  <div className="cert-top-line" />

                  {/* Clickable card header */}
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`cert-detail-${cert.id}`}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : cert.id)
                    }
                    className="cert-action"
                    style={{
                      width: "100%",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: colors.background,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="cert-icon"
                      style={{
                        flexShrink: 0,
                        width: "52px",
                        height: "52px",
                        borderRadius: "15px",
                        background: colors.navy,
                        color: colors.ivory,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 5px 14px rgba(31,42,68,0.14)",
                      }}
                    >
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    {/* Title and issuer */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "1.02rem",
                          fontWeight: 700,
                          color: colors.background,
                          lineHeight: 1.45,
                          marginBottom: "5px",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {cert.title}
                      </h3>

                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "13px",
                          color: colors.navy,
                          opacity: 0.78,
                          letterSpacing: "0.15px",
                        }}
                      >
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: isExpanded
                          ? "rgba(180,106,85,0.13)"
                          : "rgba(31,42,68,0.045)",
                        color: colors.terracotta,
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown
                          size={18}
                          style={{ transform: "rotate(180deg)" }}
                        />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                  </button>

                  {/* Expandable details */}
                  <div
                    id={`cert-detail-${cert.id}`}
                    className={`cert-detail ${isExpanded ? "open" : ""}`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="cert-detail-inner">
                      <div className="cert-detail-content">
                        <div
                          style={{
                            height: "1px",
                            background:
                              "linear-gradient(90deg, rgba(180,106,85,0.5), rgba(199,184,166,0.2), transparent)",
                            marginBottom: "17px",
                          }}
                        />

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            background: "rgba(180,106,85,0.10)",
                            color: colors.navy,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            marginBottom: "12px",
                          }}
                        >
                          <Award size={13} color={colors.terracotta} />
                          {cert.category}
                        </div>

                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: colors.navy,
                            fontSize: "13px",
                            lineHeight: 1.8,
                            marginBottom: "15px",
                          }}
                        >
                          {cert.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#655d55",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            lineHeight: 1.6,
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              flexShrink: 0,
                              borderRadius: "50%",
                              background: colors.terracotta,
                            }}
                          />
                          Select to collapse details
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: isExpanded ? "18px" : "20px",
                      transition: "margin-top 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        width: isExpanded ? "25px" : "16px",
                        height: "3px",
                        borderRadius: "999px",
                        background: colors.terracotta,
                        transition: "width 0.3s ease",
                      }}
                    />
                    <span
                      style={{
                        width: "5px",
                        height: "3px",
                        borderRadius: "999px",
                        background: colors.sand,
                      }}
                    />
                    <span
                      style={{
                        width: "5px",
                        height: "3px",
                        borderRadius: "999px",
                        background: colors.sand,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer caption */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "9px",
              marginTop: "35px",
              color: "rgba(199,184,166,0.72)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.25px",
              textAlign: "center",
            }}
          >
            <ShieldCheck size={15} color={colors.terracotta} />
            <span>Continuous learning. Practical security. Stronger foundations.</span>
          </div>
        </div>
      </section>
    </>
  );
}
