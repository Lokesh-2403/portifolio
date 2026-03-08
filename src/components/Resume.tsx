import { Download, FileText } from "lucide-react";

export default function Resume() {
  return (
    <section
      id="resume"
      className="relative py-24"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block p-4 bg-accent-cyan/10 rounded-2xl mb-6">
              <FileText className="w-12 h-12 text-accent-cyan" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
              Resume
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              View a detailed overview of my education, cybersecurity skills,
              and practical security lab experience.
            </p>
          </div>

          {/* ⭐ Skills Preview (makes section look professional) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Kali Linux
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Nmap
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Wireshark
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Burp Suite
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Log Analysis
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Bash
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Python
            </div>

            <div className="py-4 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300">
              Threat Detection
            </div>

          </div>

          {/* Resume Button */}
          <a
            href="/resume.pdf"
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-primary-bg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent-cyan/50 hover:-translate-y-1 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span>View Resume</span>
          </a>

          {/* Info Text */}
          <p className="mt-6 text-text-secondary text-sm">
            PDF • Updated 2026 • Includes education, projects and cybersecurity
            skills
          </p>
        </div>
      </div>
    </section>
  );
}