
import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
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
      "Four failed login attempts were detected within an 11-second window (15:45:04 to 15:45:15). This rapid succession can be consistent with password guessing and warrants investigation alongside source and account details.",
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
      "829 successful logon events were recorded. Logon Type 5 generally represents a service logon initiated by a Windows service.",
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
      "Zero events were detected in the reviewed data. No new user-account creation was observed during the analysis period.",
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
      "No events were detected in the reviewed data for a member being added to a security-enabled local group. Administrator group membership showed no recorded change in this sample.",
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
      "48 process-creation events were detected. One sample shows lsass.exe started by wininit.exe under the SYSTEM account.",
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

export default function WindowsEventLogProject() {
  const [current, setCurrent] = useState(0);
  const slide = screenshots[current];

  const prev = () => {
    setCurrent((value) =>
      value === 0 ? screenshots.length - 1 : value - 1
    );
  };

  const next = () => {
    setCurrent((value) =>
      value === screenshots.length - 1 ? 0 : value + 1
    );
  };

  return (
    <main className="min-h-screen bg-[#0b1320] px-4 py-12 text-[#f2efe8] sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 border-b border-[#b46a55]/25 pb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b46a55]/30 bg-[#1f2a44] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c7b8a6]">
            <span className="h-2 w-2 rounded-full bg-[#b46a55]" />
            SOC Lab Project · TLP: WHITE
          </div>

          <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-[#f2efe8] sm:text-4xl lg:text-5xl">
            Windows Security Event Log Analysis & Threat Detection
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-8 text-[#c7b8a6] sm:text-lg">
            Conducted manual security analysis of Windows Security Event Logs
            on a personal lab machine. Investigated{" "}
            <span className="font-semibold text-[#b46a55]">
              881 security events
            </span>{" "}
            across five Event IDs to identify suspicious login attempts and
            system activity.
          </p>
        </header>

        <section
          aria-label="Project statistics"
          className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#b46a55]/20 bg-[#1f2a44] p-5 text-center shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <Icon className={`mx-auto mb-3 h-5 w-5 ${color}`} />
              <div className={`mb-2 text-3xl font-black ${color}`}>
                {value}
              </div>
              <p className="text-xs leading-5 text-[#c7b8a6] sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-14">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#f2efe8] sm:text-2xl">
            <span className="inline-block h-7 w-1 rounded-full bg-[#b46a55]" />
            Event ID Evidence
          </h2>

          <div className="overflow-hidden rounded-2xl border border-[#b46a55]/25 bg-[#1f2a44] shadow-xl">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#0b1320]">
              <img
                key={current}
                src={slide.img}
                alt={slide.label}
                loading="lazy"
                className="h-full w-full object-contain"
              />

              <button
                type="button"
                onClick={prev}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c7b8a6]/30 bg-[#0b1320]/90 text-[#f2efe8] transition-colors hover:border-[#b46a55] hover:bg-[#1f2a44]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c7b8a6]/30 bg-[#0b1320]/90 text-[#f2efe8] transition-colors hover:border-[#b46a55] hover:bg-[#1f2a44]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-base font-bold leading-7 text-[#f2efe8] sm:text-lg">
                  {slide.label}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${slide.badgeColor}`}
                >
                  {slide.badge}
                </span>

                <span className={`text-xs font-semibold ${slide.severityColor}`}>
                  SEVERITY: {slide.severity}
                </span>
              </div>

              <p className="text-sm leading-7 text-[#c7b8a6]">
                {slide.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-[#c7b8a6]/70">
                  Evidence {current + 1} of {screenshots.length}
                </p>

                <div className="flex gap-2">
                  {screenshots.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`View ${item.label}`}
                      aria-current={current === index ? "true" : undefined}
                      className={`h-2.5 rounded-full transition-all ${
                        current === index
                          ? "w-7 bg-[#b46a55]"
                          : "w-2.5 bg-[#c7b8a6]/40 hover:bg-[#c7b8a6]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 rounded-2xl border border-[#b46a55]/20 bg-[#1f2a44] p-6 shadow-lg sm:p-7">
          <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-[#f2efe8]">
            <Terminal className="h-5 w-5 text-[#b46a55]" />
            Tools Used
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#b46a55]" />
                <span className="text-sm text-[#c7b8a6]">{tool}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 text-center">
          <a
            href="https://drive.google.com/file/d/1-uO-Uc4pGDrjpx_uc3o4LnJs7EBKU2E4/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#b46a55] bg-[#b46a55] px-6 py-3 text-sm font-semibold text-[#0b1320] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c7b8a6] hover:bg-[#c7b8a6]"
          >
            <FileText className="h-4 w-4" />
            View Full Report (PDF)
          </a>
        </section>

        <footer className="border-t border-[#b46a55]/20 pt-6 text-center text-xs text-[#c7b8a6]/70">
          Prepared by{" "}
          <span className="font-semibold text-[#b46a55]">Lokesh Babu</span>
          {" · "}Personal Cybersecurity Lab · TLP: WHITE
        </footer>
      </div>
    </main>
  );
}
