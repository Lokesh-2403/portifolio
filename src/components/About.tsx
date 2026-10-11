
import { useEffect, useState } from "react";
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

export default function About() {
  return (
    <section
      id="about"
      className="w-full px-6 py-20"
      style={{ backgroundColor: "#0b1320" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* About card */}
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            backgroundColor: "#f2efe8",
            color: "#0b1320",
          }}
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            About Me
          </h2>

          {/* Description with approximately 30% larger font */}
          
<div className="space-y-4 text-base leading-7 md:text-lg md:leading-8">
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

        {/* Stats below the About card */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-7 text-center transition-transform duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: stat.background,
                color: stat.color,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div className="mb-3 text-4xl font-bold md:text-5xl">
                <CountUp target={stat.value} />
              </div>

              <p className="text-sm font-semibold md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
