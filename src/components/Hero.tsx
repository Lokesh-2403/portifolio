import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

/* ────────────────────────────────────────────────────────────
   EDIT THIS BLOCK — content, photo, theme
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
    { label: "Resume",   href: "/resume.pdf" },
    { label: "Email",    href: "mailto:adusumalli3818@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/lokeshbabuadusumalli" },
    { label: "GitHub",   href: "https://github.com/Lokesh-2403" },
  ],
};

// Tries each source in order — first one that loads wins.
const IMAGE_SOURCES = [
  "/profile_cutout.png",   // ← your actual filename (underscore)
  "/profile-cutout.png",
  "/profile.jpg",
  "/profile.png",
  "/profile.jpeg",
  "/profile.webp",
];

const THEME = {
  mode: "light" as "light" | "dark",
  paper: "#f8f8f6",
  ink:   "#1a1c22",
  muted: "#5a5f69",
  accent:"#2e9d4f",
};

/* ────────────────────────────────────────────────────────────
   Portrait framing
   ──────────────────────────────────────────────────────────── */

// Use the isolated subject at native scale; the background is already removed.
// This keeps the full head and shoulders in the thread morph.
const ZOOM  = 1.0;

// Focus within the photo. x=0.5 → centred horizontally.
// y=0.18 keeps head+shoulders in frame (raise toward 0.25 if top clips).
const FOCUS = { x: 0.5, y: 0.18 };

/* ────────────────────────────────────────────────────────────
   Thread tuning — UNIFORM SPACING + WIDTH PORTRAIT
   ──────────────────────────────────────────────────────────── */

const REVEAL_DISTANCE = 0.38;
const STAGGER = 0.3;
const PAD  = 6;
const SWAY = 2.0;

// HAIR: minimum thread width during the free-sway intro phase.
// Lower = thinner threads while swaying (more elegant intro).
const HAIR = 0.7;

// ─── CRITICAL PARAMETERS ─────────────────────────────────────
//
// BASE high + TONE low  → nearly equal gaps between every thread.
// Portrait clarity comes ONLY from WIDTH variation:
//   bright areas (skin, bg)  → very thin threads
//   dark areas (hair, suit)  → thick threads
//
const BASE_DENSITY   = 0.65;   // high  → uniform spacing, no wide white patches
const TONE_DENSITY   = 0.28;   // low   → spacing barely changes with tone
const WIDTH_FRACTION = 0.98;   // high  → big width swing from thin to thick
const WIDTH_GAMMA    = 0.60;   // <1.0  → gradual, smooth tonal response
const DETAIL         = 1.45;   // aggressive unsharp-mask → crisp eyes/lips/hair edges

// Limit expensive canvas drawing while the intro lines are moving.
const FRAME_INTERVAL = 1000 / 60;

// Intro-only cursor lens. The lens is disabled completely after reveal.
const LENS_RADIUS = 105;
const LENS_PUSH = 0.95;

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number };
type Geo  = { fx: Float32Array; fw: Float32Array };

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function blurAxis(
  src: Float32Array, w: number, h: number, r: number, horiz: boolean
) {
  if (r <= 0) return src;
  const out   = new Float32Array(src.length);
  const len   = horiz ? w : h;
  const lines = horiz ? h : w;
  const sz    = r * 2 + 1;
  for (let l = 0; l < lines; l++) {
    const at = (i: number) => horiz ? l * w + i : i * w + l;
    let sum = 0;
    for (let k = -r; k <= r; k++) sum += src[at(clamp(k, 0, len - 1))];
    for (let i = 0; i < len; i++) {
      out[at(i)] = sum / sz;
      sum += src[at(Math.min(i + r + 1, len - 1))]
           - src[at(Math.max(i - r,     0         ))];
    }
  }
  return out;
}

function blur(
  src: Float32Array, w: number, h: number,
  rx: number, ry: number, passes = 1
) {
  let o = src;
  for (let i = 0; i < passes; i++)
    o = blurAxis(blurAxis(o, w, h, rx, true), w, h, ry, false);
  return o;
}

function loadFirstImage(sources: string[]) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    let i = 0;
    const next = () => {
      if (i >= sources.length) { resolve(null); return; }
      const img = new Image();
      img.decoding = "async";
      img.onload  = () => resolve(img);
      img.onerror = () => { i++; next(); };
      img.src = sources[i];
    };
    next();
  });
}

/* ────────────────────────────────────────────────────────────
   Portrait geometry  (runs once per resize / image load)
   ──────────────────────────────────────────────────────────── */

function buildGeometry(
  img: HTMLImageElement | null,
  rect: Rect, N: number, R: number,
  mode: "light" | "dark"
): Geo {
  // High internal resolution → finer facial detail captured
  const C    = 480;
  const rows = Math.max(2, Math.round((C * rect.h) / rect.w));

  let tone : Float32Array = new Float32Array(C * rows);
  let toneD: Float32Array = new Float32Array(C * rows);

  if (img && img.naturalWidth > 0) {
    const off = document.createElement("canvas");
    off.width = C; off.height = rows;
    const ctx = off.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      ctx.fillStyle = mode === "light" ? "#fff" : "#000";
      ctx.fillRect(0, 0, C, rows);

      const s  = Math.max(C / img.naturalWidth, rows / img.naturalHeight) * ZOOM;
      const dw = img.naturalWidth  * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (C - dw) * FOCUS.x, (rows - dh) * FOCUS.y, dw, dh);

      const data = ctx.getImageData(0, 0, C, rows).data;
      const lum  = new Float32Array(C * rows);
      for (let i = 0; i < lum.length; i++)
        lum[i] = (0.2126 * data[i * 4]
                + 0.7152 * data[i * 4 + 1]
                + 0.0722 * data[i * 4 + 2]) / 255;

      // 1%–99% percentile clip → maximum tonal range preserved
      const sorted = Float32Array.from(lum).sort();
      const lo = sorted[Math.floor(sorted.length * 0.01)];
      const hi = sorted[Math.floor(sorted.length * 0.99)];
      const sp = Math.max(hi - lo, 0.05);
      for (let i = 0; i < lum.length; i++) {
        const t = clamp((lum[i] - lo) / sp, 0, 1);
        tone[i] = mode === "light" ? 1 - t : t;
      }

      // Unsharp mask: small radius → sharp edges survive
      const soft = blur(tone, C, rows, 3, 3);
      for (let i = 0; i < tone.length; i++)
        tone[i] = clamp(tone[i] + DETAIL * (tone[i] - soft[i]), 0, 1);

      // Very light final smooth to kill pixel noise
      tone  = blur(tone, C, rows, 1, 1);
      // Density map (used only for small spacing variation)
      toneD = blur(tone, C, rows, 2, 4, 2);
    }
  }

  const fx = new Float32Array(N * R);
  const fw = new Float32Array(N * R);
  const tRow  = new Float32Array(C);
  const tRowD = new Float32Array(C);
  const cum   = new Float32Array(C);
  const lt    = new Float32Array(N);   // per-thread luminance

  for (let r = 0; r < R; r++) {
    // Bilinear interpolation of tone at this row
    const iy = (r / (R - 1)) * (rows - 1);
    const y0 = Math.floor(iy);
    const y1 = Math.min(rows - 1, y0 + 1);
    const f  = iy - y0;
    for (let c = 0; c < C; c++) {
      tRow [c] = tone [y0 * C + c] * (1 - f) + tone [y1 * C + c] * f;
      tRowD[c] = toneD[y0 * C + c] * (1 - f) + toneD[y1 * C + c] * f;
    }

    // Cumulative density (nearly uniform because TONE_DENSITY is very low)
    cum[0] = 0;
    for (let c = 1; c < C; c++) {
      const d0 = BASE_DENSITY + TONE_DENSITY * tRowD[c - 1];
      const d1 = BASE_DENSITY + TONE_DENSITY * tRowD[c];
      cum[c] = cum[c - 1] + (d0 + d1) * 0.5;
    }

    const total = cum[C - 1];
    let col = 0;
    for (let k = 0; k < N; k++) {
      const target = (total * k) / (N - 1);
      while (col < C - 2 && cum[col + 1] < target) col++;
      const seg = cum[col + 1] - cum[col];
      const u   = seg > 1e-9 ? (target - cum[col]) / seg : 0;
      const xc  = clamp(col + u, 0, C - 1);
      fx[k * R + r] = rect.x + (xc / (C - 1)) * rect.w;
      const ci = Math.floor(xc);
      const cj = Math.min(C - 1, ci + 1);
      lt[k] = tRow[ci] * (1 - (xc - ci)) + tRow[cj] * (xc - ci);
    }

    // Thread width: uniform pitch × tonal value → width portrait
    for (let k = 0; k < N; k++) {
      const kl    = Math.max(k - 1, 0);
      const kr    = Math.min(k + 1, N - 1);
      // pitch = pixels between neighbouring threads (nearly constant)
      const pitch = (fx[kr * R + r] - fx[kl * R + r]) / Math.max(kr - kl, 1);
      // lt[k]=1 → dark area → thick; lt[k]=0 → bright area → thin (≈0.8px)
      fw[k * R + r] = 0.8
        + Math.max(0, pitch * WIDTH_FRACTION - 0.8)
        * Math.pow(lt[k], WIDTH_GAMMA);
    }
  }

  // One smoothing pass along each thread — removes jitter, keeps sharpness
  const tmp = new Float32Array(R);
  const smooth = (arr: Float32Array) => {
    for (let k = 0; k < N; k++) {
      const o = k * R;
      for (let r = 0; r < R; r++) {
        tmp[r] = (arr[o + Math.max(r - 1, 0)]
                + arr[o + r] * 2
                + arr[o + Math.min(r + 1, R - 1)]) / 4;
      }
      for (let r = 0; r < R; r++) arr[o + r] = tmp[r];
    }
  };
  smooth(fx);
  smooth(fw);

  return { fx, fw };
}

/* ────────────────────────────────────────────────────────────
   Spring physics
   ──────────────────────────────────────────────────────────── */

type Spring = { x: number; v: number };

function stepSpring(s: Spring, target: number, k: number, dt: number) {
  const steps = Math.max(1, Math.ceil(dt / 0.008));
  const h = dt / steps;
  const c = 2 * Math.sqrt(k);
  for (let i = 0; i < steps; i++) {
    s.v += (k * (target - s.x) - c * s.v) * h;
    s.x += s.v * h;
  }
  if (Math.abs(target - s.x) < 4e-4 && Math.abs(s.v) < 2e-3) {
    s.x = target; s.v = 0; return false;
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
          <path d="M1.2 1.6 5.6 6.5l-4.4 4.9"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

function ArrowsHorizontal() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2.5 9h13M5.5 5.8 2.5 9l3 3.2M12.5 5.8 15.5 9l-3 3.2"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────────────── */

export default function Hero({
  imageSources = IMAGE_SOURCES,
}: { imageSources?: string[] }) {

  const [revealed, setRevealed] = useState(false);
  const [pressing, setPressing] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const handleRef  = useRef<HTMLButtonElement | null>(null);
  const kickRef    = useRef<() => void>(() => {});

  const S = useRef({
    W: 0, H: 0, dpr: 1, mobile: false,
    rect: { x: 0, y: 0, w: 1, h: 1 } as Rect,
    N: 160, R: 240,
    xs: new Float32Array(240), ys: new Float32Array(240), ws: new Float32Array(240),
    ctx: null as CanvasRenderingContext2D | null,
    img: null as HTMLImageElement | null,
    geo: null as Geo | null,

    // Animation springs
    sp:  spring(0),   // reveal progress 0→1
    sw:  spring(0),   // drag-wave amplitude
    sb:  spring(0),   // intro cursor-lens strength
    scx: spring(-9999), // immediate cursor x (no spring lag)
    scy: spring(-9999), // immediate cursor y (no spring lag)
    shx: spring(0),   // handle x
    shy: spring(0),   // handle y
    handleReady: false,
    fine: true,
    ptr: { x: -9999, y: -9999, active: false },

    target: 0 as 0 | 1,
    dragging: false, moved: false,
    startX: 0, startY: 0,
    dragP: 0, dragY: 0.5,
    wheelP: 0, lastWheel: 0,
    downOnInteractive: false,

    revealed: false,
    reduced: false,
    raf: 0, lastT: 0,
  }).current;

  const commit = useCallback((t: 0 | 1) => {
    S.target   = t;
    S.dragging = false;
    S.dragP    = 0;
    S.wheelP   = 0;
    setPressing(false);
    kickRef.current();
  }, [S]);

  /* ── Engine ── */
  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    S.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    S.fine = window.matchMedia("(pointer: fine)").matches;

    const rebuild = () => {
      S.geo = buildGeometry(S.img, S.rect, S.N, S.R, THEME.mode);
      S.xs  = new Float32Array(S.R);
      S.ys  = new Float32Array(S.R);
      S.ws  = new Float32Array(S.R);
      kick();
    };

    const measure = () => {
      const W = section.clientWidth;
      const H = section.clientHeight;
      if (!W || !H) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      S.W = W; S.H = H; S.dpr = dpr;
      S.mobile = W < 768;

      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      S.ctx = canvas.getContext("2d");

      S.rect = S.mobile
        ? { x: 0, y: 0, w: W, h: H * 0.56 }
        : { x: W * 0.46, y: 0, w: W * 0.54, h: H };

      // More threads (W/7) → finer portrait resolution
      // Fewer threads look cleaner during the sway intro
      S.N = clamp(Math.round(W / 7), 130, 220);
      // Slightly fewer vertical samples + 40 FPS balance portrait detail and cursor responsiveness.
      S.R = clamp(Math.round(H / 4.4), 140, 220);

      rebuild();
    };

    /* ── Draw frame ── */
    const draw = (now: number) => {
      const ctx = S.ctx;
      const geo = S.geo;
      if (!ctx || !geo || !S.W) return;

      const { W, H, dpr, N, R, rect, xs, ys, ws } = S;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = THEME.ink;

      const p      = S.sp.x;
      const eg     = easeInOutCubic(p);
      const extent = lerp(H + 12, rect.h, eg);
      const top    = lerp(-6, rect.y, eg);

      const amp  = S.sw.x;
      const wy   = S.dragY * H;
      const sway = S.reduced ? 0 : SWAY;

      // The cursor sphere exists only in the intro. Once revealed, its
      // strength is zero and the completed portrait remains undistorted.
      const lens = S.revealed ? 0 : S.sb.x * (1 - 0.2 * eg);
      const lensOn = lens > 0.01 && S.ptr.active && S.scx.x > -5000;
      const cx = S.scx.x;
      const cy = S.scy.x;
      const radius = LENS_RADIUS;
      const radius2 = radius * radius;
      const lensPush = LENS_PUSH * radius * lens;

      ctx.beginPath();

      for (let k = 0; k < N; k++) {
        const u    = k / (N - 1);
        const x0   = lerp(PAD, W - PAD, u);
        const pk   = clamp((p - u * STAGGER) / (1 - STAGGER), 0, 1);
        const e    = easeInOutCubic(pk);
        const ew   = smoothstep(0.15, 0.9, pk);
        const free = 1 - e;
        const base = k * R;

        for (let r = 0; r < R; r++) {
          const y = top + (r / (R - 1)) * extent;
          let xi = x0;

          if (free > 0) {
            // Gentle sway in intro state
            xi += Math.sin(now * 0.00055 + k * 0.38 + y * 0.005) * sway * free;
            // Drag wave
            if (amp > 0.1) {
              const g = (y - wy) / (H * 0.5);
              xi += amp * Math.exp(-g * g) * (1 - 0.6 * (x0 / W)) * free;
            }
          }

          let px = xi + (geo.fx[base + r] - xi) * e;
          let py = y;

          // Radially displace the threads around the cursor to create the
          // spherical bump. Cursor coordinates are direct, not spring-lagged.
          if (lensOn) {
            const dx = px - cx;
            const dy = py - cy;
            if (dx > -radius && dx < radius && dy > -radius && dy < radius) {
              const d2 = dx * dx + dy * dy;
              if (d2 < radius2 && d2 > 0.01) {
                const d = Math.sqrt(d2);
                const t = d / radius;
                const falloff = 1 - t * t;
                const move = lensPush * t * falloff * falloff;
                px += (dx / d) * move;
                py += (dy / d) * move;
              }
            }
          }

          xs[r] = px;
          ys[r] = py;
          ws[r] = lerp(HAIR, geo.fw[base + r], ew);
        }

        ctx.moveTo(xs[0] - ws[0] / 2, ys[0]);
        for (let r = 1; r < R; r++) ctx.lineTo(xs[r] - ws[r] / 2, ys[r]);
        for (let r = R - 1; r >= 0; r--) ctx.lineTo(xs[r] + ws[r] / 2, ys[r]);
        ctx.closePath();
      }

      ctx.fill();
    };

    /* ── Handle position ── */
    const updateHandle = (dt: number) => {
      const el = handleRef.current;
      if (!el || !S.W) return false;
      const tx = 26;
      const ty = S.H * 0.35;
      if (!S.handleReady) { S.shx.x = tx; S.shy.x = ty; S.handleReady = true; }
      const k  = S.reduced ? 900 : 60;
      const mx = stepSpring(S.shx, tx, k, dt);
      const my = stepSpring(S.shy, ty, k, dt);
      el.style.transform = `translate3d(${S.shx.x - 22}px,${S.shy.x - 22}px,0)`;
      return mx || my;
    };

    /* ── Tick ── */
    let lastPaintAt = 0;
    const tick = (now: number) => {
      S.raf = 0;

      // The intro is a dense canvas effect. Draw at a responsive 40 FPS
      // while using fewer vertical samples to keep pointer movement smooth.
      if (lastPaintAt !== 0 && now - lastPaintAt < FRAME_INTERVAL) {
        S.raf = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, (now - S.lastT) / 1000 || 0.016);
      S.lastT = now;
      lastPaintAt = now;

      // Wheel decay
      if (S.wheelP > 0 && now - S.lastWheel > 350) {
        S.wheelP *= Math.exp(-dt * 4);
        if (S.wheelP < 0.002) S.wheelP = 0;
      }

      // Reveal progress
      const gesture = Math.max(S.dragP, S.wheelP) * 0.85;
      const desired = S.revealed || S.target === 1 ? S.target : gesture;
      const kP      = S.reduced ? 900 : S.dragging ? 240 : 14;
      const movingP = stepSpring(S.sp, desired, kP, dt);
      S.sp.x = clamp(S.sp.x, 0, 1);

      // Wave
      const waveTarget = S.target === 1 ? 0 : Math.min(S.dragP, 1) * S.W * 0.18;
      const movingW    = stepSpring(S.sw, waveTarget, S.reduced ? 900 : 90, dt);

      // Fade the intro-only sphere smoothly on hover. It can never activate
      // once the right-side portrait has been revealed.
      const lensTarget = !S.revealed && S.ptr.active && !S.dragging && !S.reduced ? 1 : 0;
      const movingLens = stepSpring(S.sb, lensTarget, 48, dt);

      // Reveal the text while the lines finish their morph.
      if (!S.revealed && S.target === 1 && S.sp.x > 0.55) {
        S.revealed = true;
        S.ptr.active = false;
        S.sb.x = 0;
        S.sb.v = 0;
        setRevealed(true);
      } else if (S.revealed && S.target === 0) {
        S.revealed = false;
        setRevealed(false);
      }

      draw(now);
      const movingH = updateHandle(dt);

      const settled = S.revealed && !movingP && !movingW && !movingH && !movingLens;
      if (!settled) S.raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!S.raf) { S.lastT = performance.now(); S.raf = requestAnimationFrame(tick); }
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

    // Horizontal scroll to reveal
    const onWheel = (ev: WheelEvent) => {
      if (S.revealed || S.target === 1) return;
      ev.preventDefault();
      const dx = Math.abs(ev.deltaX) > 0 ? ev.deltaX : ev.shiftKey ? ev.deltaY : 0;
      if (dx === 0) return;
      S.lastWheel = performance.now();
      S.wheelP = clamp(S.wheelP + dx / (S.W * REVEAL_DISTANCE * 2), 0, 1);
      if (S.wheelP >= 1) commit(1); else kick();
    };
    section.addEventListener("wheel", onWheel, { passive: false });

    // Escape to go back
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && S.revealed) commit(0);
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

  /* ── Lock scroll during intro ── */
  useEffect(() => {
    if (revealed) return;
    const html = document.documentElement;
    const body = document.body;
    const ph = html.style.overflow; const pb = body.style.overflow;
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    return () => { html.style.overflow = ph; body.style.overflow = pb; };
  }, [revealed]);

  /* ── Pointer events ── */
  const onPointerDown = (ev: ReactPointerEvent<HTMLElement>) => {
    if (ev.button !== 0) return;
    const interactive = !!(ev.target as HTMLElement).closest("a, button");
    S.downOnInteractive = interactive;
    if (interactive) return;

    if (!S.revealed && S.fine && ev.pointerType !== "touch") {
      const rect = ev.currentTarget.getBoundingClientRect();
      S.ptr.x = ev.clientX - rect.left;
      S.ptr.y = ev.clientY - rect.top;
      S.scx.x = S.ptr.x;
      S.scy.x = S.ptr.y;
      S.ptr.active = true;
    }

    S.dragging = true; S.moved = false;
    S.startX = ev.clientX; S.startY = ev.clientY;

    if (!S.revealed) {
      const rect = ev.currentTarget.getBoundingClientRect();
      S.dragY = (ev.clientY - rect.top) / rect.height;
      setPressing(true);
      try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch { /* ok */ }
    }
    kickRef.current();
  };

  const onPointerMove = (ev: ReactPointerEvent<HTMLElement>) => {
    // Keep the lens centered exactly under the mouse: no spring lag.
    // Do not restart canvas work for hover movement after reveal.
    if (!S.revealed && S.fine && ev.pointerType !== "touch") {
      const rect = ev.currentTarget.getBoundingClientRect();
      S.ptr.x = ev.clientX - rect.left;
      S.ptr.y = ev.clientY - rect.top;
      S.ptr.active = true;
      S.scx.x = S.ptr.x;
      S.scy.x = S.ptr.y;
      kickRef.current();
    }

    if (S.dragging) {
      const dx = ev.clientX - S.startX;
      const dy = ev.clientY - S.startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) S.moved = true;

      if (!S.revealed && S.target === 0) {
        S.dragP = clamp(dx / (S.W * REVEAL_DISTANCE), 0, 1);
        if (dx >= S.W * REVEAL_DISTANCE) commit(1);
        else kickRef.current();
      } else if (S.revealed && dx < -90) {
        commit(0);
      }
    }
  };

  const onPointerLeave = () => {
    S.ptr.active = false;
    if (!S.revealed) kickRef.current();
  };

  const onPointerUp = (ev: ReactPointerEvent<HTMLElement>) => {
    const wasDragging = S.dragging;
    S.dragging = false; setPressing(false);

    if (wasDragging && !S.revealed && S.target === 0) {
      if (S.dragP >= 0.6) commit(1); else { S.dragP = 0; kickRef.current(); }
    } else if (wasDragging && S.revealed && !S.moved && !S.downOnInteractive) {
      const rect      = ev.currentTarget.getBoundingClientRect();
      const onPortrait = !S.mobile && ev.clientX - rect.left > S.rect.x;
      if (onPortrait) commit(0);
    }
  };

  const onHandleClick = () => commit(S.revealed ? 0 : 1);

  const cssVars = {
    "--hero-paper":  THEME.paper,
    "--hero-ink":    THEME.ink,
    "--hero-muted":  THEME.muted,
    "--hero-accent": THEME.accent,
  } as CSSProperties;

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`hero-intro${revealed ? " is-revealed" : ""}`}
      style={{ ...cssVars, backgroundColor: THEME.paper, touchAction: revealed ? "pan-y" : "none" }}
    >
      <style>{`
        .hero-intro {
          position: relative;
          isolation: isolate;
          width: 100%;
          height: 100svh;
          min-height: 700px;
          overflow: hidden;
          color: var(--hero-ink);
          contain: paint;
          cursor: ew-resize;
          user-select: none;
          -webkit-user-select: none;
          font-family: "Segoe UI Variable","Segoe UI","SF Pro Text",system-ui,-apple-system,sans-serif;
        }
        @media (min-width:768px){ .hero-intro{ min-height:620px; } }
        .hero-intro.is-revealed {
          cursor: default;
          user-select: auto;
          -webkit-user-select: auto;
        }

        /* Canvas */
        .hero-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          z-index: 0; pointer-events: none;
          opacity: 1;
        }

        /* ── Floating arrow handle ── */
        .hero-handle {
          position: absolute; left: 0; top: 0; z-index: 30;
          width: 44px; height: 44px;
          display: grid; place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.94);
          color: #2b2f36;
          box-shadow: 0 4px 18px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer; will-change: transform; touch-action: none;
          transition: opacity 250ms ease, visibility 250ms ease;
        }
        .hero-handle:focus-visible { outline: 2px solid var(--hero-ink); outline-offset: 3px; }
        .hero-handle-inner { display:grid; place-items:center; transition:transform 180ms ease; }
        .hero-handle:hover  .hero-handle-inner { transform: scale(1.13); }
        .hero-handle:active .hero-handle-inner { transform: scale(0.93); }
        .hero-intro.is-revealed .hero-handle { opacity:0; visibility:hidden; pointer-events:none; }

        /* Chevron pulse */
        .hero-chevs { display:inline-flex; align-items:center; }
        .hero-chevs svg { margin-left:-2px; animation:chevPulse 1.9s ease-in-out infinite; }
        .hero-chevs svg:nth-child(2){ animation-delay:140ms; }
        .hero-chevs svg:nth-child(3){ animation-delay:280ms; }
        @keyframes chevPulse{ 0%,100%{opacity:0.3} 45%{opacity:1} }

        /* Hint bar */
        .hero-hint {
          position: absolute; left: 42%; bottom: 24px; z-index: 20;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 14px; border-radius: 8px;
          background: rgba(248,248,246,0.95);
          font-size: 12px; color: var(--hero-muted);
          opacity: 1; transition: opacity 400ms ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .hero-hint button {
          all:unset; cursor:pointer; color:var(--hero-ink);
          text-decoration:underline; text-underline-offset:3px;
          text-decoration-thickness:1px;
        }
        .hero-hint button:focus-visible{ outline:2px solid var(--hero-ink); outline-offset:3px; border-radius:2px; }
        .hero-intro.is-revealed .hero-hint { opacity:0; pointer-events:none; }

        /* ── Left copy panel ── */
        .hero-copy {
          position: absolute; z-index: 10;
          left: clamp(24px,4.5vw,80px);
          top: 0; bottom: 0;
          width: min(34vw,460px);
          display: flex; flex-direction: column;
          justify-content: center; gap: 20px;
          visibility: hidden;
          transition: visibility 0s linear 450ms;
          cursor: default;
        }
        .hero-intro.is-revealed .hero-copy { visibility:visible; transition-delay:0s; }

        .hero-copy-line {
          opacity: 0; transform: translateY(12px); filter: blur(4px);
        }
        .hero-intro.is-revealed .hero-copy-line {
          animation: lineReveal 700ms cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .hero-intro.is-revealed .hero-copy-line:nth-child(1){ animation-delay: 60ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(2){ animation-delay:150ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(3){ animation-delay:240ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(4){ animation-delay:330ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(5){ animation-delay:420ms; }
        .hero-intro.is-revealed .hero-copy-line:nth-child(6){ animation-delay:510ms; }
        @keyframes lineReveal{ to{ opacity:1; transform:translateY(0); filter:blur(0); } }

        /* Typography */
        .hero-kicker { font-size:12.5px; color:var(--hero-muted); letter-spacing:0.06em; text-transform:uppercase; }
        .hero-name {
          margin: 5px 0 0; font-weight:700;
          font-size: clamp(2.2rem,4vw,3.6rem);
          line-height:1.04; letter-spacing:-0.025em;
          color: var(--hero-ink);
        }
        .hero-statement {
          margin:0; font-size:clamp(1rem,1.3vw,1.25rem);
          font-weight:500; line-height:1.42;
          letter-spacing:-0.01em; max-width:30ch;
        }
        .hero-bio p { margin:0 0 11px; font-size:14px; line-height:1.68; color:var(--hero-muted); max-width:46ch; }
        .hero-bio p:last-child{ margin-bottom:0; }
        .hero-skills { display:flex; flex-wrap:wrap; gap:7px; margin:0; padding:0; list-style:none; }
        .hero-skills li {
          font-size:12px; padding:5px 12px;
          border:1px solid rgba(26,28,34,0.15); border-radius:999px;
          color:var(--hero-ink); background:rgba(255,255,255,0.7);
          letter-spacing:0.01em;
        }
        .hero-status { display:flex; align-items:center; gap:9px; font-size:13px; color:var(--hero-muted); }
        .hero-status-dot {
          width:8px; height:8px; border-radius:2px;
          background:var(--hero-accent);
          animation:statusPulse 2.4s ease-out infinite;
        }
        @keyframes statusPulse{
          0%      { box-shadow:0 0 0 0   color-mix(in srgb,var(--hero-accent) 40%,transparent); }
          70%,100%{ box-shadow:0 0 0 7px transparent; }
        }
        .hero-links { display:flex; flex-wrap:wrap; align-items:center; font-size:13.5px; }
        .hero-links a {
          color:var(--hero-ink); text-decoration:underline;
          text-underline-offset:4px; text-decoration-thickness:1px;
          transition:text-decoration-thickness 140ms ease;
        }
        .hero-links a:hover{ text-decoration-thickness:2px; }
        .hero-links a:focus-visible{ outline:2px solid var(--hero-ink); outline-offset:3px; border-radius:2px; }
        .hero-links span{ margin:0 10px; color:var(--hero-muted); opacity:0.5; }

        /* Mobile */
        @media(max-width:767px){
          .hero-hint{ left:50%; transform:translateX(-50%); white-space:nowrap; }
          .hero-copy{
            left:0; right:0; top:auto; bottom:0; width:auto;
            padding:52px 22px 24px; gap:13px; justify-content:flex-end;
            background:linear-gradient(to top,var(--hero-paper) 72%,transparent);
          }
          .hero-name{ font-size:2rem; }
          .hero-statement{ font-size:0.97rem; max-width:none; }
          .hero-bio p{ font-size:13px; line-height:1.55; }
          .hero-bio p+p,.hero-skills{ display:none; }
        }

        /* Reduced motion */
        @media(prefers-reduced-motion:reduce){
          .hero-copy-line{ filter:none; transform:none; }
          .hero-intro.is-revealed .hero-copy-line{ animation-duration:0.01ms!important; animation-delay:0ms!important; }
          .hero-chevs svg,.hero-status-dot{ animation:none!important; }
          .hero-hint,.hero-copy,.hero-handle{ transition-duration:0.01ms!important; }
        }
      `}</style>

      {/* Animated threads during intro */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      {/* Hint bar */}
      <div className="hero-hint">
        <span>Drag right</span>
        <Chevrons />
        <span>or</span>
        <button type="button" onClick={onHandleClick}>tap here</button>
      </div>

      {/* Floating arrow handle */}
      <button
        ref={handleRef}
        type="button"
        onClick={onHandleClick}
        className="hero-handle"
        aria-label={revealed ? "Return to the thread intro" : "Reveal the portrait"}
      >
        <span className="hero-handle-inner">
          {pressing && !revealed
            ? <ArrowsHorizontal />
            : <Chevrons dir={revealed ? "left" : "right"} />
          }
        </span>
      </button>

      {/* Left text content */}
      <div className="hero-copy">
        <div className="hero-copy-line">
          <p className="hero-kicker">{PROFILE.kicker}</p>
          <h1 className="hero-name">{PROFILE.name}</h1>
        </div>

        <p className="hero-copy-line hero-statement">{PROFILE.statement}</p>

        <div className="hero-copy-line hero-bio">
          {PROFILE.bio.map((p) => <p key={p}>{p}</p>)}
        </div>

        <ul className="hero-copy-line hero-skills">
          {PROFILE.skills.map((s) => <li key={s}>{s}</li>)}
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
