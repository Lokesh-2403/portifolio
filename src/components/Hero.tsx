
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { FolderOpen, FileText, ChevronRight } from "lucide-react";

const THREAD_COUNT = 44;
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 800;

export default function Hero() {
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activated = useRef(false);

  useEffect(() => {
    if (!revealed) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRevealed(false);
        setDragProgress(0);
        activated.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed]);

  const activate = () => {
    if (activated.current) return;

    activated.current = true;
    setRevealed(true);
    setDragProgress(1);
    setDragging(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (revealed) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current || revealed) return;

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;

    const progress = Math.max(
      0,
      Math.min(1, (deltaX - Math.abs(deltaY) * 0.3) / 240)
    );

    setDragProgress(progress);

    if (progress >= 1) activate();
  };

  const handlePointerUp = () => {
    pointerStart.current = null;
    setDragging(false);

    if (!revealed) setDragProgress(0);
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
    setDragging(false);

    if (!revealed) setDragProgress(0);
  };

  const threads = Array.from({ length: THREAD_COUNT }, (_, index) => {
    const t = index / (THREAD_COUNT - 1);
    const initialX = 18 + t * (VIEW_WIDTH - 36);
    const finalX = 730 + t * 440;
    const wave = Math.sin(t * Math.PI * 2.8);
    const curve = Math.cos(t * Math.PI * 3.4);

    const initialPath = `M ${initialX} -20 L ${initialX} ${VIEW_HEIGHT + 20}`;

    const finalPath = `
      M ${finalX + wave * 14} -20
      C ${finalX - 90 + curve * 18} 130,
        ${finalX + 115 + wave * 20} 225,
        ${finalX + wave * 30} 330
      C ${finalX - 105 - curve * 24} 440,
        ${finalX + 105 + wave * 15} 540,
        ${finalX + curve * 20} 650
      C ${finalX - 75 + wave * 15} 720,
        ${finalX + 35} 770,
        ${finalX + wave * 12} ${VIEW_HEIGHT + 20}
    `;

    return {
      index,
      initialPath,
      finalPath,
      opacity: 0.35 + (index % 5) * 0.1,
      width: index % 6 === 0 ? 1.35 : 0.8,
    };
  });

  return (
    <section
      id="home"
      className={`hero-intro relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden ${
        revealed ? "is-revealed" : ""
      }`}
      style={{ backgroundColor: "#0b1320" }}
    >
      <style>{`
        .hero-intro {
          --hero-bg: #0b1320;
          --hero-terra: #b46a55;
          --hero-sand: #c7b8a6;
          --hero-ivory: #f2efe8;
          color: var(--hero-ivory);
          contain: paint;
        }

        .hero-thread {
          fill: none;
          stroke: var(--hero-terra);
          stroke-linecap: round;
          vector-effect: non-scaling-stroke;
          transition:
            d 1700ms cubic-bezier(.16, 1, .3, 1),
            opacity 1000ms ease,
            stroke-width 900ms ease;
        }

        .hero-thread:nth-child(3n) {
          stroke: var(--hero-sand);
        }

        .hero-thread:nth-child(7n) {
          stroke: var(--hero-ivory);
        }

        .hero-thread-field {
          transition: transform 1700ms cubic-bezier(.16, 1, .3, 1);
        }

        .hero-intro.is-revealed .hero-thread-field {
          transform: translateX(-8px);
        }

        .hero-thread-glow {
          fill: none;
          stroke: var(--hero-terra);
          stroke-width: 7;
          opacity: 0;
          filter: blur(7px);
          transition: opacity 900ms ease;
        }

        .hero-intro.is-revealed .hero-thread-glow {
          opacity: .12;
        }

        .hero-photo-shell {
          opacity: 0;
          transform: translate3d(45px, 0, 0) scale(.94);
          clip-path: inset(0 100% 0 0);
          transition:
            clip-path 1500ms cubic-bezier(.16, 1, .3, 1),
            opacity 900ms ease,
            transform 1500ms cubic-bezier(.16, 1, .3, 1);
        }

        .hero-intro.is-revealed .hero-photo-shell {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          clip-path: inset(0 0 0 0);
          transition-delay: 250ms;
        }

        .hero-copy {
          opacity: 0;
          transform: translate3d(-28px, 12px, 0);
          filter: blur(5px);
          pointer-events: none;
          transition:
            opacity 900ms ease,
            transform 1100ms cubic-bezier(.16, 1, .3, 1),
            filter 900ms ease;
        }

        .hero-intro.is-revealed .hero-copy {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
          pointer-events: auto;
        }

        .hero-copy-line {
          opacity: 0;
          transform: translateY(12px);
        }

        .hero-intro.is-revealed .hero-copy-line {
          animation: heroTextIn 750ms cubic-bezier(.16, 1, .3, 1) forwards;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(1) {
          animation-delay: 500ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(2) {
          animation-delay: 650ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(3) {
          animation-delay: 800ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(4) {
          animation-delay: 950ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(5) {
          animation-delay: 1100ms;
        }

        .hero-start-screen {
          opacity: 1;
          transition: opacity 700ms ease, visibility 700ms ease;
          touch-action: pan-y;
        }

        .hero-intro.is-revealed .hero-start-screen {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .hero-start-prompt {
          animation: promptFloat 2.6s ease-in-out infinite;
        }

        .hero-scroll-hint {
          animation: scrollHintBounce 2.4s ease-in-out infinite;
          transform-origin: left center;
        }

        .hero-scroll-arrows {
          display: inline-flex;
          animation: scrollArrowMove 1.8s ease-in-out infinite;
        }

        .hero-button {
          position: relative;
          overflow: hidden;
          transition:
            color 300ms ease,
            background-color 300ms ease,
            border-color 300ms ease,
            transform 300ms ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        .hero-button::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(242, 239, 232, .13) 50%,
            transparent 75%
          );
          transform: translateX(-120%);
          transition: transform 650ms ease;
          pointer-events: none;
        }

        .hero-button:hover::after {
          transform: translateX(120%);
        }

        .hero-photo {
          filter: saturate(.85) contrast(1.04);
          transition: filter 800ms ease, transform 1200ms ease;
        }

        .hero-photo-shell:hover .hero-photo {
          filter: saturate(1) contrast(1.04);
          transform: scale(1.025);
        }

        @keyframes heroTextIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes promptFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes scrollHintBounce {
          0%, 100% {
            transform: translateX(0);
            opacity: .72;
          }
          50% {
            transform: translateX(8px);
            opacity: 1;
          }
        }

        @keyframes scrollArrowMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        @media (max-width: 767px) {
          .hero-intro {
            min-height: 700px;
          }

          .hero-photo-shell {
            transform: translate3d(0, 20px, 0) scale(.96);
          }

          .hero-intro.is-revealed .hero-photo-shell {
            transform: translate3d(0, 0, 0) scale(1);
          }

          .hero-copy {
            transform: translate3d(0, 18px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-thread,
          .hero-thread-field,
          .hero-thread-glow,
          .hero-photo-shell,
          .hero-copy,
          .hero-start-screen,
          .hero-button,
          .hero-photo {
            transition-duration: .01ms !important;
          }

          .hero-start-prompt,
          .hero-scroll-hint,
          .hero-scroll-arrows {
            animation: none !important;
          }

          .hero-intro.is-revealed .hero-copy-line {
            animation-duration: .01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      {/* Animated terracotta thread background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="heroThreadFade"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#b46a55" stopOpacity=".16" />
              <stop offset="52%" stopColor="#b46a55" stopOpacity=".8" />
              <stop offset="100%" stopColor="#c7b8a6" stopOpacity=".38" />
            </linearGradient>
          </defs>

          <g className="hero-thread-field">
            {threads.map((thread) => (
              <g key={thread.index}>
                <path
                  className="hero-thread-glow"
                  d={revealed ? thread.finalPath : thread.initialPath}
                  style={{ transitionDelay: `${thread.index * 9}ms` }}
                />

                <path
                  className="hero-thread"
                  d={revealed ? thread.finalPath : thread.initialPath}
                  stroke="url(#heroThreadFade)"
                  strokeWidth={thread.width}
                  opacity={revealed ? thread.opacity : 0.7}
                  style={{ transitionDelay: `${thread.index * 9}ms` }}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-[#b46a55]/10 blur-[140px]"
      />

      {/* Initial interaction screen */}
      <div
        className="hero-start-screen absolute inset-0 z-30 flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          <div className="max-w-xl">
            <p className="mb-4 text-xs uppercase tracking-[0.42em] text-[#c7b8a6]/70">
              Lokesh Babu · Cybersecurity
            </p>

            <p className="text-sm tracking-[0.12em] text-[#c7b8a6]/70 sm:text-base">
              A different perspective on digital defense.
            </p>
          </div>

          <button
            type="button"
            onClick={activate}
            className="hero-button hero-start-prompt flex items-center gap-4 rounded-full border border-[#b46a55]/50 bg-[#0b1320]/75 px-6 py-4 text-sm font-medium text-[#f2efe8] shadow-[0_0_35px_rgba(180,106,85,0.08)] backdrop-blur-md hover:border-[#b46a55] hover:bg-[#1f2a44]"
          >
            <span>Click here</span>

            <span className="flex items-center text-[#b46a55]">
              <ChevronRight size={17} />
              <ChevronRight className="-ml-2" size={17} />
              <ChevronRight className="-ml-2" size={17} />
            </span>
          </button>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c7b8a6]/40">
            {dragging
              ? `Drag right · ${Math.round(dragProgress * 100)}%`
              : "Drag right to reveal"}
          </p>
        </div>
      </div>

      {/* Bottom-left scroll control */}
      {!revealed && (
        <button
          type="button"
          onClick={activate}
          className="hero-scroll-hint absolute bottom-7 left-6 z-40 flex items-center gap-3 border-0 bg-transparent text-[#c7b8a6] sm:bottom-10 sm:left-10"
          aria-label="Reveal the hero introduction"
        >
          <span className="text-[10px] uppercase tracking-[0.28em]">
            Scroll right
          </span>

          <span className="hero-scroll-arrows text-[#b46a55]">
            <ChevronRight size={17} />
            <ChevronRight className="-ml-2" size={17} />
            <ChevronRight className="-ml-2" size={17} />
          </span>
        </button>
      )}

      {/* Revealed hero composition */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-6 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-4 md:px-12 lg:px-16">
          {/* Text on the left */}
          <div className="hero-copy order-2 space-y-6 text-center md:order-1 md:text-left">
            <div className="hero-copy-line">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#c7b8a6] sm:text-sm">
                Cybersecurity • Security Operations
              </p>
            </div>

            <div className="hero-copy-line">
              <h1 className="font-poppins text-4xl font-bold tracking-tight text-[#f2efe8] sm:text-5xl lg:text-7xl">
                Lokesh Babu
              </h1>
            </div>

            <div className="hero-copy-line">
              <h2 className="text-base font-semibold text-[#b46a55] sm:text-lg lg:text-xl">
                Aspiring Junior Cybersecurity Analyst
              </h2>
            </div>

            <div className="hero-copy-line">
              <p className="text-sm font-medium tracking-wide text-[#c7b8a6] sm:text-base lg:text-lg">
                Learning | Practicing | Building Security Skills
              </p>
            </div>

            <div className="hero-copy-line flex flex-wrap justify-center gap-4 pt-2 md:justify-start">
              <a
                href="#projects"
                className="hero-button pointer-events-auto flex items-center gap-2 rounded-lg bg-[#b46a55] px-6 py-3 font-semibold text-white shadow-lg shadow-[#b46a55]/15 hover:bg-[#c17a64]"
              >
                <FolderOpen size={18} />
                View Projects
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View resume PDF in a new tab"
                className="hero-button pointer-events-auto flex items-center gap-2 rounded-lg border border-[#c7b8a6]/50 px-6 py-3 font-semibold text-[#f2efe8] hover:border-[#b46a55] hover:bg-[#1f2a44]"
              >
                <FileText size={18} />
                View Resume
              </a>
            </div>
          </div>

          {/* Photo loaded from public/profile.jpg.png */}
          <div className="hero-photo-shell order-1 mx-auto w-full max-w-[360px] md:order-2 md:max-w-[500px] lg:max-w-[560px]">
            <div className="relative mx-auto aspect-[4/5] max-h-[76svh] w-full max-w-[430px]">
              <div className="absolute inset-[8%] rounded-[48%] bg-[#b46a55]/20 blur-[60px]" />

              <div className="absolute inset-0 overflow-hidden rounded-[48%_48%_44%_44%] border border-[#b46a55]/40 bg-[#1f2a44]/40 shadow-[0_0_80px_rgba(180,106,85,0.12)]">
                <img
                  src="/profile.jpg.png"
                  alt="Lokesh Babu Adusumalli"
                  title="Lokesh Babu Adusumalli"
                  width="560"
                  height="700"
                  loading="eager"
                  decoding="async"
                  className="hero-photo h-full w-full object-cover object-center"
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute -bottom-3 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#b46a55]/80 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Replay the opening */}
      {revealed && (
        <button
          type="button"
          onClick={() => {
            setRevealed(false);
            setDragProgress(0);
            activated.current = false;
          }}
          className="hero-button absolute bottom-6 right-6 z-40 rounded-full border border-[#c7b8a6]/25 bg-[#0b1320]/75 px-4 py-2 text-xs text-[#c7b8a6]/80 backdrop-blur-md hover:border-[#b46a55] hover:text-[#f2efe8] sm:bottom-8 sm:right-8"
          aria-label="Replay hero introduction"
        >
          Replay intro
        </button>
      )}
    </section>
  );
}
