
import { Shield, FolderOpen, FileText } from "lucide-react";
import profile from "../assets/profile.jpg.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0b1320" }}
    >
      <div className="absolute inset-0 bg-[#0b1320]/60 backdrop-blur-[2px]" />

      {/* Animated background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-2xl aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="network-animation">
              <Shield
                className="w-64 h-64 text-[#b46a55] opacity-15"
                strokeWidth={0.5}
              />
              <div className="shield-glow" />
            </div>
          </div>

          <svg
            className="absolute inset-0 w-full h-full animate-rotate-slow"
            viewBox="0 0 200 200"
          >
            <defs>
              <linearGradient
                id="gridGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b46a55" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c7b8a6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" opacity="0.6" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="url(#gridGradient)" strokeWidth="0.5" opacity="0.3" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="url(#gridGradient)" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 lg:px-12 py-24 relative z-10">
        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl animate-fade-in">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-[#b46a55]/15 blur-xl" />
                <img
                  src={profile}
                  alt="Lokesh Babu Adusumalli"
                  title="Lokesh Babu Adusumalli"
                  width="208"
                  height="208"
                  loading="eager"
                  decoding="async"
                  className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-[#c7b8a6] shadow-xl shadow-black/30"
                />
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.25em] text-[#c7b8a6] font-medium">
                  Cybersecurity • Security Operations
                </p>

                <h1 className="text-5xl lg:text-7xl font-bold text-[#f2efe8] font-poppins tracking-tight">
                  Lokesh Babu
                </h1>

                <h2 className="text-lg lg:text-xl font-semibold text-[#b46a55]">
                  Aspiring Junior Cybersecurity Analyst
                </h2>

                <p className="text-lg lg:text-xl text-[#c7b8a6] font-medium tracking-wide">
                  Learning | Practicing | Building Security Skills
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6">
                  <a
                    href="#projects"
                    className="flex items-center gap-2 px-6 py-3 bg-[#b46a55] text-white font-semibold rounded-lg hover:bg-[#c17a64] hover:-translate-y-1 transition duration-300 shadow-lg shadow-[#b46a55]/20"
                  >
                    <FolderOpen size={18} />
                    View Projects
                  </a>

                  <a
                    href="#resume"
                    className="flex items-center gap-2 px-6 py-3 border border-[#c7b8a6]/60 text-[#f2efe8] font-semibold rounded-lg hover:bg-[#1f2a44] hover:border-[#b46a55] hover:text-[#c7b8a6] transition duration-300"
                  >
                    <FileText size={18} />
                    Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-rotate-slow {
          animation: rotate-slow 60s linear infinite;
        }

        .network-animation {
          position: relative;
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .shield-glow {
          position: absolute;
          inset: -30%;
          background: radial-gradient(
            circle,
            rgba(180, 106, 85, 0.2) 0%,
            rgba(199, 184, 166, 0.05) 35%,
            transparent 70%
          );
          animation: pulse-glow 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-rotate-slow,
          .network-animation,
          .shield-glow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
