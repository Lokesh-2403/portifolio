import { useEffect, useRef } from "react";

const milestones = [
  {
    side: "L",
    phase: "Phase 01",
    title: "Networking & IT Fundamentals",
    desc: "Where it all started. OSI model, TCP/IP stack, subnetting, DNS, DHCP — understanding how data moves across every network.",
    tags: ["OSI Model", "TCP/IP", "Subnetting", "DNS", "DHCP"],
    status: "Completed",
    type: "done",
    stopHere: false,
  },
  {
    side: "R",
    phase: "Phase 02",
    title: "Linux & Kali Linux",
    desc: "Switched to Linux full time. Terminal, bash scripting, file permissions, processes. Kali Linux became the main environment for security work.",
    tags: ["Linux CLI", "Bash", "Kali Linux", "Permissions"],
    status: "Completed",
    type: "done",
    stopHere: false,
  },
  {
    side: "L",
    phase: "Phase 03",
    title: "Network Reconnaissance & Enumeration",
    desc: "Nmap to discover live hosts, scan ports, enumerate services and fingerprint operating systems inside controlled lab environments.",
    tags: ["Nmap", "TCP SYN Scan", "Service Enum", "OS Detection"],
    status: "Completed",
    type: "done",
    stopHere: false,
  },
  {
    side: "R",
    phase: "Phase 04 — Now",
    title: "Security Fundamentals & Attack Types",
    desc: "How attacks actually work — malware, phishing, MITM, DDoS, SQL injection. Thinking like an attacker to build a defender's mindset.",
    tags: ["Malware", "MITM", "Phishing", "DDoS", "Injection"],
    status: "In Progress",
    type: "ongoing",
    stopHere: true,  // line stops at midpoint between this and next
  },
  {
    side: "L",
    phase: "Phase 05 — Goal",
    title: "SOC Analyst — Tier 1",
    desc: "The destination. Live alert monitoring, threat triage, SIEM tools, and incident response — operating at the frontline of cyber defense.",
    tags: ["SIEM", "Splunk", "Incident Response", "Threat Hunting"],
    status: "Target",
    type: "future",
    stopHere: false,
  },
];

export default function Journey() {
  const lineRef  = useRef<HTMLDivElement>(null);
  const fillRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentPct = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const stopIndex = milestones.findIndex((m) => m.stopHere);

    // Compute the max fill percentage: midpoint between stopIndex node and next node
    function getMaxPct(): number {
      const line = lineRef.current;
      if (!line) return 1;
      const lr = line.getBoundingClientRect();

      const stopEl   = itemRefs.current[stopIndex];
      const nextEl   = itemRefs.current[stopIndex + 1];
      const stopNode = stopEl?.querySelector<HTMLDivElement>(".jrn-node");
      const nextNode = nextEl?.querySelector<HTMLDivElement>(".jrn-node");

      if (!stopNode || !nextNode) return 1;

      const stopCenter = stopNode.getBoundingClientRect().top + stopNode.getBoundingClientRect().height / 2;
      const nextCenter = nextNode.getBoundingClientRect().top + nextNode.getBoundingClientRect().height / 2;
      const midpoint   = (stopCenter + nextCenter) / 2;

      return Math.max(0, Math.min(1, (midpoint - lr.top) / lr.height));
    }

    // Target percentage based on scroll position
    function getTargetPct(): number {
      const line = lineRef.current;
      if (!line) return 0;
      const lr      = line.getBoundingClientRect();
      const trigger = window.innerHeight * 0.36;
      const raw     = (trigger - lr.top) / lr.height;
      const maxPct  = getMaxPct();
      return Math.max(0, Math.min(raw, maxPct));
    }

    function updateItems(pct: number) {
      const line = lineRef.current;
      if (!line) return;
      const lr      = line.getBoundingClientRect();
      const trigger = window.innerHeight * 0.36;

      itemRefs.current.forEach((m, idx) => {
        if (!m) return;
        const node = m.querySelector<HTMLDivElement>(".jrn-node");
        if (!node) return;
        const ny = node.getBoundingClientRect().top + 5;

        if (ny < window.innerHeight * 0.88) m.classList.add("jrn-visible");

        if (ny < trigger + 6 && idx <= stopIndex) {
          m.classList.add("jrn-lit");
        } else {
          m.classList.remove("jrn-lit");
        }
      });
    }

    // Smooth lerp loop — runs every frame
    function loop() {
      const target = getTargetPct();
      // Lerp factor: 0.12 = smooth, increase for faster response
      currentPct.current += (target - currentPct.current) * 0.12;

      const pct = currentPct.current;

      if (fillRef.current) fillRef.current.style.height = `${pct * 100}%`;
      if (dotRef.current)  dotRef.current.style.top     = `${pct * 100}%`;

      updateItems(pct);
      rafId.current = requestAnimationFrame(loop);
    }

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .jrn-section {
          position: relative;
          padding: 110px 0 160px;
          background-color: #000000 !important;
          overflow: hidden;
        }
        .jrn-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(0,229,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        @keyframes jrn-ripple {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes jrn-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }

        .jrn-milestone { opacity: 0; }

        .jrn-milestone.slide-L .jrn-content-L {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .jrn-milestone.slide-R .jrn-content-R {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .jrn-milestone.jrn-visible { opacity: 1; }
        .jrn-milestone.jrn-visible.slide-L .jrn-content-L {
          opacity: 1; transform: translateX(0);
        }
        .jrn-milestone.jrn-visible.slide-R .jrn-content-R {
          opacity: 1; transform: translateX(0);
        }

        .jrn-milestone:nth-child(1) .jrn-content-L,
        .jrn-milestone:nth-child(1) .jrn-content-R { transition-delay: 0.05s; }
        .jrn-milestone:nth-child(2) .jrn-content-L,
        .jrn-milestone:nth-child(2) .jrn-content-R { transition-delay: 0.08s; }
        .jrn-milestone:nth-child(3) .jrn-content-L,
        .jrn-milestone:nth-child(3) .jrn-content-R { transition-delay: 0.08s; }
        .jrn-milestone:nth-child(4) .jrn-content-L,
        .jrn-milestone:nth-child(4) .jrn-content-R { transition-delay: 0.08s; }
        .jrn-milestone:nth-child(5) .jrn-content-L,
        .jrn-milestone:nth-child(5) .jrn-content-R { transition-delay: 0.08s; }

        .jrn-node { transition: background 0.4s, box-shadow 0.4s, border-color 0.4s; }
        .jrn-milestone.jrn-lit .jrn-node {
          background: #00e5ff !important;
          border-color: #00e5ff !important;
          box-shadow: 0 0 10px #00e5ff, 0 0 22px rgba(0,229,255,0.45);
        }

        .jrn-phase { transition: opacity 0.4s; }
        .jrn-milestone.jrn-lit .jrn-phase { opacity: 0.9 !important; }

        .jrn-title { transition: text-shadow 0.4s; }
        .jrn-milestone.jrn-lit .jrn-title { text-shadow: 0 0 20px rgba(0,229,255,0.3); }

        .jrn-desc { transition: color 0.4s; }
        .jrn-milestone.jrn-lit .jrn-desc { color: #7aafc0 !important; }

        .jrn-tag { transition: opacity 0.4s; }
        .jrn-milestone.jrn-lit .jrn-tag { opacity: 0.85 !important; }

        .jrn-milestone.jrn-lit.done .jrn-status    { color: #00ff99 !important; }
        .jrn-milestone.jrn-lit.done .jrn-sdot       { background: #00ff99 !important; box-shadow: 0 0 7px #00ff99; }

        .jrn-milestone.jrn-lit.ongoing .jrn-status  { color: #00e5ff !important; }
        .jrn-milestone.jrn-lit.ongoing .jrn-sdot    {
          background: #00e5ff !important;
          box-shadow: 0 0 7px #00e5ff;
          animation: jrn-blink 1.4s ease-in-out infinite;
        }

        .jrn-milestone.future .jrn-title  { color: #2a3a5a !important; }
        .jrn-milestone.future .jrn-desc   { color: #1e2a45 !important; }
        .jrn-milestone.future .jrn-phase  { opacity: 0.15 !important; }
        .jrn-milestone.future .jrn-tag    { opacity: 0.12 !important; }
        .jrn-milestone.future .jrn-status { color: #1e2a45 !important; }
        .jrn-milestone.future .jrn-sdot   { background: #1e2a45 !important; }
        .jrn-milestone.future .jrn-node   { background: #1e2a45 !important; border-color: #1e2a45 !important; }

        .jrn-dot-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(0,229,255,0.5);
          animation: jrn-ripple 2s ease-out infinite;
        }

        @media (max-width: 580px) {
          .jrn-grid { grid-template-columns: 1fr !important; padding-left: 30px; }
          .jrn-content-L,
          .jrn-content-R {
            grid-column: 1 !important;
            text-align: left !important;
            padding-left: 18px !important;
            padding-right: 0 !important;
            transform: translateX(-40px) !important;
          }
          .jrn-milestone.jrn-visible .jrn-content-L,
          .jrn-milestone.jrn-visible .jrn-content-R { transform: translateX(0) !important; }
          .jrn-empty { display: none !important; }
          .jrn-tags-L, .jrn-tags-R { justify-content: flex-start !important; }
          .jrn-line-wrap { left: 0 !important; transform: none !important; }
        }
      `}</style>

      <section className="jrn-section">

        <div style={{ textAlign: "center", marginBottom: "100px", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}>
            My{" "}
            <span style={{ color: "#00e5ff", textShadow: "0 0 40px rgba(0,229,255,0.5)" }}>
              Journey
            </span>
          </h2>
          <p style={{
            marginTop: "14px",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "15px",
            color: "#8ab0cc",
            fontWeight: 400,
          }}>
            From networking basics to the SOC frontline
          </p>
        </div>

        <div style={{ position: "relative", maxWidth: "860px", margin: "0 auto", padding: "0 20px", zIndex: 1 }}>

          <div
            className="jrn-line-wrap"
            ref={lineRef}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 0, bottom: 0,
              width: "1.5px",
              background: "rgba(0,229,255,0.15)",
            }}
          >
            <div ref={fillRef} style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "0%",
              background: "linear-gradient(to bottom, #00e5ff, rgba(0,229,255,0.3))",
              boxShadow: "0 0 10px #00e5ff, 0 0 28px rgba(0,229,255,0.4)",
              borderRadius: "2px",
              willChange: "height",
            }} />

            <div ref={dotRef} style={{
              position: "absolute",
              left: "50%", top: "0%",
              transform: "translate(-50%, -50%)",
              width: "18px", height: "18px",
              borderRadius: "50%",
              background: "#00e5ff",
              boxShadow: "0 0 0 5px rgba(0,229,255,0.18), 0 0 0 10px rgba(0,229,255,0.08), 0 0 18px #00e5ff, 0 0 40px rgba(0,229,255,0.45)",
              zIndex: 20,
              willChange: "top",
            }}>
              <div className="jrn-dot-ring" />
            </div>
          </div>

          {milestones.map((m, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`jrn-milestone jrn-grid ${m.type} ${m.side === "L" ? "slide-L" : "slide-R"}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                marginBottom: "90px",
                position: "relative",
              }}
            >
              <div className="jrn-node" style={{
                position: "absolute",
                left: "50%", top: "8px",
                transform: "translateX(-50%)",
                width: "9px", height: "9px",
                borderRadius: "50%",
                background: "#3a5080",
                border: "1.5px solid #3a5080",
                zIndex: 10,
              }} />

              {m.side === "L" ? (
                <>
                  <div className="jrn-content-L" style={{ gridColumn: 1, textAlign: "right", paddingRight: "52px" }}>
                    <ContentBlock m={m} align="right" />
                  </div>
                  <div className="jrn-empty" style={{ gridColumn: 2 }} />
                </>
              ) : (
                <>
                  <div className="jrn-empty" style={{ gridColumn: 1 }} />
                  <div className="jrn-content-R" style={{ gridColumn: 2, textAlign: "left", paddingLeft: "52px" }}>
                    <ContentBlock m={m} align="left" />
                  </div>
                </>
              )}
            </div>
          ))}

          <div style={{
            textAlign: "center", marginTop: "20px",
            fontFamily: "'Inter', monospace",
            fontSize: "11px", letterSpacing: "3px",
            color: "#00e5ff", opacity: 0.25,
            textTransform: "uppercase",
          }}>
            the mission continues
          </div>
        </div>
      </section>
    </>
  );
}

function ContentBlock({ m, align }: { m: (typeof milestones)[0]; align: "left" | "right" }) {
  return (
    <>
      <p className="jrn-phase" style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "9px", letterSpacing: "3.5px",
        textTransform: "uppercase",
        color: "#00e5ff", opacity: 0.4,
        marginBottom: "10px",
      }}>{m.phase}</p>

      <h3 className="jrn-title" style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "1.15rem", fontWeight: 700,
        color: "#ffffff", lineHeight: 1.3,
        marginBottom: "10px",
      }}>{m.title}</h3>

      <p className="jrn-desc" style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "13px", lineHeight: 1.85,
        color: "#4a6a8a", marginBottom: "14px",
      }}>{m.desc}</p>

      <div
        className={align === "right" ? "jrn-tags-L" : "jrn-tags-R"}
        style={{
          display: "flex", flexWrap: "wrap", gap: "8px",
          marginBottom: "12px",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        {m.tags.map((t, ti) => (
          <span key={ti} className="jrn-tag" style={{
            fontFamily: "'Inter', monospace",
            fontSize: "10px", color: "#00e5ff",
            opacity: 0.35, letterSpacing: "0.5px",
          }}>#{t}</span>
        ))}
      </div>

      <div className="jrn-status" style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "10px", letterSpacing: "2px",
        textTransform: "uppercase", color: "#3a5080",
      }}>
        <span className="jrn-sdot" style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#3a5080", display: "inline-block",
        }} />
        {m.status}
      </div>
    </>
  );
}