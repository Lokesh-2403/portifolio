import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, ChevronLeft, ChevronRight, Terminal, Eye } from "lucide-react";

const screenshots = [
  {
    id: "4625",
    label: "Event ID 4625 — Failed Login Attempts",
    badge: "AUDIT FAILURE",
    badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
    severity: "MEDIUM",
    severityColor: "text-orange-400",
    description:
      "4 failed login attempts detected within an 11-second window (15:45:04 to 15:45:15). This rapid succession pattern is consistent with a brute-force attack where an attacker cycles through passwords to gain unauthorized system access. Each failed attempt was logged by Microsoft Windows Security Auditing under the Logon task category.",
    // placeholder — user will replace with actual image path
    img: "/screenshots/02-failed-login-4625.png",
  },
  {
    id: "4624",
    label: "Event ID 4624 — Successful Login Activity",
    badge: "AUDIT SUCCESS",
    badgeColor: "text-green-400 bg-green-500/10 border-green-500/30",
    severity: "LOW",
    severityColor: "text-green-400",
    description:
      "829 successful logon events recorded. The sampled event shows a Logon Type 5 — a Service Logon triggered by Windows Service Control Manager via services.exe. All successful logins were cross-referenced against known system accounts. No unauthorized interactive or remote logins were identified during the analysis period of 23–25 February 2026.",
    img: "/screenshots/03-successful-login-4624.png",
  },
  {
    id: "4720",
    label: "Event ID 4720 — New User Account Created",
    badge: "NOT DETECTED",
    badgeColor: "text-gray-400 bg-gray-500/10 border-gray-500/30",
    severity: "NONE",
    severityColor: "text-gray-400",
    description:
      "Zero events detected for this Event ID during the analysis period. No new user accounts were created on the system, confirming no unauthorized account creation activity occurred. In a real SOC environment, this Event ID is monitored continuously as attackers often create hidden accounts as a persistence mechanism after gaining initial access.",
    img: "/screenshots/04-new-user-created-4720.png",
  },
  {
    id: "4732",
    label: "Event ID 4732 — User Added to Admin Group",
    badge: "NOT DETECTED",
    badgeColor: "text-gray-400 bg-gray-500/10 border-gray-500/30",
    severity: "NONE",
    severityColor: "text-gray-400",
    description:
      "Zero privilege escalation events detected during the analysis period. Administrator group membership remained unchanged, confirming no unauthorized privilege changes occurred. This Event ID is critical in SOC monitoring as privilege escalation is a key technique used by attackers after achieving initial access — enabling lateral movement and deeper system compromise.",
    img: "/screenshots/05-admin-group-4732.png",
  },
  {
    id: "4688",
    label: "Event ID 4688 — New Process Created",
    badge: "AUDIT SUCCESS",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    severity: "LOW",
    severityColor: "text-green-400",
    description:
      "48 process creation events recorded across 23–25 February 2026. The sampled event shows lsass.exe (Local Security Authority Subsystem Service) spawned legitimately by wininit.exe under the SYSTEM account — verified as normal Windows initialization behavior. In a real environment, lsass.exe is a high-value attack target for credential dumping tools like Mimikatz; any unexpected parent process would trigger immediate investigation.",
    img: "/screenshots/06-process-created-4688.png",
  },
];

const stats = [
  { label: "Total Events Analyzed", value: "881", icon: Terminal, color: "text-cyan-400" },
  { label: "Suspicious Events", value: "04", icon: AlertTriangle, color: "text-orange-400" },
  { label: "Critical Findings", value: "01", icon: Shield, color: "text-red-400" },
  { label: "Event IDs Covered", value: "05", icon: Eye, color: "text-purple-400" },
];

const tools = [
  "Windows Event Viewer",
  "Microsoft Excel",
  "Group Policy Editor",
  "Snipping Tool",
];

const eventSummary = [
  { id: "4625", desc: "Failed Login Attempt", count: "4", severity: "MEDIUM", color: "text-orange-400", dot: "bg-orange-400" },
  { id: "4624", desc: "Successful Login", count: "829", severity: "LOW", color: "text-green-400", dot: "bg-green-400" },
  { id: "4720", desc: "New User Created", count: "0", severity: "NONE", color: "text-gray-400", dot: "bg-gray-500" },
  { id: "4732", desc: "Admin Group Modified", count: "0", severity: "NONE", color: "text-gray-400", dot: "bg-gray-500" },
  { id: "4688", desc: "Process Created", count: "48", severity: "LOW", color: "text-green-400", dot: "bg-green-400" },
];

export default function WindowsEventLogProject() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));

  const slide = screenshots[current];

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #020812 0%, #040f1a 40%, #020c14 70%, #010810 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,100,255,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* ── HERO HEADING ── */}
        <div className="text-center mb-16">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SOC Lab Project · TLP: WHITE
          </div>

          <h1
            className="font-black tracking-tight leading-none mb-4"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              background: "linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Windows Security Event Log
            <br />
            Analysis & Threat Detection
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed mt-4">
            Conducted a manual security analysis of Windows Security Event Logs on a personal lab machine.
            Investigated <span className="text-cyan-400 font-semibold">881 security events</span> across 5 critical Event IDs — identifying failed login attempts, service logon activity, and process creation events. Documented findings in a professional SOC-style incident report with threat assessment and remediation recommendations.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Windows Event Viewer", "Log Analysis", "Threat Detection", "SOC Operations", "Incident Reporting", "SIEM Fundamentals"].map((t) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-300">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl p-5 border border-white/8 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
              <div className="text-gray-500 text-xs leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* ── SCREENSHOT CAROUSEL ── */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-cyan-400 inline-block" />
            Event ID Evidence
          </h2>

          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Screenshot display */}
            <div className="relative bg-black/40 aspect-video flex items-center justify-center overflow-hidden">
              <img
                key={current}
                src={slide.img}
                alt={slide.label}
                className="w-full h-full object-contain"
                style={{ animation: "fadeIn 0.35s ease" }}
                onError={(e) => {
                  // fallback placeholder if image not found
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-placeholder")) {
                    const el = document.createElement("div");
                    el.className = "fallback-placeholder flex flex-col items-center justify-center w-full h-full text-gray-600";
                    el.innerHTML = `<svg class='w-16 h-16 mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18M9 21V9'/></svg><span class='text-sm opacity-50'>Event ID ${slide.id} Screenshot</span>`;
                    parent.appendChild(el);
                  }
                }}
              />

              {/* Nav arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-gray-400">
                {current + 1} / {screenshots.length}
              </div>
            </div>

            {/* Info panel */}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-white font-bold text-lg">{slide.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${slide.badgeColor}`}>
                  {slide.badge}
                </span>
                <span className={`text-xs font-semibold ${slide.severityColor}`}>
                  SEVERITY: {slide.severity}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{slide.description}</p>
            </div>

            {/* Dot nav */}
            <div className="flex justify-center gap-2 pb-5">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-cyan-400" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── EVENT SUMMARY TABLE ── */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-cyan-400 inline-block" />
            Event Summary
          </h2>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Event ID</th>
                  <th className="text-left px-6 py-4">Description</th>
                  <th className="text-center px-6 py-4">Count</th>
                  <th className="text-center px-6 py-4">Severity</th>
                </tr>
              </thead>
              <tbody>
                {eventSummary.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-white/5 hover:bg-cyan-500/5 transition-colors ${i === eventSummary.length - 1 ? "border-none" : ""}`}
                  >
                    <td className="px-6 py-4 font-mono text-cyan-400 font-bold">{row.id}</td>
                    <td className="px-6 py-4 text-gray-300">{row.desc}</td>
                    <td className="px-6 py-4 text-center text-white font-semibold">{row.count}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${row.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.dot}`} />
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── TOOLS + REPORT ROW ── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-14">

          {/* Tools */}
          <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Tools Used
            </h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <div key={tool} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report */}
          <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Incident Report
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Full SOC-style incident report documenting all 5 Event ID findings, raw event properties, threat assessments, and remediation recommendations.
            </p>
            <a
              href="YOUR_GOOGLE_DRIVE_PDF_LINK_HERE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
            >
              <FileText className="w-4 h-4" />
              View Full Report (PDF)
            </a>
          </div>
        </div>

        {/* ── CONCLUSION ── */}
        <div
          className="rounded-2xl border p-6 mb-10"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,255,0.04), rgba(0,100,255,0.04))",
            borderColor: "rgba(0,255,255,0.15)",
          }}
        >
          <div className="flex flex-wrap gap-6 text-center justify-around">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Overall Risk</div>
              <div className="text-green-400 font-black text-xl">LOW</div>
            </div>
            <div className="w-px bg-white/10 hidden lg:block" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Breach Confirmed</div>
              <div className="text-green-400 font-black text-xl flex items-center gap-1 justify-center">
                <XCircle className="w-5 h-5" /> NO
              </div>
            </div>
            <div className="w-px bg-white/10 hidden lg:block" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Analysis Period</div>
              <div className="text-white font-bold text-sm">23 – 25 Feb 2026</div>
            </div>
            <div className="w-px bg-white/10 hidden lg:block" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Further Action</div>
              <div className="text-orange-400 font-bold text-sm">Monitoring Recommended</div>
            </div>
          </div>
        </div>

        {/* ── ANALYST ── */}
        <div className="text-center text-gray-600 text-xs">
          Prepared by <span className="text-cyan-400 font-semibold">Lokesh Babu</span> · Personal Cybersecurity Lab · TLP: WHITE
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}