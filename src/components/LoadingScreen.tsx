
import { useEffect, useState } from "react";
import "./LoadingScreen.css";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({
  onComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    const animate = (now: number) => {
      const elapsed = now - start;

      // Progress completes as the fade-out begins.
      const nextProgress = Math.min(100, (elapsed / 1600) * 100);
      setProgress(nextProgress);

      if (elapsed < 1600) {
        frame = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setExiting(true);
      }
    };

    frame = requestAnimationFrame(animate);

    // Full intro duration, including the 400ms fade-out: 2 seconds.
    const finishTimer = window.setTimeout(finish, 2000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`loading-screen${exiting ? " loading-screen--exit" : ""}`}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="loading-grain" aria-hidden="true" />

      <div className="loading-content">
        <div className="loading-emblem" aria-hidden="true">
          <svg viewBox="0 0 100 112" fill="none">
            <path
              d="M50 4 89 19v34c0 25-15 42-39 55C26 95 11 78 11 53V19L50 4Z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M50 13 80 25v28c0 19-12 34-30 44C32 87 20 72 20 53V25l30-12Z"
              stroke="#C7B8A6"
              strokeOpacity=".55"
              strokeWidth=".7"
            />
            <path
              d="M38 47h24v20L50 76 38 67V47Z"
              stroke="#F2EFE8"
              strokeOpacity=".8"
              strokeWidth="1.2"
            />
            <path
              d="M43 47v-5a7 7 0 0 1 14 0v5"
              stroke="#F2EFE8"
              strokeOpacity=".8"
              strokeWidth="1.2"
            />
            <circle cx="50" cy="56" r="2" fill="#B46A55" />
            <path
              d="M50 58v5"
              stroke="#B46A55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="loading-name">LOKESH BABU</h1>

        <div className="loading-progress">
          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="loading-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="linenCopperWave">
              <stop offset="0%" stopColor="#B46A55" stopOpacity="0" />
              <stop offset="50%" stopColor="#C7B8A6" stopOpacity=".55" />
              <stop offset="75%" stopColor="#B46A55" stopOpacity=".8" />
              <stop offset="100%" stopColor="#B46A55" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            className="wave wave-one"
            d="M-40 190 C180 95 280 245 490 175 S810 100 1010 190 S1280 245 1480 125"
          />
          <path
            className="wave wave-two"
            d="M-40 220 C180 285 330 130 540 205 S860 270 1060 175 S1300 120 1480 215"
          />
          <path
            className="wave wave-three"
            d="M-40 255 C190 180 350 295 570 235 S880 175 1090 255 S1300 275 1480 220"
          />

          {Array.from({ length: 42 }, (_, i) => (
            <circle
              key={i}
              className="loading-spark"
              cx={(i * 173 + 31) % 1440}
              cy={155 + ((i * 47) % 130)}
              r={i % 6 === 0 ? 1.5 : 0.7}
              style={{
                animationDelay: `${-(i % 12) * 0.24}s`,
                animationDuration: `${3.2 + (i % 5) * 0.5}s`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
