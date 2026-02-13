import { Shield } from "lucide-react";
import profile from "../assets/profile.jpg.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle Overlay for Better Readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Cyber Shield Animated Background Element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-2xl aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="network-animation">
              <Shield
                className="w-64 h-64 text-accent-cyan opacity-10"
                strokeWidth={0.5}
              />
              <div className="shield-glow"></div>
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
                <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity="0.2"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity="0.4"
            />

            <line
              x1="100"
              y1="20"
              x2="100"
              y2="180"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity="0.15"
            />
            <line
              x1="20"
              y1="100"
              x2="180"
              y2="100"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity="0.15"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl animate-fade-in">

            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={profile}
                alt="Lokesh Babu"
                className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-accent-cyan shadow-lg shadow-accent-cyan/20"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6 text-center md:text-left">
              <div className="space-y-3">
                <h1 className="text-5xl lg:text-7xl font-bold text-white font-poppins tracking-tight">
                  Lokesh Babu
                </h1>

                <h2 className="text-2xl lg:text-3xl font-semibold text-accent-cyan">
                  Beginner Cybersecurity Analyst
                </h2>

                <p className="text-lg lg:text-xl text-gray-300 font-medium tracking-wide">
                  Learning | Practicing | Building Security Skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
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
          background: radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%);
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
