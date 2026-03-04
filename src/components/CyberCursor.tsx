import { useEffect, useRef, useState } from "react";

export default function CyberCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId  = useRef(0);
  const mouse     = useRef({ x: -200, y: -200 });
  const ringPos   = useRef({ x: -200, y: -200 });
  const rafId     = useRef<number>();
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };

    const onDown = (e: MouseEvent) => {
      const id = rippleId.current++;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
    };

    const onEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,input,textarea,select,[role='button']")) {
        hoveringRef.current = true;
        setHovering(true);
      }
    };
    const onLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,input,textarea,select,[role='button']")) {
        hoveringRef.current = false;
        setHovering(false);
      }
    };

    // Smooth lagging ring
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.1);
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top  = ringPos.current.y + "px";
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseover",  onEnter);
    document.addEventListener("mouseout",   onLeave);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseover",  onEnter);
      document.removeEventListener("mouseout",   onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }

        /* ── Sharp inner dot ── */
        .cc-dot {
          position: fixed;
          width: 5px; height: 5px;
          background: #00e5ff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99999;
          transition: transform 0.1s ease, background 0.1s ease;
          box-shadow: 0 0 5px rgba(0,229,255,0.5);
        }
        .cc-dot.hovering {
          transform: translate(-50%, -50%) scale(0);
        }

        /* ── Smooth lagging ring ── */
        .cc-ring {
          position: fixed;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,229,255,0.55);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99998;
          transition: width 0.3s ease, height 0.3s ease,
                      border-color 0.3s ease, background-color 0.3s ease,
                      box-shadow 0.3s ease;
        }
        .cc-ring.hovering {
          width: 44px; height: 44px;
          border-color: rgba(0,229,255,0.9);
          background-color: rgba(0,229,255,0.06);
          box-shadow: 0 0 12px rgba(0,229,255,0.15);
        }

        /* ── Shockwave ripple on click ── */
        .cc-ripple {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99997;
          transform: translate(-50%, -50%);
          animation: shockwave 0.75s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }
        .cc-ripple-1 {
          width: 8px; height: 8px;
          border: 1.5px solid rgba(0,229,255,0.8);
          animation-delay: 0s;
        }
        .cc-ripple-2 {
          width: 8px; height: 8px;
          border: 1px solid rgba(0,229,255,0.4);
          animation-delay: 0.1s;
        }
        .cc-ripple-3 {
          width: 8px; height: 8px;
          border: 1px solid rgba(0,229,255,0.2);
          animation-delay: 0.2s;
        }

        @keyframes shockwave {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(7);   opacity: 0; }
        }
      `}</style>

      {/* Shockwave rings on click */}
      {ripples.map(r => (
        <div key={r.id} style={{ position: "fixed", left: r.x, top: r.y, pointerEvents: "none", zIndex: 99997 }}>
          <div className="cc-ripple cc-ripple-1" style={{ left: 0, top: 0 }} />
          <div className="cc-ripple cc-ripple-2" style={{ left: 0, top: 0 }} />
          <div className="cc-ripple cc-ripple-3" style={{ left: 0, top: 0 }} />
        </div>
      ))}

      {/* Lagging ring */}
      <div ref={ringRef} className={`cc-ring ${hovering ? "hovering" : ""}`} />

      {/* Sharp dot */}
      <div ref={dotRef}  className={`cc-dot  ${hovering ? "hovering" : ""}`} />
    </>
  );
}