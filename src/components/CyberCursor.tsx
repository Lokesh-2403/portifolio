import { useEffect, useRef, useState } from "react";

export default function CyberCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const trailEls = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>();

  useEffect(() => {
    const TRAIL_COUNT = 6;
    const positions: { x: number; y: number }[] = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };

    const animateTrail = () => {
      positions.unshift({ ...mousePos.current });
      positions.pop();
      trailEls.current.forEach((el, i) => {
        if (el && positions[i]) {
          el.style.left = positions[i].x + "px";
          el.style.top = positions[i].y + "px";
        }
      });
      animFrame.current = requestAnimationFrame(animateTrail);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) setHovering(true);
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) setHovering(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    animFrame.current = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }

        .cyber-cursor {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 99999;
          transform: translate(-50%, -50%);
        }

        .cyber-inner-dot {
          width: 10px;
          height: 10px;
          background: #00ffff;
          border-radius: 50%;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff88;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          z-index: 2;
        }

        .cyber-cursor.clicking .cyber-inner-dot {
          transform: translate(-50%, -50%) scale(1.5);
          box-shadow: 0 0 16px #00ffff, 0 0 32px #00ffff;
        }

        .cyber-outer-ring {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: ringRotate 2s linear infinite;
        }

        .cyber-cursor.hovering .cyber-outer-ring {
          animation: ringRotate 0.6s linear infinite;
        }

        .cyber-outer-ring svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 4px #00ffff) drop-shadow(0 0 8px #00ffff88);
          transition: filter 0.2s;
        }

        .cyber-cursor.hovering .cyber-outer-ring svg {
          filter: drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 16px #00ffff);
        }

        .cyber-trail {
          position: fixed;
          pointer-events: none;
          z-index: 99998;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00ffff;
          transform: translate(-50%, -50%);
        }

        @keyframes ringRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      {/* Trail dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="cyber-trail"
          style={{ opacity: ((6 - i) / 6) * 0.3 }}
          ref={(el) => { if (el) trailEls.current[i] = el; }}
        />
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`cyber-cursor ${clicking ? "clicking" : ""} ${hovering ? "hovering" : ""}`}
        style={{ width: 44, height: 44 }}
      >
        {/* Filled cyan inner circle */}
        <div className="cyber-inner-dot" />

        {/* Rotating outer ring with 4 tick marks centered on the circle edge */}
        <div className="cyber-outer-ring">
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* Outer circle — radius 11 (was 18, reduced by ~40%) */}
  <circle cx="22" cy="22" r="11" stroke="#00ffff" strokeWidth="1.5" />

  {/*
    Tick midpoints ON the circle (r=11):
    Top:    y = 22-11 = 11 → line y=8  to y=14
    Bottom: y = 22+11 = 33 → line y=30 to y=36
    Left:   x = 22-11 = 11 → line x=8  to x=14
    Right:  x = 22+11 = 33 → line x=30 to x=36
  */}
  {/* Top */}
  <line x1="22" y1="8"  x2="22" y2="14" stroke="#00ffff" strokeWidth="2" strokeLinecap="round"/>
  {/* Bottom */}
  <line x1="22" y1="30" x2="22" y2="36" stroke="#00ffff" strokeWidth="2" strokeLinecap="round"/>
  {/* Left */}
  <line x1="8"  y1="22" x2="14" y2="22" stroke="#00ffff" strokeWidth="2" strokeLinecap="round"/>
  {/* Right */}
  <line x1="30" y1="22" x2="36" y2="22" stroke="#00ffff" strokeWidth="2" strokeLinecap="round"/>
</svg>
        </div>
      </div>
    </>
  );
}