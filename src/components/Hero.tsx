import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

/* ────────────────────────────────────────────────────────────
   EDIT THIS BLOCK — content, photo and theme
   ──────────────────────────────────────────────────────────── */

const PROFILE = {
  name: "Lokesh Babu",
  kicker: "Cybersecurity and security operations",
  statement:
    "I defend systems: detecting, investigating and shutting down threats before they become incidents.",
  bio: [
    "I work in security operations, turning noisy logs and alerts into clear signals, and clear signals into fast, well-documented response.",
    "I care about practical defence: good detections, calm triage and write-ups other people can learn from.",
  ],
  skills: ["SIEM", "Threat hunting", "Incident response", "Network security"],
  status: "Available for opportunities",
  links: [
    { label: "Resume", href: "/resume.pdf" },
    { label: "Email", href: "mailto:you@example.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "GitHub", href: "https://github.com/your-handle" },
  ],
};

// Tried in order. Put your photo in /public and keep one of these names.
// Use the white-background cutout first (profile-cutout.png), then fall back
// to your original photo names.
const IMAGE_SOURCES = [
  "/profile-cutout.png",
  "/profile.jpg",
  "/profile.png",
  "/profile.jpeg",
  "/profile.webp",
];

// "light" = dark ink lines on paper (exactly like the video).
// "dark"  = light lines on a dark page (set paper/ink to taste).
const THEME = {
  mode: "light" as "light" | "dark",
  paper: "#fbfbf9",
  ink: "#15171c",
  muted: "#5a5f69",
  accent: "#2e9d4f",
};

// Framing of the photo inside the thread area.
// ZOOM > 1 crops closer to the face; FOCUS picks which part stays in frame (0..1).
const ZOOM = 1.2;
const FOCUS = { x: 0.5, y: 0.08 };

/* ────────────────────────────────────────────────────────────
   Tuning
   ──────────────────────────────────────────────────────────── */

const REVEAL_DISTANCE = 0.38; // fraction of screen width to drag to commit
const STAGGER = 0.3; // how much the left lines lead the right ones
const HAIR = 0.9; // intro line thickness (px)
const SWAY = 2.2; // idle sway of the intro lines (px)
const PAD = 6; // inset of first/last intro line

// Thread art
const BASE_DENSITY = 0.35; // thread density on the white background
const TONE_DENSITY = 1.3; // extra density on dark parts of the photo
const WIDTH_FRACTION = 0.72; // max thread thickness as a fraction of local spacing
const WIDTH_GAMMA = 1.15; // contrast of thickness (higher = brighter highlights)
const DETAIL = 0.7; // facial detail boost (unsharp mask strength)

// Cursor lens (a true circle)
const LENS_RADIUS = 150; // px
const LENS_PUSH = 0.95; // 0..1 of the radius

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number };
type Geo = { fx: Float32Array; fw: Float32Array };

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function blurAxis(
  src: Float32Array,
  w: number,
  h: number,
  r: number,
  horizontal: boolean
) {
  if (r <= 0) return src;
  const out = new Float32Array(src.length);
  const len = horizontal ? w : h;
  const lines = horizontal ? h : w;
  const size = r * 2 + 1;

  for (let l = 0; l < lines; l++) {
    const at = (i: number) => (horizontal ? l * w + i : i * w + l);
    let sum = 0;
    for (let k = -r; k <= r; k++) sum += src[at(clamp(k, 0, len - 1))];
    for (let i = 0; i < len; i++) {
      out[at(i)] = sum / size;
      sum += src[at(Math.min(i + r + 1, len - 1))] - src[at(Math.max(i - r, 0))];
    }
  }
  return out;
}

// Separable box blur; 3 passes approximate a gaussian.
function blur(
  src: Float32Array,
  w: number,
  h: number,
  rx: number,
  ry: number,
  passes = 1
) {
  let out = src;
  for (let i = 0; i < passes; i++) {
    out = blurAxis(blurAxis(out, w, h, rx, true), w, h, ry, false);
  }
  return out;
}

function loadFirstImage(sources: string[]) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    let i = 0;
    const next = () => {
      if (i >= sources.length) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => {
        i += 1;
        next();
      };
      img.src = sources[i];
    };
    next();
  });
}

/**
 * Turns the photo into line geometry.
 *
 * For every sampled row of the image, a density profile is built from the
 * photo's tone. The N lines are then placed at equal steps of the cumulative
 * density, so lines crowd together in dark areas and spread apart (curving
 * around the silhouette) in light ones. Each line's thickness follows the
 * local tone, which is what produces the engraved look.
 */
function buildGeometry(
  img: HTMLImageElement | null,
  rect: Rect,
  N: number,
  R: number,
  mode: "light" | "dark"
): Geo {
  const C = 360;
  const rows = Math.max(2, Math.round((C * rect.h) / rect.w));
  let tone: Float32Array = new Float32Array(C * rows); // detailed tone: drives thickness
  let toneD: Float32Array = new Float32Array(C * rows); // smooth tone: drives thread positions

  if (img && img.naturalWidth > 0) {
    const off = document.createElement("canvas");
    off.width = C;
    off.height = rows;
    const c = off.getContext("2d", { willReadFrequently: true });

    if (c) {
      c.fillStyle = mode === "light" ? "#fff" : "#000";
      c.fillRect(0, 0, C, rows);

      // "cover" fit, then zoom, around a focus point
      const s = Math.max(C / img.naturalWidth, rows / img.naturalHeight) * ZOOM;
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      c.drawImage(img, (C - dw) * FOCUS.x, (rows - dh) * FOCUS.y, dw, dh);

      const data = c.getImageData(0, 0, C, rows).data;
      const lum = new Float32Array(C * rows);
      for (let i = 0; i < lum.length; i++) {
        lum[i] =
          (0.2126 * data[i * 4] +
            0.7152 * data[i * 4 + 1] +
            0.0722 * data[i * 4 + 2]) /
          255;
      }

      // auto-levels so any photo uses the full tonal range
      const sorted = Float32Array.from(lum).sort();
      const lo = sorted[Math.floor(sorted.length * 0.02)];
      const hi = sorted[Math.floor(sorted.length * 0.98)];
      const span = Math.max(hi - lo, 0.08);

      for (let i = 0; i < lum.length; i++) {
        const t = clamp((lum[i] - lo) / span, 0, 1);
        tone[i] = mode === "light" ? 1 - t : t;
      }

      // unsharp mask: brings out eyes, brows, nose and mouth
      const soft = blur(tone, C, rows, 6, 6);
      for (let i = 0; i < tone.length; i++) {
        tone[i] = clamp(tone[i] + DETAIL * (tone[i] - soft[i]), 0, 1);
      }
      tone = blur(tone, C, rows, 1, 2);

      // Positions come from a much smoother copy, so the threads flow in
      // clean curves while thickness carries the fine detail.
      toneD = blur(tone, C, rows, 3, 7, 3);
    }
  }

  const fx = new Float32Array(N * R);
  const fw = new Float32Array(N * R);
  const toneRow = new Float32Array(C);
  const toneRowD = new Float32Array(C);
  const cum = new Float32Array(C);
  const lineTone = new Float32Array(N);

  for (let r = 0; r < R; r++) {
    const iy = (r / (R - 1)) * (rows - 1);
    const y0 = Math.floor(iy);
    const y1 = Math.min(rows - 1, y0 + 1);
    const f = iy - y0;

    for (let c = 0; c < C; c++) {
      toneRow[c] = tone[y0 * C + c] * (1 - f) + tone[y1 * C + c] * f;
      toneRowD[c] = toneD[y0 * C + c] * (1 - f) + toneD[y1 * C + c] * f;
    }

    cum[0] = 0;
    for (let c = 1; c < C; c++) {
      const d0 = BASE_DENSITY + TONE_DENSITY * toneRowD[c - 1];
      const d1 = BASE_DENSITY + TONE_DENSITY * toneRowD[c];
      cum[c] = cum[c - 1] + (d0 + d1) / 2;
    }
    const total = cum[C - 1];

    let c = 0;
    for (let k = 0; k < N; k++) {
      const target = (total * k) / (N - 1);
      while (c < C - 2 && cum[c + 1] < target) c++;
      const seg = cum[c + 1] - cum[c];
      const u = seg > 1e-9 ? (target - cum[c]) / seg : 0;
      const xc = clamp(c + u, 0, C - 1);
      fx[k * R + r] = rect.x + (xc / (C - 1)) * rect.w;

      const ci = Math.floor(xc);
      const cj = Math.min(C - 1, ci + 1);
      lineTone[k] = toneRow[ci] * (1 - (xc - ci)) + toneRow[cj] * (xc - ci);
    }

    for (let k = 0; k < N; k++) {
      const kl = Math.max(k - 1, 0);
      const kr = Math.min(k + 1, N - 1);
      const pitch = (fx[kr * R + r] - fx[kl * R + r]) / Math.max(kr - kl, 1);
      fw[k * R + r] =
        0.8 +
        Math.max(0, pitch * WIDTH_FRACTION - 0.8) *
          Math.pow(lineTone[k], WIDTH_GAMMA);
    }
  }

  // smooth along each line so rows blend into continuous strokes
  const smooth = (arr: Float32Array) => {
    const tmp = new Float32Array(R);
    for (let pass = 0; pass < 2; pass++) {
      for (let k = 0; k < N; k++) {
        const o = k * R;
        for (let r = 0; r < R; r++) {
          const a = arr[o + Math.max(r - 1, 0)];
          const b = arr[o + r];
          const d = arr[o + Math.min(r + 1, R - 1)];
          tmp[r] = (a + 2 * b + d) / 4;
        }
        for (let r = 0; r < R; r++) arr[o + r] = tmp[r];
      }
    }
  };
  smooth(fx);
  smooth(fw);

  return { fx, fw };
}

type Spring = { x: number; v: number };

// Critically damped spring: no overshoot, always starts and ends smoothly.
// Returns true while it is still moving.
function stepSpring(s: Spring, target: number, k: number, dt: number) {
  const steps = Math.max(1, Math.ceil(dt / 0.008));
  const h = dt / steps;
  const c = 2 * Math.sqrt(k);
  for (let i = 0; i < steps; i++) {
    s.v += (k * (target - s.x) - c * s.v) * h;
    s.x += s.v * h;
  }
  if (Math.abs(target - s.x) < 4e-4 && Math.abs(s.v) < 2e-3) {
    s.x = target;
    s.v = 0;
    return false;
  }
  return true;
}

const spring = (x = 0): Spring => ({ x, v: 0 });

/* ────────────────────────────────────────────────────────────
   Small UI pieces
   ──────────────────────────────────────────────────────────── */

function Chevrons({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <span
      className="hero-chevs"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}
    >
      {[0, 1, 2].map((i) => (
        <svg key={i} width="7" height="13" viewBox="0 0 7 13" fill="none">
          <path
            d="M1.2 1.6 5.6 6.5l-4.4 4.9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

function ArrowsHorizontal() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 9h13M5.5 5.8 2.5 9l3 3.2M12.5 5.8 15.5 9l-3 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

export default function Hero({
  imageSources = IMAGE_SOURCES,
}: {
  imageSources?: string[];
}) {
  const [revealed, setRevealed] = useState(false);
  const [pressing, setPressing] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const kickRef = useRef<() => void>(() => {});

  // All animation state lives in one mutable object, so pointer movement
  // never triggers React renders.
  const S = useRef({
    W: 0,
    H: 0,
    dpr: 1,
    mobile: false,
    rect: { x: 0, y: 0, w: 1, h: 1 } as Rect,
    N: 160,
    R: 240,
    xs: new Float32Array(240),
    ys: new Float32Array(240),
    ws: new Float32Array(240),
    ctx: null as CanvasRenderingContext2D | null,
    img: null as HTMLImageElement | null,
    geo: null as Geo | null,

    // springs (all motion is spring-driven for a soft, continuous feel)
    sp: spring(0), // reveal progress 0..1
    sw: spring(0), // drag wave amplitude (px)
    sb: spring(0), // lens strength 0..1
    scx: spring(-9999), // smoothed cursor x
    scy: spring(-9999), // smoothed cursor y
    shx: spring(0), // handle x
    shy: spring(0), // handle y
    handleReady: false,

    target: 0 as 0 | 1,
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    dragP: 0,
    dragY: 0.5,
    wheelP: 0,
    lastWheel: 0,
    downOnInteractive: false,

    ptr: { x: -9999, y: -9999, active: false },

    revealed: false,
    fine: true,
    reduced: false,
    raf: 0,
    lastT: 0,
  }).current;

  const commit = useCallback(
    (t: 0 | 1) => {
      S.target = t;
      S.dragging = false;
      S.dragP = 0;
      S.wheelP = 0;
      setPressing(false);
      kickRef.current();
    },
    [S]
  );

  /* ── Engine: geometry, drawing, animation loop ── */
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    S.fine = window.matchMedia("(pointer: fine)").matches;
    S.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rebuild = () => {
      S.geo = buildGeometry(S.img, S.rect, S.N, S.R, THEME.mode);
      S.xs = new Float32Array(S.R);
      S.ys = new Float32Array(S.R);
      S.ws = new Float32Array(S.R);
      kick();
    };

    const measure = () => {
      const W = section.clientWidth;
      const H = section.clientHeight;
      if (!W || !H) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      S.W = W;
      S.H = H;
      S.dpr = dpr;
      S.mobile = W < 768;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      S.ctx = canvas.getContext("2d");

      S.rect = S.mobile
        ? { x: 0, y: 0, w: W, h: H * 0.56 }
        : { x: W * 0.46, y: 0, w: W * 0.54, h: H };
      S.N = clamp(Math.round(W / 8), 110, 240);
      S.R = clamp(Math.round(H / 2.6), 180, 380);
      rebuild();
    };

    const draw = (now: number) => {
      const ctx = S.ctx;
      const geo = S.geo;
      if (!ctx || !geo || !S.W) return;

      const { W, H, dpr, N, R, rect, xs, ys, ws } = S;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = THEME.ink;

      const p = S.sp.x;
      const eg = easeInOutCubic(p);
      const extent = lerp(H + 12, rect.h, eg);
      const top = lerp(-6, rect.y, eg);

      // lens: a true circle (same radius in x and y) that pushes threads away
      const lens = S.sb.x * (1 - 0.2 * eg);
      const lensOn = lens > 0.01 && S.scx.x > -5000;
      const cx = S.scx.x;
      const cy = S.scy.x;
      const LR = LENS_RADIUS;
      const LR2 = LR * LR;
      const push = LENS_PUSH * LR * lens;

      const amp = S.sw.x;
      const wy = S.dragY * H;
      const sway = S.reduced ? 0 : SWAY;

      ctx.beginPath();

      for (let k = 0; k < N; k++) {
        const u = k / (N - 1);
        const x0 = lerp(PAD, W - PAD, u);
        const pk = clamp((p - u * STAGGER) / (1 - STAGGER), 0, 1);
        const e = easeInOutCubic(pk);
        const ew = smoothstep(0.15, 0.9, pk);
        const free = 1 - e;
        const base = k * R;

        for (let r = 0; r < R; r++) {
          const y = top + (r / (R - 1)) * extent;
          let xi = x0;

          if (free > 0) {
            xi += Math.sin(now * 0.00065 + k * 0.37 + y * 0.006) * sway * free;

            if (amp > 0.1) {
              const g = (y - wy) / (H * 0.5);
              xi += amp * Math.exp(-g * g) * (1 - 0.6 * (x0 / W)) * free;
            }
          }

          xs[r] = xi + (geo.fx[base + r] - xi) * e;
          ys[r] = y;
          ws[r] = lerp(HAIR, geo.fw[base + r], ew);

          if (lensOn) {
            const dx = xs[r] - cx;
            const dy = y - cy;
            if (dx > -LR && dx < LR && dy > -LR && dy < LR) {
              const d2 = dx * dx + dy * dy;
              if (d2 < LR2 && d2 > 0.01) {
                const d = Math.sqrt(d2);
                const t = d / LR;
                const f = 1 - t * t;
                const m = push * t * f * f;
                xs[r] += (dx / d) * m;
                ys[r] += (dy / d) * m;
              }
            }
          }
        }

        // each thread is a filled ribbon: left edge down, right edge back up
        ctx.moveTo(xs[0] - ws[0] / 2, ys[0]);
        for (let r = 1; r < R; r++) ctx.lineTo(xs[r] - ws[r] / 2, ys[r]);
        for (let r = R - 1; r >= 0; r--) ctx.lineTo(xs[r] + ws[r] / 2, ys[r]);
        ctx.closePath();
      }

      ctx.fill();
    };

    // returns true while the handle is still travelling
    const updateHandle = (dt: number) => {
      const el = handleRef.current;
      if (!el || !S.W) return false;

      let tx: number;
      let ty: number;
      let following = false;

      if (!S.revealed) {
        tx = 26;
        ty = S.H * 0.35;
      } else if (S.fine && S.ptr.active) {
        tx = S.ptr.x;
        ty = S.ptr.y;
        following = true;
      } else {
        tx = S.W - 30;
        ty = S.H * 0.46;
      }

      if (!S.handleReady) {
        S.shx.x = tx;
        S.shy.x = ty;
        S.handleReady = true;
      }

      const k = S.reduced ? 900 : following ? 150 : 60;
      const mx = stepSpring(S.shx, tx, k, dt);
      const my = stepSpring(S.shy, ty, k, dt);

      el.style.transform = `translate3d(${S.shx.x - 22}px, ${S.shy.x - 22}px, 0)`;
      el.style.pointerEvents = following ? "none" : "auto";

      return mx || my;
    };

    const tick = (now: number) => {
      S.raf = 0;
      const dt = Math.min(0.05, (now - S.lastT) / 1000 || 0.016);
      S.lastT = now;

      // wheel accumulation fades if the gesture stops
      if (S.wheelP > 0 && now - S.lastWheel > 350) {
        S.wheelP *= Math.exp(-dt * 4);
        if (S.wheelP < 0.002) S.wheelP = 0;
      }

      // reveal progress
      const gesture = Math.max(S.dragP, S.wheelP) * 0.85;
      const desired = S.revealed || S.target === 1 ? S.target : gesture;
      const kP = S.reduced ? 900 : S.dragging ? 240 : 13;
      const movingP = stepSpring(S.sp, desired, kP, dt);
      S.sp.x = clamp(S.sp.x, 0, 1);

      // drag wave (the threads bow to the right while dragging)
      const waveTarget = S.target === 1 ? 0 : Math.min(S.dragP, 1) * S.W * 0.2;
      const movingW = stepSpring(S.sw, waveTarget, S.reduced ? 900 : 90, dt);

      // cursor + lens strength
      let movingC = false;
      if (S.ptr.active) {
        if (S.scx.x < -5000) {
          S.scx.x = S.ptr.x;
          S.scy.x = S.ptr.y;
        }
        const a = stepSpring(S.scx, S.ptr.x, 220, dt);
        const b = stepSpring(S.scy, S.ptr.y, 220, dt);
        movingC = a || b;
      }
      const lensTarget = S.ptr.active && !S.dragging && !S.reduced ? 1 : 0;
      const movingB = stepSpring(S.sb, lensTarget, 40, dt);

      // text reveal follows the morph
      if (!S.revealed && S.target === 1 && S.sp.x > 0.55) {
        S.revealed = true;
        setRevealed(true);
      } else if (S.revealed && S.target === 0) {
        S.revealed = false;
        setRevealed(false);
      }

      draw(now);
      const movingH = updateHandle(dt);

      const settled =
        S.revealed &&
        !movingP &&
        !movingW &&
        !movingC &&
        !movingB &&
        !movingH &&
        S.sb.x === 0;

      if (!settled) S.raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!S.raf) {
        S.lastT = performance.now();
        S.raf = requestAnimationFrame(tick);
      }
    };
    kickRef.current = kick;

    let resizeFrame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    });
    ro.observe(section);
    measure();

    let cancelled = false;
    loadFirstImage(imageSources).then((img) => {
      if (cancelled) return;
      S.img = img;
      rebuild();
    });

    // Non-passive wheel listener so preventDefault works (React's onWheel is passive).
    const onWheel = (event: WheelEvent) => {
      if (S.revealed || S.target === 1) return;
      event.preventDefault();

      const horizontal =
        Math.abs(event.deltaX) > 0
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (horizontal === 0) return;

      S.lastWheel = performance.now();
      S.wheelP = clamp(S.wheelP + horizontal / (S.W * REVEAL_DISTANCE * 2), 0, 1);
      if (S.wheelP >= 1) commit(1);
      else kick();
    };
    section.addEventListener("wheel", onWheel, { passive: false });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && S.revealed) commit(0);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      cancelAnimationFrame(S.raf);
      cancelAnimationFrame(resizeFrame);
      S.raf = 0;
      ro.disconnect();
      section.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [S, imageSources, commit]);

  /* ── Lock page scroll only during the intro ── */
  useEffect(() => {
    if (revealed) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [revealed]);

  /* ── Pointer handling ── */
  const track = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    S.ptr.x = event.clientX - rect.left;
    S.ptr.y = event.clientY - rect.top;
    S.ptr.active = event.pointerType !== "touch" || S.dragging;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    const interactive = !!(event.target as HTMLElement).closest("a, button");
    S.downOnInteractive = interactive;
    if (interactive) return;

    track(event);
    S.dragging = true;
    S.moved = false;
    S.startX = event.clientX;
    S.startY = event.clientY;

    if (!S.revealed) {
      const rect = event.currentTarget.getBoundingClientRect();
      S.dragY = (event.clientY - rect.top) / rect.height;
      setPressing(true);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* pointer capture is optional */
      }
    }
    kickRef.current();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    track(event);

    if (S.dragging) {
      const dx = event.clientX - S.startX;
      if (Math.abs(dx) > 6 || Math.abs(event.clientY - S.startY) > 6) {
        S.moved = true;
      }

      if (!S.revealed && S.target === 0) {
        const threshold = S.W * REVEAL_DISTANCE;
        S.dragP = clamp(dx / threshold, 0, 1);
        if (dx >= threshold) commit(1);
      } else if (S.revealed && dx < -90) {
        commit(0);
      }
    }
    kickRef.current();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const wasDragging = S.dragging;
    S.dragging = false;
    setPressing(false);

    if (wasDragging && !S.revealed && S.target === 0) {
      // release past 60% finishes the reveal, otherwise it springs back
      if (S.dragP >= 0.6) commit(1);
      else S.dragP = 0;
    } else if (wasDragging && S.revealed && !S.moved && !S.downOnInteractive) {
      // tap on the portrait goes back to the intro
      const rect = event.currentTarget.getBoundingClientRect();
      const onPortrait = !S.mobile && event.clientX - rect.left > S.rect.x;
      if (onPortrait) commit(0);
    }
    kickRef.current();
  };

  const onPointerLeave = () => {
    if (!S.dragging) S.ptr.active = false;
    kickRef.current();
  };

  const onHandleClick = () => commit(S.revealed ? 0 : 1);

  const cssVars = {
    "--hero-paper": THEME.paper,
    "--hero-ink": THEME.ink,
    "--hero-muted": THEME.muted,
    "--hero-accent": THEME.accent,
  } as CSSProperties;

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      className={`hero-intro relative isolate h-[100svh] min-h-[700px] w-full overflow-hidden md:min-h-[620px] ${
        revealed ? "is-revealed" : ""
      }`}
      style={{
        ...cssVars,
        backgroundColor: THEME.paper,
        touchAction: revealed ? "pan-y" : "none",
      }}
    >
      <style>{`
        .hero-intro {
          color: var(--hero-ink);
          contain: paint;
          cursor: ew-resize;
          user-select: none;
          -webkit-user-select: none;
          font-family: "Segoe UI Variable", "Segoe UI", "SF Pro Text", system-ui, -apple-system, sans-serif;
        }
        .hero-intro.is-revealed { cursor: default; user-select: auto; -webkit-user-select: auto; }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Handle (left edge in intro, cursor follower after reveal) ── */
        .hero-handle {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 30;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.07);
          background: rgba(255, 255, 255, 0.92);
          color: #2b2f36;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          cursor: pointer;
          will-change: transform;
          touch-action: none;
        }
        .hero-handle:focus-visible { outline: 2px solid var(--hero-ink); outline-offset: 3px; }
        .hero-handle-inner { display: grid; place-items: center; transition: transform 200ms ease; }
        .hero-handle:hover .hero-handle-inner { transform: scale(1.12); }
        .hero-handle:active .hero-handle-inner { transform: scale(0.94); }

        .hero-chevs { display: inline-flex; align-items: center; }
        .hero-chevs svg { margin-left: -2px; animation: chevPulse 1.8s ease-in-out infinite; }
        .hero-chevs svg:nth-child(2) { animation-delay: 150ms; }
        .hero-chevs svg:nth-child(3) { animation-delay: 300ms; }
        @keyframes chevPulse {
          0%, 100% { opacity: 0.35; }
          40% { opacity: 1; }
        }

        /* ── Hint pill ── */
        .hero-hint {
          position: absolute;
          left: 42%;
          bottom: 22px;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 6px;
          background: rgba(251, 251, 249, 0.94);
          font-size: 12px;
          color: var(--hero-muted);
          opacity: 1;
          transition: opacity 400ms ease;
        }
        .hero-hint button {
          all: unset;
          cursor: pointer;
          color: var(--hero-ink);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .hero-hint button:focus-visible { outline: 2px solid var(--hero-ink); outline-offset: 3px; border-radius: 2px; }
        .hero-intro.is-revealed .hero-hint { opacity: 0; pointer-events: none; }

        /* ── Copy ── */
        .hero-copy {
          position: absolute;
          z-index: 10;
          left: clamp(24px, 4.2vw, 72px);
          top: 0;
          bottom: 0;
          width: min(34vw, 470px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
          visibility: hidden;
          transition: visibility 0s linear 500ms;
          cursor: default;
        }
        .hero-intro.is-revealed .hero-copy { visibility: visible; transition-delay: 0s; }

        .hero-copy-line { opacity: 0; transform: translateY(10px); filter: blur(3px); }
        .hero-intro.is-revealed .hero-copy-line {
          animation: heroLineIn 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-intro.is-revealed .hero-copy-line:nth-child(1) { animation-delay: 80ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(2) { animation-delay: 170ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(3) { animation-delay: 260ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(4) { animation-delay: 350ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(5) { animation-delay: 440ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(6) { animation-delay: 530ms; }
        @keyframes heroLineIn {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .hero-kicker { font-size: 13px; color: var(--hero-muted); letter-spacing: 0.01em; }
        .hero-name {
          margin: 6px 0 0;
          font-weight: 700;
          font-size: clamp(2.3rem, 4.1vw, 3.7rem);
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: var(--hero-ink);
        }
        .hero-statement {
          margin: 0;
          font-size: clamp(1.05rem, 1.35vw, 1.3rem);
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: -0.01em;
          max-width: 30ch;
        }
        .hero-bio p {
          margin: 0 0 12px;
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--hero-muted);
          max-width: 46ch;
        }
        .hero-bio p:last-child { margin-bottom: 0; }

        .hero-skills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
        .hero-skills li {
          font-size: 12.5px;
          padding: 5px 11px;
          border: 1px solid rgba(21, 23, 28, 0.16);
          border-radius: 999px;
          color: var(--hero-ink);
          background: rgba(255, 255, 255, 0.6);
        }

        .hero-status { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--hero-muted); }
        .hero-status-dot {
          width: 8px; height: 8px; border-radius: 2px;
          background: var(--hero-accent);
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--hero-accent) 50%, transparent);
          animation: statusPulse 2.4s ease-out infinite;
        }
        @keyframes statusPulse {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--hero-accent) 45%, transparent); }
          70%, 100% { box-shadow: 0 0 0 7px transparent; }
        }

        .hero-links { display: flex; flex-wrap: wrap; align-items: center; gap: 0; font-size: 13.5px; }
        .hero-links a {
          color: var(--hero-ink);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
          transition: text-decoration-thickness 150ms ease, color 150ms ease;
        }
        .hero-links a:hover { text-decoration-thickness: 2px; }
        .hero-links a:focus-visible { outline: 2px solid var(--hero-ink); outline-offset: 3px; border-radius: 2px; }
        .hero-links span { margin: 0 11px; color: var(--hero-muted); opacity: 0.55; }

        /* ── Mobile: portrait on top, copy underneath ── */
        @media (max-width: 767px) {
          .hero-hint { left: 50%; transform: translateX(-50%); white-space: nowrap; }
          .hero-copy {
            left: 0; right: 0; top: auto; bottom: 0; width: auto;
            padding: 56px 24px 26px;
            gap: 14px;
            justify-content: flex-end;
            background: linear-gradient(to top, var(--hero-paper) 76%, transparent);
          }
          .hero-name { font-size: 2.1rem; }
          .hero-statement { font-size: 1rem; max-width: none; }
          .hero-bio p { font-size: 13.5px; line-height: 1.55; }
          .hero-bio p + p, .hero-skills { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-copy-line { filter: none; transform: none; }
          .hero-intro.is-revealed .hero-copy-line { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
          .hero-chevs svg, .hero-status-dot { animation: none !important; }
          .hero-hint, .hero-copy { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-hint">
        <span>Drag right</span>
        <Chevrons />
        <span>or</span>
        <button type="button" onClick={onHandleClick}>
          Click here
        </button>
      </div>

      <button
        ref={handleRef}
        type="button"
        onClick={onHandleClick}
        className="hero-handle"
        aria-label={
          revealed ? "Return to the line intro" : "Reveal the introduction"
        }
      >
        <span className="hero-handle-inner">
          {pressing && !revealed ? (
            <ArrowsHorizontal />
          ) : (
            <Chevrons dir={revealed ? "left" : "right"} />
          )}
        </span>
      </button>

      <div className="hero-copy">
        <div className="hero-copy-line">
          <p className="hero-kicker">{PROFILE.kicker}</p>
          <h1 className="hero-name font-poppins">{PROFILE.name}</h1>
        </div>

        <p className="hero-copy-line hero-statement">{PROFILE.statement}</p>

        <div className="hero-copy-line hero-bio">
          {PROFILE.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="hero-copy-line hero-skills">
          {PROFILE.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <div className="hero-copy-line hero-status">
          <span className="hero-status-dot" aria-hidden="true" />
          {PROFILE.status}
        </div>

        <nav className="hero-copy-line hero-links" aria-label="Profile links">
          {PROFILE.links.map((link, i) => (
            <span key={link.label} style={{ display: "contents" }}>
              {i > 0 && <span aria-hidden="true">|</span>}
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
