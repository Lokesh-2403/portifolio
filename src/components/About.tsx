import { useState, useEffect, useRef } from "react";

function StatCard({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-center rounded-2xl border px-6 py-6 transition-all duration-300 cursor-default"
      style={{
        background: hovered
          ? "rgba(0,255,255,0.07)"
          : "rgba(255,255,255,0.03)",
        borderColor: hovered
          ? "rgba(0,255,255,0.4)"
          : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-5px)" : "translateY(0px)",
        boxShadow: hovered
          ? "0 0 24px rgba(0,255,255,0.15)"
          : "none",
      }}
    >
      {/* Glow dot on top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
        style={{
          background: hovered ? "#000000" : "transparent",
          boxShadow: hovered ? "0 0 8px #06b6d4" : "none",
        }}
      />

      {/* Number */}
      <div
        className="text-4xl font-black mb-1 transition-all duration-300"
        style={{
          color: hovered ? "#06b6d4" : "#ffffff",
          textShadow: hovered ? "0 0 20px rgba(6,182,212,0.5)" : "none",
        }}
      >
        {count}
        {suffix}
      </div>

      {/* Label */}
      <div
        className="text-xs font-semibold uppercase tracking-widest text-center transition-all duration-300"
        style={{
          color: hovered ? "rgba(0,255,255,0.8)" : "rgba(255,255,255,0.4)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">

          {/* ── HEADING ── */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
              About Me
            </h2>

            <div className="relative h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50 max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan to-transparent blur-sm"></div>
            </div>
          </div>

          {/* ── ABOUT TEXT ── */}
          <div className="bg-primary-bg/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/8 hover:border-accent-blue/30 transition-all duration-500">

            <p className="text-text-secondary text-lg leading-relaxed">
              I am{" "}
              <strong className="text-white">
                Lokesh Babu Adusumalli
              </strong>
              , a cybersecurity student from Bengaluru, India, currently
              studying at Dayananda Sagar College of Engineering. I am focused
              on developing practical skills in security monitoring, network
              security, vulnerability assessment, log analysis, and incident
              investigation.
            </p>

            <p className="text-text-secondary text-lg leading-relaxed mt-6">
              Through hands-on labs and security projects, I am building a
              strong foundation in cybersecurity, SOC operations, threat
              detection, and security analysis. I am particularly interested
              in understanding how cyberattacks occur, analyzing security
              events, and learning how security teams detect and respond to
              threats. My goal is to begin my career as a{" "}
              <strong className="text-white">
                Junior Cybersecurity Analyst
              </strong>
              .
            </p>

          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <StatCard value={2} label="Projects Completed" />
            <StatCard value={5} label="Tools Practiced" />
            <StatCard value={881} label="Events Analyzed" />
            <StatCard value={1} label="Security Reports" />
          </div>

        </div>
      </div>
    </section>
  );
}