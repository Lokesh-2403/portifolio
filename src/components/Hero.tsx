
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { FolderOpen, FileText, ChevronRight } from "lucide-react";

const THREAD_COUNT = 44;
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 800;
const REVEAL_DISTANCE = 240;

type CursorPosition = {
  x: number;
  y: number;
  active: boolean;
};

type ThreadShape = {
  index: number;
  t: number;
  initialX: number;
  finalX: number;
  opacity: number;
  width: number;
  color: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

function makeThreadPath(
  thread: ThreadShape,
  progress: number,
  time: number,
  cursor: CursorPosition
) {
  const { index, t, initialX, finalX } = thread;
  const p = clamp(progress, 0, 1);

  const wave = Math.sin(t * Math.PI * 2.8);
  const curve = Math.cos(t * Math.PI * 3.4);

  const finalPoints = [
    [finalX + wave * 14, -20],
    [finalX - 90 + curve * 18, 130],
    [finalX + 115 + wave * 20, 225],
    [finalX + wave * 30, 330],
    [finalX - 105 - curve * 24, 440],
    [finalX + 105 + wave * 15, 540],
    [finalX + curve * 20, 650],
    [finalX - 75 + wave * 15, 720],
    [finalX + 35, 770],
    [finalX + wave * 12, VIEW_HEIGHT + 20],
  ];

  // Start as a near-straight hanging thread, then gradually
  // form the original loose wave as the reveal progresses.
  const startPoint = [
    [initialX, -20],
    [initialX, 130],
    [initialX, 225],
    [initialX, 330],
    [initialX, 440],
    [initialX, 540],
    [initialX, 650],
    [initialX, 720],
    [initialX, 770],
    [initialX, VIEW_HEIGHT + 20],
  ];

  const points = startPoint.map(([x, y], pointIndex) => {
    const [targetX] = finalPoints[pointIndex];
    const blendedX = lerp(x, targetX, p);

    // Gentle independent movement keeps the threads organic
    // without making the whole group swing like a pendulum.
    const idleAmplitude = lerp(4.2, 1.1, p);
    const idle =
      Math.sin(time * 0.00065 + index * 0.43 + y * 0.008) *
      idleAmplitude;

    // The cursor bends only nearby threads. The influence
    // fades smoothly with distance from both cursor axes.
    let cursorBend = 0;

    if (cursor.active) {
      const horizontalDistance = (blendedX - cursor.x) / 105;
      const verticalDistance = (y - cursor.y) / 155;

      const horizontalInfluence = Math.exp(
        -horizontalDistance * horizontalDistance
      );
      const verticalInfluence = Math.exp(
        -verticalDistance * verticalDistance
      );

      const side = blendedX < cursor.x ? -1 : 1;

      cursorBend =
        side *
        horizontalInfluence *
        verticalInfluence *
        22 *
        (1 - p * 0.25);
    }

    return {
      x: blendedX + idle + cursorBend,
      y,
    };
  });

  const [start, c1, c2, end1, c3, c4, end2, c5, c6, end3] =
    points;

  return [
    `M ${start.x} ${start.y}`,
    `C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end1.x} ${end1.y}`,
    `C ${c3.x} ${c3.y}, ${c4.x} ${c4.y}, ${end2.x} ${end2.y}`,
    `C ${c5.x} ${c5.y}, ${c6.x} ${c6.y}, ${end3.x} ${end3.y}`,
  ].join(" ");
}

export default function Hero() {
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const threadPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const cursorRef = useRef<CursorPosition>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const progressRef = useRef(0);
  const activatedRef = useRef(false);

  const threads = useRef<ThreadShape[]>(
    Array.from({ length: THREAD_COUNT }, (_, index) => {
      const t = index / (THREAD_COUNT - 1);

      return {
        index,
        t,
        initialX: 18 + t * (VIEW_WIDTH - 36),
        finalX: 730 + t * 440,
        opacity: 0.35 + (index % 5) * 0.1,
        width: index % 6 === 0 ? 1.35 : 0.8,
        color:
          index % 7 === 0
            ? "#f2efe8"
            : index % 3 === 0
              ? "#c7b8a6"
              : "#b46a55",
      };
    })
  ).current;

  const activate = useCallback(() => {
    if (activatedRef.current) return;

    activatedRef.current = true;
    progressRef.current = 1;
    pointerStart.current = null;
    cursorRef.current.active = false;

    setDragging(false);
    setRevealed(true);
  }, []);

  const resetIntro = useCallback(() => {
    activatedRef.current = false;
    progressRef.current = 0;
    pointerStart.current = null;
    cursorRef.current.active = false;

    setDragging(false);
    setRevealed(false);
  }, []);

  // Animate the SVG paths directly instead of triggering React
  // renders on every pointer movement.
  useEffect(() => {
    let frameId = 0;
    let running = true;
    const startTime = performance.now();

    const animate = (now: number) => {
      if (!running) return;

      const elapsed = now - startTime;
      const progress = progressRef.current;
      const cursor = cursorRef.current;

      for (const thread of threads) {
        const path = threadPathRefs.current[thread.index];
        if (!path) continue;

        path.setAttribute(
          "d",
          makeThreadPath(thread, progress, elapsed, cursor)
        );
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
    };
  }, [threads]);

  // Lock page scrolling during the opening interaction, then
  // restore the exact previous overflow settings after reveal.
  useEffect(() => {
    if (revealed) return;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetIntro();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [revealed, resetIntro]);

  const updateCursor = (clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();

    cursorRef.current = {
      x: ((clientX - rect.left) / rect.width) * VIEW_WIDTH,
      y: ((clientY - rect.top) / rect.height) * VIEW_HEIGHT,
      active: true,
    };
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLElement>
  ) => {
    if (revealed || event.button !== 0) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setDragging(true);
    updateCursor(event.clientX, event.clientY);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional; the interaction still works.
    }
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLElement>
  ) => {
    updateCursor(event.clientX, event.clientY);

    if (!pointerStart.current || revealed) return;

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;

    const progress = clamp(
      (deltaX - Math.abs(deltaY) * 0.3) / REVEAL_DISTANCE,
      0,
      1
    );

    progressRef.current = progress;

    if (progress >= 1) activate();
  };

  const handlePointerUp = () => {
    pointerStart.current = null;
    setDragging(false);

    if (!revealed) {
      progressRef.current = 0;
    }
  };

  const handlePointerLeave = () => {
    if (!pointerStart.current) {
      cursorRef.current.active = false;
    }
  };

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    if (revealed) return;

    event.preventDefault();

    // Horizontal trackpad scrolling or Shift + mouse wheel
    // advances the same rightward reveal gesture.
    const horizontalDelta =
      Math.abs(event.deltaX) > 0
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0;

    if (horizontalDelta === 0) return;

    progressRef.current = clamp(
      progressRef.current + horizontalDelta / REVEAL_DISTANCE,
      0,
      1
    );

    if (progressRef.current >= 1) activate();
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      className={`hero-intro relative isolate min-h-[620px] h-[100svh] w-full overflow-hidden ${
        revealed ? "is-revealed" : ""
      }`}
      style={{
        backgroundColor: "#0b1320",
        touchAction: revealed ? "auto" : "none",
      }}
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
          stroke-linecap: round;
          vector-effect: non-scaling-stroke;
          will-change: d;
        }

        .hero-start-screen {
          opacity: 1;
          visibility: visible;
          transition: opacity 500ms ease, visibility 500ms ease;
          pointer-events: auto;
        }

        .hero-intro.is-revealed .hero-start-screen {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .hero-start-controls {
          position: absolute;
          left: 24px;
          bottom: 26px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }

        .hero-start-prompt {
          animation: promptFloat 2.8s ease-in-out infinite;
        }

        .hero-scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          animation: scrollHintBounce 2.4s ease-in-out infinite;
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

        .hero-photo-shell {
          opacity: 0;
          transform: translate3d(45px, 0, 0) scale(.94);
          clip-path: inset(0 100% 0 0);
          transition:
            clip-path 1300ms cubic-bezier(.16, 1, .3, 1),
            opacity 800ms ease,
            transform 1300ms cubic-bezier(.16, 1, .3, 1);
        }

        .hero-intro.is-revealed .hero-photo-shell {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          clip-path: inset(0 0 0 0);
          transition-delay: 200ms;
        }

        .hero-copy {
          opacity: 0;
          transform: translate3d(-24px, 10px, 0);
          filter: blur(4px);
          pointer-events: none;
          transition:
            opacity 800ms ease,
            transform 1000ms cubic-bezier(.16, 1, .3, 1),
            filter 800ms ease;
        }

        .hero-intro.is-revealed .hero-copy {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
          pointer-events: auto;
        }

        .hero-copy-line {
          opacity: 0;
          transform: translateY(10px);
        }

        .hero-intro.is-revealed .hero-copy-line {
          animation: heroTextIn 700ms cubic-bezier(.16, 1, .3, 1) forwards;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(1) {
          animation-delay: 400ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(2) {
          animation-delay: 550ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(3) {
          animation-delay: 700ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(4) {
          animation-delay: 850ms;
        }

        .hero-intro.is-revealed .hero-copy-line:nth-child(5) {
          animation-delay: 1000ms;
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
          50% { transform: translateY(-3px); }
        }

        @keyframes scrollHintBounce {
          0%, 100% {
            transform: translateX(0);
            opacity: .75;
          }
          50% {
            transform: translateX(5px);
            opacity: 1;
          }
        }

        @keyframes scrollArrowMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        @media (min-width: 640px) {
          .hero-start-controls {
            left: 40px;
            bottom: 36px;
          }
        }

        @media (max-width: 767px) {
          .hero-intro {
            min-height: 700px;
          }

          .hero-photo-shell {
            transform: translate3d(0, 18px, 0) scale(.96);
          }

          .hero-intro.is-revealed .hero-photo-shell {
            transform: translate3d(0, 0, 0) scale(1);
          }

          .hero-copy {
            transform: translate3d(0, 16px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
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

      {/* Original 44-thread field */}
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
              <stop offset="0%" stopColor="#b46a55" stopOpacity=".35" />
              <stop offset="52%" stopColor="#b46a55" stopOpacity=".9" />
              <stop offset="100%" stopColor="#c7b8a6" stopOpacity=".55" />
            </linearGradient>
          </defs>

          <g>
            {threads.map((thread) => (
              <path
                key={thread.index}
                ref={(element) => {
                  threadPathRefs.current[thread.index] = element;
                }}
                className="hero-thread"
                d={`M ${thread.initialX} -20 L ${thread.initialX} ${VIEW_HEIGHT + 20}`}
                stroke={thread.color}
                strokeWidth={thread.width}
                opacity={thread.opacity}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Very subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-[#b46a55]/[0.06] blur-[140px]"
      />

      {/* Opening controls: both at the bottom-left */}
      <div
        className={`hero-start-screen absolute inset-0 z-30 ${
          revealed ? "pointer-events-none" : ""
        }`}
      >
        <div className="hero-start-controls">
          <button
            type="button"
            onClick={activate}
            className="hero-button hero-start-prompt flex items-center gap-3 rounded-full border border-[#b46a55]/55 bg-[#0b1320]/85 px-5 py-3 text-sm font-medium text-[#f2efe8] backdrop-blur-md hover:border-[#b46a55] hover:bg-[#1f2a44]"
          >
            <span>Click here</span>
            <span className="flex items-center text-[#b46a55]">
              <ChevronRight size={17} />
              <ChevronRight className="-ml-2" size={17} />
              <ChevronRight className="-ml-2" size={17} />
            </span>
          </button>

          <button
            type="button"
            onClick={activate}
            className="hero-scroll-hint border-0 bg-transparent text-[#c7b8a6] hover:text-[#f2efe8]"
            aria-label="Reveal the hero introduction"
          >
            <span className="text-[10px] uppercase tracking-[0.28em]">
              {dragging ? "Release to continue" : "Scroll right"}
            </span>

            <span className="hero-scroll-arrows text-[#b46a55]">
              <ChevronRight size={17} />
              <ChevronRight className="-ml-2" size={17} />
              <ChevronRight className="-ml-2" size={17} />
            </span>
          </button>
        </div>
      </div>

      {/* Revealed profile composition */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-6 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-4 md:px-12 lg:px-16">
          <div className="hero-copy order-2 space-y-5 text-center md:order-1 md:text-left lg:space-y-6">
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

            <div className="hero-copy-line flex flex-wrap justify-center gap-3 pt-2 sm:gap-4 md:justify-start">
              <a
                href="#projects"
                className="hero-button pointer-events-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#b46a55] px-5 py-3 font-semibold text-white shadow-lg shadow-[#b46a55]/15 hover:bg-[#c17a64] sm:px-6"
              >
                <FolderOpen size={18} />
                View Projects
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View resume PDF in a new tab"
                className="hero-button pointer-events-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[#c7b8a6]/50 px-5 py-3 font-semibold text-[#f2efe8] hover:border-[#b46a55] hover:bg-[#1f2a44] sm:px-6"
              >
                <FileText size={18} />
                View Resume
              </a>
            </div>
          </div>

          <div className="hero-photo-shell order-1 mx-auto w-full max-w-[300px] md:order-2 md:max-w-[430px] lg:max-w-[500px]">
            <div className="relative mx-auto aspect-[4/5] max-h-[66svh] w-full max-w-[430px]">
              <div className="absolute inset-[8%] rounded-[48%] bg-[#b46a55]/15 blur-[60px]" />

              <div className="absolute inset-0 overflow-hidden rounded-[48%_48%_44%_44%] border border-[#b46a55]/40 bg-[#1f2a44]/40 shadow-[0_0_55px_rgba(180,106,85,0.08)]">
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
          onClick={resetIntro}
          className="hero-button absolute bottom-6 right-6 z-40 rounded-full border border-[#c7b8a6]/25 bg-[#0b1320]/85 px-4 py-2 text-xs text-[#c7b8a6]/80 backdrop-blur-md hover:border-[#b46a55] hover:text-[#f2efe8] sm:bottom-8 sm:right-8"
          aria-label="Replay hero introduction"
        >
          Replay intro
        </button>
      )}
    </section>
  );
}
