
import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Eye,
} from "lucide-react";

const screenshots = [
  {
    id: "4625",
    label: "Event ID 4625 — Failed Login Attempts",
    badge: "AUDIT FAILURE",
    badgeColor: "text-[#b46a55] bg-[#b46a55]/10 border-[#b46a55]/30",
    severity: "MEDIUM",
    severityColor: "text-[#b46a55]",
    description:
      "4 failed login attempts detected within an 11-second window (15:45:04 to 15:45:15). This rapid succession pattern is consistent with a brute-force attack where an attacker cycles through passwords to gain unauthorized system access.",
    img: "/screenshots/02-failed-login-4625.png",
  },
  {
    id: "4624",
    label: "Event ID 4624 — Successful Login Activity",
    badge: "AUDIT SUCCESS",
    badgeColor: "text-[#c7b8a6] bg-[#c7b8a6]/10 border-[#c7b8a6]/30",
    severity: "LOW",
    severityColor: "text-[#c7b8a6]",
    description:
      "829 successful logon events recorded. Logon Type 5 indicates service logons triggered by Windows Service Control Manager.",
    img: "/screenshots/03-successful-login-4624.png",
  },
  {
    id: "4720",
    label: "Event ID 4720 — New User Account Created",
    badge: "NOT DETECTED",
    badgeColor: "text-[#c7b8a6] bg-[#c7b8a6]/10 border-[#c7b8a6]/30",
    severity: "NONE",
    severityColor: "text-[#c7b8a6]",
    description:
      "Zero events detected. No unauthorized user accounts were created during the analysis period.",
    img: "/screenshots/04-new-user-created-4720.png",
  },
  {
    id: "4732",
    label: "Event ID 4732 — User Added to Admin Group",
    badge: "NOT DETECTED",
    badgeColor: "text-[#c7b8a6] bg-[#c7b8a6]/10 border-[#c7b8a6]/30",
    severity: "NONE",
    severityColor: "text-[#c7b8a6]",
    description:
      "No privilege escalation events detected. Administrator group membership remained unchanged.",
    img: "/screenshots/05-admin-group-4732.png",
  },
  {
    id: "4688",
    label: "Event ID 4688 — New Process Created",
    badge: "AUDIT SUCCESS",
    badgeColor: "text-[#c7b8a6] bg-[#c7b8a6]/10 border-[#c7b8a6]/30",
    severity: "LOW",
    severityColor: "text-[#c7b8a6]",
    description:
      "48 process creation events detected. Sample shows lsass.exe started by wininit.exe under SYSTEM account.",
    img: "/screenshots/06-process-created-4688.png",
  },
];

const stats = [
  {
    label: "Total Events Analyzed",
    value: "881",
    icon: Terminal,
    color: "text-[#b46a55]",
  },
  {
    label: "Suspicious Events",
    value: "04",
    icon: AlertTriangle,
    color: "text-[#c7b8a6]",
  },
  {
    label: "Critical Findings",
    value: "01",
    icon: Shield,
    color: "text-[#b46a55]",
  },
  {
    label: "Event IDs Covered",
    value: "05",
    icon: Eye,
    color: "text-[#c7b8a6]",
  },
];

const tools = [
  "Windows Event Viewer",
  "Microsoft Excel",
  "Group Policy Editor",
  "Snipping Tool",
];

const eventSummary = [
  {
    id: "4625",
    desc: "Failed Login Attempt",
    count: "4",
    severity: "MEDIUM",
    color: "text-[#b46a55]",
    dot: "bg-[#b46a55]",
  },
  {
    id: "4624",
    desc: "Successful Login",
    count: "829",
    severity: "LOW",
    color: "text-[#c7b8a6]",
    dot: "bg-[#c7b8a6]",
  },
  {
    id: "4720",
    desc: "New User Created",
    count: "0",
    severity: "NONE",
    color: "text-[#c7b8a6]",
    dot: "bg-[#c7b8a6]",
  },
  {
    id: "4732",
    desc: "Admin Group Modified",
    count: "0",
    severity: "NONE",
    color: "text-[#c7b8a6]",
    dot: "bg-[#c7b8a6]",
  },
  {
    id: "4688",
    desc: "Process Created",
    count: "48",
    severity: "LOW",
    color: "text-[#c7b8a6]",
    dot: "bg-[#c7b8a6]",
  },
];

export default function WindowsEventLogProject() {
  const [current, setCurrent] = useState(0);

  /* Always open page from top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const prev = () =>
    setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));

  const slide = screenshots[current];

  return (
    <div
      className="min-h-screen text-[#f2efe8]"
      style={{
        background:
          "linear-gradient(180deg, #0b1320 0%, #1f2a44 50%, #0b1320 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* HERO */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b46a55]/30 bg-[#b46a55]/5 text-[#b46a55] text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b46a55] animate-pulse" />
            SOC Lab Project · TLP: WHITE
          </div>

          <h1
            className="font-black tracking-tight leading-none mb-4"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              background:
                "linear-gradient(135deg, #f2efe8 0%, #c7b8a6 50%, #b46a55 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Windows Security Event Log
            <br />
            Analysis & Threat Detection
          </h1>

          <p className="text-[#c7b8a6] max-w-2xl mx-auto text-base leading-relaxed mt-4">
            Conducted manual security analysis of Windows Security Event Logs on a personal lab machine.
            Investigated{" "}
            <span className="text-[#b46a55] font-semibold">
              881 security events
            </span>{" "}
            across 5 critical Event IDs to identify suspicious login attempts and system activity.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl p-5 border border-[#c7b8a6]/10 text-center"
              style={{ background: "rgba(242,239,232,0.03)" }}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-3xl font-black mb-1 ${color}`}>
                {value}
              </div>
              <div className="text-[#c7b8a6]/70 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* CAROUSEL */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-[#f2efe8] mb-6 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-[#b46a55] inline-block" />
            Event ID Evidence
          </h2>

          <div
            className="rounded-2xl border border-[#c7b8a6]/10 overflow-hidden"
            style={{ background: "rgba(242,239,232,0.02)" }}
          >
            <div className="relative bg-[#0b1320]/70 aspect-video flex items-center justify-center overflow-hidden">
              <img
                key={current}
                src={slide.img}
                alt={slide.label}
                className="w-full h-full object-contain"
              />

              <button
                onClick={prev}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0b1320]/80 border border-[#c7b8a6]/20 flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-[#f2efe8]" />
              </button>

              <button
                onClick={next}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0b1320]/80 border border-[#c7b8a6]/20 flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 text-[#f2efe8]" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-[#f2efe8] font-bold text-lg">
                  {slide.label}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${slide.badgeColor}`}
                >
                  {slide.badge}
                </span>

                <span className={`text-xs font-semibold ${slide.severityColor}`}>
                  SEVERITY: {slide.severity}
                </span>
              </div>

              <p className="text-[#c7b8a6] text-sm leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        </div>

        {/* TOOLS */}
        <div
          className="rounded-2xl border border-[#c7b8a6]/10 p-6 mb-14"
          style={{ background: "rgba(242,239,232,0.02)" }}
        >
          <h3 className="text-[#f2efe8] font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#b46a55]" />
            Tools Used
          </h3>

          {tools.map((tool) => (
            <div key={tool} className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-4 h-4 text-[#b46a55]" />
              <span className="text-[#c7b8a6] text-sm">{tool}</span>
            </div>
          ))}
        </div>

        {/* REPORT */}
        <div className="text-center mb-14">
          <a
            href="https://drive.google.com/file/d/1-uO-Uc4pGDrjpx_uc3o4LnJs7EBKU2E4/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-[#0b1320] hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg, #b46a55, #c7b8a6)" }}
          >
            <FileText className="w-4 h-4" />
            View Full Report (PDF)
          </a>
        </div>

        {/* ANALYST */}
        <div className="text-center text-[#c7b8a6]/60 text-xs">
          Prepared by{" "}
          <span className="text-[#b46a55] font-semibold">Lokesh Babu</span> ·
          Personal Cybersecurity Lab · TLP: WHITE
        </div>
      </div>
    </div>
  );
}
