import { useEffect, useRef, useState, useCallback } from "react";
import { ExternalLink, Github } from "lucide-react";

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

export default function Projects({ onViewHostProject, onViewWindowsProject }: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef     = useRef(0);
  const lockedRef     = useRef(false);
  const sectionRef    = useRef<HTMLDivElement>(null);
  const frozenRef     = useRef(false);
  const frozenScrollY = useRef(0);
  const lastScrollY   = useRef(0);

  const projects: Project[] = [
    {
      title: "Host-Based Network Reconnaissance & Service Enumeration",
      status: "Completed",
      description: "A practical host-based reconnaissance lab where Nmap is used to discover live hosts, identify open ports, enumerate running services, and perform OS fingerprinting.",
      tags: ["Kali Linux", "Nmap", "TCP SYN Scan", "Service Enumeration", "OS Detection"],
      githubLink: "https://github.com/Lokesh-2403/host-based-reconnaissance",
    },
    {
      title: "Windows Security Event Log Analysis & Threat Detection",
      status: "Completed",
      description: "Investigated 881 security events across 5 critical Event IDs on a Windows lab machine, identifying suspicious login patterns and potential insider threats.",
      tags: ["Windows Event Viewer", "Log Analysis", "Threat Detection", "SOC Operations"],
      githubLink: "https://github.com/Lokesh-2403/windows-login",
    },
    {
      title: "Linux SSH Brute Force Detection System",
      status: "Completed",
      description: "Detect and analyze SSH brute-force attempts on a Linux server using log parsing, pattern recognition, and automated alerting scripts.",
      tags: ["Kali Linux", "Bash", "Python", "Regex"],
      githubLink: "https://github.com/Lokesh-2403/ssh-brute-force",
    },
    {
      title: "Endpoint Security Monitoring",
      status: "Underway",
      description: "Implement endpoint monitoring and threat detection mechanisms to identify suspicious processes and privilege escalation attempts.",
      tags: ["Kali Linux", "Wazuh / OSSEC", "Auditd", "Syslog", "Process Monitoring"],
    },
    {
      title: "Web Application Penetration Testing Lab",
      status: "Planned",
      description: "Set up a vulnerable web application environment to practice common web attack techniques like SQL injection, XSS, and CSRF.",
      tags: ["Burp Suite", "OWASP ZAP", "SQLmap", "Nikto", "Metasploit Framework"],
    },
    {
      title: "SIEM Deployment & Real-Time Threat Hunting Dashboard",
      status: "Planned",
      description: "Deployed a SIEM solution and implemented a real-time threat hunting dashboard to monitor and analyze security events.",
      tags: ["Splunk / ELK Stack", "Threat Hunting", "Winlogbeat", "Filebeat"],
    },
    {
      title: "Active Directory Attack Simulation & Defensive Monitoring Lab",
      status: "Planned",
      description: "Simulated Active Directory attacks in a controlled lab environment and implemented defensive monitoring to detect suspicious activities.",
      tags: ["BloodHound", "Mimikatz", "Impacket", "Responder", "Defensive Monitoring"],
    },
    {
      title: "Cloud Infrastructure Security Assessment",
      status: "Planned",
      description: "Assessed cloud infrastructure for security misconfigurations and vulnerabilities in AWS and Azure environments.",
      tags: ["ScoutSuite", "Prowler", "AWS CLI", "AWS Free Tier"],
    },
    {
      title: "Static & Dynamic Malware Analysis Lab",
      status: "Planned",
      description: "Performed static and dynamic analysis of malware samples and reverse-engineered binaries to understand their behavior.",
      tags: ["Wireshark", "Ghidra", "Radare2", "Volatility", "VirtualBox"],
    },
  ];

  const total = projects.length;

  const freezePage = useCallback((fromBottom = false) => {
    if (frozenRef.current) return;
    frozenRef.current     = true;
    frozenScrollY.current = window.scrollY;
    if (fromBottom) {
      activeRef.current = total - 1;
      setActiveIndex(total - 1);
    } else {
      activeRef.current = 0;
      setActiveIndex(0);
    }
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top      = `-${frozenScrollY.current}px`;
    document.body.style.width    = "100%";
  }, [total]);

  const unfreezePage = useCallback((targetY: number) => {
    if (!frozenRef.current) return;
    frozenRef.current            = false;
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top      = "";
    document.body.style.width    = "";
    window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior });
  }, []);

  const navigate = useCallback((dir: 1 | -1) => {
    if (lockedRef.current) return;
    const next = activeRef.current + dir;
    if (next < 0 || next >= total) return;
    lockedRef.current = true;
    activeRef.current = next;
    setActiveIndex(next);
    setTimeout(() => { lockedRef.current = false; }, 700);
  }, [total]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const checkScroll = () => {
      const el = sectionRef.current;
      if (!el || frozenRef.current) return;

      const scrollingDown = window.scrollY > lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const rect = el.getBoundingClientRect();

      if (scrollingDown) {
        // Freeze when section top reaches near viewport top (scrolling down into section)
        if (rect.top > -10 && rect.top < 60) {
          freezePage(false);
        }
      } else {
        // Freeze when section top is still visible (coming back up into section)
        // Use rect.top < window.innerHeight means section is back on screen
        // We freeze when section top is within the viewport (section fully visible from top)
        if (rect.top >= 0 && rect.top < window.innerHeight) {
          freezePage(true);
        }
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [freezePage]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!frozenRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      if (lockedRef.current) return;

      const atFirst = activeRef.current === 0;
      const atLast  = activeRef.current === total - 1;

      if (e.deltaY > 0) {
        if (atLast) {
          unfreezePage(frozenScrollY.current + window.innerHeight);
        } else {
          navigate(1);
        }
      } else {
        if (atFirst) {
          unfreezePage(Math.max(0, frozenScrollY.current - window.innerHeight));
        } else {
          navigate(-1);
        }
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => { if (frozenRef.current) e.preventDefault(); };
    const onTouchEnd   = () => {
      if (!frozenRef.current || lockedRef.current) return;
      const diff = touchStartY - window.innerHeight / 2;
      if (Math.abs(diff) > 35) navigate(diff > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!frozenRef.current || lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        if (activeRef.current === total - 1) {
          unfreezePage(frozenScrollY.current + window.innerHeight);
          return;
        }
        navigate(1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeRef.current === 0) {
          unfreezePage(Math.max(0, frozenScrollY.current - window.innerHeight));
          return;
        }
        navigate(-1);
      }
    };

    window.addEventListener("wheel",      onWheel,      { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("touchend",   onTouchEnd);
    window.addEventListener("keydown",    onKey);

    return () => {
      window.removeEventListener("wheel",      onWheel,      { capture: true } as EventListenerOptions);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("keydown",    onKey);
      if (frozenRef.current) {
        frozenRef.current            = false;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top      = "";
        document.body.style.width    = "";
        window.scrollTo(0, frozenScrollY.current);
      }
    };
  }, [navigate, unfreezePage, total]);

  const getStatusStyle = (status: Project["status"]) => {
    if (status === "Completed") return { backgroundColor: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" };
    if (status === "Underway")  return { backgroundColor: "rgba(59,130,246,0.12)",  color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)"  };
    return                             { backgroundColor: "rgba(234,179,8,0.12)",   color: "#fde68a", border: "1px solid rgba(234,179,8,0.3)"   };
  };

  const getActiveGlow = (status: Project["status"]) => {
    if (status === "Completed") return "0 0 60px rgba(16,185,129,0.2), 0 0 120px rgba(6,182,212,0.1), 0 20px 60px rgba(0,0,0,0.6)";
    if (status === "Underway")  return "0 0 60px rgba(59,130,246,0.2), 0 0 120px rgba(6,182,212,0.1), 0 20px 60px rgba(0,0,0,0.6)";
    return                             "0 0 60px rgba(234,179,8,0.2),  0 0 120px rgba(6,182,212,0.1), 0 20px 60px rgba(0,0,0,0.6)";
  };

  const btnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "14px", color: "#9ca3af",
    background: "none", border: "none", cursor: "pointer", padding: 0,
  };

  const CARD_W = 480;
  const GAP    = 32;

  return (
    <>
      <style>{`
        .proj-track {
          display: flex;
          gap: ${GAP}px;
          will-change: transform;
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.35, 1);
        }
        .proj-card {
          transition:
            transform 0.65s cubic-bezier(0.25, 1, 0.35, 1),
            opacity   0.65s ease,
            filter    0.65s ease;
        }
        .proj-inner {
          transition:
            border-color     0.65s ease,
            background-color 0.65s ease,
            box-shadow       0.65s ease;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="projects"
        style={{ position: "relative", height: "100vh", backgroundColor: "#000000" }}
      >
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center", overflow: "hidden",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", width: "100%" }}>

            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "10px" }}>
                Portfolio
              </p>
              <h2 style={{ fontSize: "48px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Security Projects
              </h2>
              <p style={{ color: "#6b7280", fontSize: "14px", maxWidth: "480px", margin: "12px auto 0" }}>
                All projects are built in a controlled lab environment for defensive security learning.
              </p>
            </div>

            <div style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "180px", background: "linear-gradient(to right, #000 0%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "180px", background: "linear-gradient(to left, #000 0%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />

              <div
                className="proj-track"
                style={{
                  transform: `translateX(calc(50vw - ${CARD_W / 2}px - 48px - ${activeIndex * (CARD_W + GAP)}px))`,
                }}
              >
                {projects.map((project, index) => {
                  const diff      = index - activeIndex;
                  const isActive  = diff === 0;
                  const isVisible = Math.abs(diff) === 1;
                  const scale     = isActive ? 1    : isVisible ? 0.88 : 0.76;
                  const opacity   = isActive ? 1    : isVisible ? 0.38 : 0;
                  const blur      = isActive ? 0    : isVisible ? 1.5  : 0;

                  return (
                    <div
                      key={index}
                      className="proj-card"
                      style={{
                        minWidth: `${CARD_W}px`,
                        transform: `scale(${scale})`,
                        opacity,
                        filter: blur ? `blur(${blur}px)` : "none",
                        transformOrigin: "center center",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div
                        className="proj-inner"
                        style={{
                          borderRadius: "20px", padding: "32px",
                          border: `1px solid ${isActive ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.06)"}`,
                          backgroundColor: isActive ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.015)",
                          boxShadow: isActive ? getActiveGlow(project.status) : "none",
                        }}
                      >
                        <span style={{
                          display: "inline-block", fontSize: "11px", fontWeight: 600,
                          letterSpacing: "0.12em", textTransform: "uppercase",
                          padding: "4px 12px", borderRadius: "999px", marginBottom: "20px",
                          ...getStatusStyle(project.status),
                        }}>
                          {project.status}
                        </span>

                        <h3 style={{ fontSize: "19px", fontWeight: 600, color: "#ffffff", lineHeight: 1.45, margin: "0 0 14px" }}>
                          {project.title}
                        </h3>

                        <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>
                          {project.description}
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "22px" }}>
                          {project.tags.map((tag, i) => (
                            <span key={i} style={{
                              fontSize: "11px", padding: "4px 11px", borderRadius: "999px",
                              color: "#9ca3af", backgroundColor: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}>{tag}</span>
                          ))}
                        </div>

                        <div style={{
                          display: "flex", alignItems: "center", gap: "20px",
                          marginTop: "28px", paddingTop: "22px",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}>
                          {project.githubLink && (
                            <button onClick={() => window.open(project.githubLink, "_blank")} style={btnStyle}>
                              <Github size={15} /> GitHub
                            </button>
                          )}
                          {index === 0 && (
                            <button onClick={onViewHostProject} style={btnStyle}>
                              <ExternalLink size={15} /> View Details
                            </button>
                          )}
                          {index === 1 && (
                            <button onClick={onViewWindowsProject} style={btnStyle}>
                              <ExternalLink size={15} /> View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px" }}>
              {projects.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!lockedRef.current) {
                      lockedRef.current = true;
                      activeRef.current = i;
                      setActiveIndex(i);
                      setTimeout(() => { lockedRef.current = false; }, 700);
                    }
                  }}
                  style={{
                    width: i === activeIndex ? "28px" : "8px",
                    height: "8px", borderRadius: "4px",
                    backgroundColor: i === activeIndex ? "#22d3ee" : "rgba(255,255,255,0.12)",
                    transition: "width 0.35s ease, background-color 0.35s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <p style={{
              textAlign: "center", color: "#374151",
              fontSize: "11px", marginTop: "16px",
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              {activeIndex < total - 1
                ? `${activeIndex + 1} / ${total} — Scroll to explore`
                : `${total} / ${total} — Scroll down to continue`}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}