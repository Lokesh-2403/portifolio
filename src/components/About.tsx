
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { projects } from "./Projects";

const stats = [
  {
    label: "Hackathons Participated",
    value: 1,
    background: "#1f2a44",
    color: "#f2efe8",
  },
  {
    label: "Projects Completed",
    value: projects.length,
    background: "#b46a55",
    color: "#0b1320",
  },
  {
    label: "CTFs Participated",
    value: 1,
    background: "#c7b8a6",
    color: "#0b1320",
  },
];

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let currentStep = 0;
    const totalSteps = 50;
    const duration = 1500;
    const intervalTime = duration / totalSteps;

    const timer = window.setInterval(() => {
      currentStep++;

      setCount(
        Math.min(
          Math.round((target * currentStep) / totalSteps),
          target
        )
      );

      if (currentStep >= totalSteps) {
        window.clearInterval(timer);
      }
    }, intervalTime);

    return () => window.clearInterval(timer);
  }, [target]);

  return <>{count}</>;
}

function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect();

  event.currentTarget.style.setProperty(
    "--mouse-x",
    `${event.clientX - rect.left}px`
  );

  event.currentTarget.style.setProperty(
    "--mouse-y",
    `${event.clientY - rect.top}px`
  );
}

export default function About() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardEnter = (card: string) => {
    setActiveCard(card);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  return (
    <section
      id="about"
      onMouseLeave={handleCardLeave}
      className="w-full overflow-hidden px-6 py-20"
      style={{ backgroundColor: "#0b1320" }}
    >
      <style>{`
        .about-interactive-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          transform: scale(1);
          filter: brightness(1);
          --mouse-x: 50%;
          --mouse-y: 50%;
          transition:
            transform 450ms cubic-bezier(.2, .8, .2, 1),
            filter 400ms ease,
            box-shadow 400ms ease,
            border-color 400ms ease;
          will-change: transform, filter;
        }

        .about-interactive-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            280px circle at var(--mouse-x) var(--mouse-y),
            rgba(180, 106, 85, 0.30),
            rgba(180, 106, 85, 0.08) 42%,
            transparent 72%
          );
          transition: opacity 350ms ease;
        }

        .about-interactive-card.is-active {
          transform: scale(1.035);
          filter: brightness(1.08);
          z-index: 3;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
        }

        .about-interactive-card.is-active::before {
          opacity: 1;
        }

        .about-interactive-card.is-dimmed {
          transform: scale(0.975);
          filter: brightness(0.65);
        }

        .about-stat-card.is-active {
          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(180, 106, 85, 0.38);
        }

        .about-copy {
          transition: color 350ms ease;
        }

        @media (hover: none) {
          .about-interactive-card.is-active {
            transform: none;
            filter: none;
          }

          .about-interactive-card.is-dimmed {
            transform: none;
            filter: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-interactive-card,
          .about-interactive-card::before,
          .about-copy {
            transition: none !important;
          }

          .about-interactive-card.is-active,
          .about-interactive-card.is-dimmed {
            transform: none;
            filter: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        {/* About card */}
        <div
          onMouseEnter={() => handleCardEnter("about")}
          onMouseMove={handleMouseMove}
          className={`about-interactive-card rounded-2xl p-8 md:p-12 ${
            activeCard === "about"
              ? "is-active"
              : activeCard !== null
                ? "is-dimmed"
                : ""
          }`}
          style={{
            backgroundColor: "#f2efe8",
            color: "#0b1320",
          }}
        >
          <h2 className="about-copy mb-6 text-3xl font-bold md:text-4xl">
            About Me
          </h2>

          <div className="about-copy space-y-4 text-base leading-7 md:text-lg md:leading-8">
            <p>
              I am a dedicated <strong>Cybersecurity Student</strong> actively
              working on the path to become a SOC Analyst. While I am at the
              beginning of my professional journey, I am fully invested in
              building the practical skills needed for the role. My daily focus
              is on mastering the fundamentals of networking, operating systems,
              and threat detection. Through hands-on home labs and self-study,
              I am training myself to analyze logs, monitor traffic, and
              understand how to spot cyber threats. I am highly motivated,
              eager to learn, and looking for an opportunity to kickstart my
              career on the front lines of digital defense.
            </p>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const isActive = activeCard === stat.label;
            const isDimmed =
              activeCard !== null && activeCard !== stat.label;

            return (
              <div
                key={stat.label}
                onMouseEnter={() => handleCardEnter(stat.label)}
                onMouseMove={handleMouseMove}
                className={`about-interactive-card about-stat-card rounded-2xl p-7 text-center ${
                  isActive
                    ? "is-active"
                    : isDimmed
                      ? "is-dimmed"
                      : ""
                }`}
                style={{
                  backgroundColor: stat.background,
                  color: stat.color,
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
                }}
              >
                <div className="about-copy mb-3 text-4xl font-bold md:text-5xl">
                  <CountUp target={stat.value} />
                </div>

                <p className="about-copy text-sm font-semibold md:text-base">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
