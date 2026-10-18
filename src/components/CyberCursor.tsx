import { useEffect, useRef } from "react";

/**
 * Minimal translucent bubble cursor matching the supplied reference:
 * a small, pale glass sphere with a fine cool-grey rim and soft lower shadow.
 * It follows the pointer directly to avoid cursor lag.
 */
export default function CyberCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("cc-bubble-cursor-enabled");

    const render = () => {
      frameRef.current = null;
      const el = cursorRef.current;
      if (!el) return;
      const { x, y } = pointerRef.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.classList.add("is-visible");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        cursorRef.current?.classList.remove("is-visible");
      }
    };

    const onEnterControl = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("a, button, input, textarea, select, [role='button']")) {
        cursorRef.current?.classList.add("is-hovering");
      }
    };

    const onLeaveControl = (event: MouseEvent) => {
      const from = event.target;
      const to = event.relatedTarget;
      if (!(from instanceof Element)) return;
      const wasControl = from.closest("a, button, input, textarea, select, [role='button']");
      const isControl = to instanceof Element
        ? to.closest("a, button, input, textarea, select, [role='button']")
        : null;
      if (wasControl && wasControl !== isControl) {
        cursorRef.current?.classList.toggle("is-hovering", Boolean(isControl));
      }
    };

    const onWindowBlur = () => {
      cursorRef.current?.classList.remove("is-visible", "is-hovering");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    window.addEventListener("mouseover", onEnterControl);
    window.addEventListener("mouseout", onLeaveControl);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      root.classList.remove("cc-bubble-cursor-enabled");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("mouseover", onEnterControl);
      window.removeEventListener("mouseout", onLeaveControl);
      window.removeEventListener("blur", onWindowBlur);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        html.cc-bubble-cursor-enabled,
        html.cc-bubble-cursor-enabled * {
          cursor: none !important;
        }

        /* The exact reference look: a small, nearly transparent pearl bubble. */
        .cc-water-bubble {
          position: fixed;
          top: 0;
          left: 0;
          width: 28px;
          height: 28px;
          z-index: 99999;
          pointer-events: none;
          opacity: 0;
          transform: translate3d(-100px, -100px, 0);
          will-change: transform, opacity;
          transition: opacity 100ms ease;
          filter: drop-shadow(0 3px 4px rgba(42, 55, 64, .20)) drop-shadow(0 0 1px rgba(120, 141, 152, .20));
        }

        .cc-water-bubble.is-visible { opacity: 1; }

        .cc-water-bubble__body {
          position: absolute;
          inset: 1px;
          border-radius: 50%;
          background: rgba(255, 255, 255, .30);
          border: 1.35px solid rgba(165, 181, 190, .96);
          box-shadow:
            inset 0 1px 1.5px rgba(255, 255, 255, 1),
            inset 1px 0 1px rgba(255, 255, 255, .92),
            inset -1px -2px 2px rgba(150, 169, 179, .30),
            0 0 0 1px rgba(255, 255, 255, .88);
          background-image:
            radial-gradient(ellipse 54% 32% at 32% 19%, rgba(255,255,255,.98), transparent 100%),
            radial-gradient(ellipse 82% 76% at 45% 35%, rgba(255,255,255,.25), rgba(235,241,244,.06) 75%, rgba(183,199,207,.20) 100%);
          transform: scale(1);
          transition: transform 180ms cubic-bezier(.2,.7,.25,1), border-color 180ms ease;
        }

        /* A delicate second rim and a faint lower crescent add spherical depth. */
        .cc-water-bubble__body::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          border: 1px solid rgba(255, 255, 255, .98);
          pointer-events: none;
        }

        .cc-water-bubble__body::after {
          content: "";
          position: absolute;
          left: 4px;
          right: 4px;
          bottom: 2px;
          height: 5px;
          border-bottom: 1px solid rgba(143, 162, 172, .68);
          border-radius: 0 0 50% 50%;
          box-shadow: 0 2px 2px rgba(190, 201, 207, .12);
          pointer-events: none;
        }

        .cc-water-bubble.is-hovering .cc-water-bubble__body {
          transform: scale(1.08);
          border-color: rgba(137, 158, 169, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-water-bubble,
          .cc-water-bubble__body { transition: none !important; }
        }
      `}</style>

      <div ref={cursorRef} className="cc-water-bubble" aria-hidden="true">
        <div className="cc-water-bubble__body" />
      </div>
    </>
  );
}
