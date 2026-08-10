'use client';

import { useEffect, useRef } from 'react';

/* ============================================================================
 * ARTWORK — generative canvas compositions.
 *
 * The style reference carries its emotion through imagery. Rather than ship
 * stock photography (licence-encumbered, and generic), each piece is drawn
 * procedurally from a seed: no binary assets, no network requests, and every
 * project gets a distinct image that is stable across reloads and deploys.
 *
 * The four modes are drawn from the visual language of engineering rather than
 * from abstract-art defaults — a contour survey, a flow field, a network
 * lattice, an orbital trace. They read as instruments, which is the point on
 * an infrastructure portfolio.
 *
 * Everything renders once, on mount. There is no animation loop, so a page
 * with several of these costs nothing after paint.
 *
 * To use a real screenshot instead, set `image: '/work/name.png'` on the work
 * item in src/content/site.ts — the row then ignores `art` entirely.
 * ==========================================================================*/

export type ArtVariant = 'contour' | 'flow' | 'lattice' | 'orbit';

/* --- Deterministic randomness ------------------------------------------- */

/** mulberry32 — small, fast, and stable for a given seed. */
function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn an arbitrary string (a project title) into a stable numeric seed. */
function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Classic Perlin noise, permutation table shuffled from the seeded RNG. */
function makeNoise(rand: () => number) {
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (h: number, x: number, y: number) =>
    (h & 1 ? x : -x) + (h & 2 ? y : -y);

  return (x: number, y: number) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = p[p[xi] + yi];
    const ab = p[p[xi] + yi + 1];
    const ba = p[p[xi + 1] + yi];
    const bb = p[p[xi + 1] + yi + 1];
    return lerp(
      lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v,
    );
  };
}

/** Fractal Brownian motion — layered noise, each octave finer and fainter. */
function fbm(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves = 5,
) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise(x * frequency, y * frequency);
    frequency *= 2;
    amplitude *= 0.5;
  }
  return value;
}

/* --- Palette -------------------------------------------------------------
 * Kept in sync with the design tokens by hand: these are canvas draw calls,
 * which cannot read CSS custom properties without a layout round-trip.
 * ------------------------------------------------------------------------ */
const INK_GROUND = '#05070c';
const TWILIGHT = '66, 97, 136'; // --color-twilight-blue
const SIGNAL = '43, 127, 255'; // --color-signal-blue
const WHITE = '255, 255, 255';

/* --- Modes ---------------------------------------------------------------*/

/**
 * Contour — a topographic survey of a noise field, drawn with marching
 * squares. Thin isolines on near-black; the densest bands read as terrain.
 */
function drawContour(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
) {
  const noise = makeNoise(rand);
  const scale = 2.6;
  const cols = 120;
  const rows = Math.max(24, Math.round(cols * (h / w)));
  const cw = w / cols;
  const ch = h / rows;
  const originX = rand() * 40;
  const originY = rand() * 40;

  // Sample the scalar field once; marching squares reads it per threshold.
  const field: number[][] = [];
  for (let y = 0; y <= rows; y++) {
    const row: number[] = [];
    for (let x = 0; x <= cols; x++) {
      row.push(
        fbm(noise, originX + (x / cols) * scale, originY + (y / rows) * scale),
      );
    }
    field.push(row);
  }

  const levels = 22;
  for (let i = 0; i < levels; i++) {
    const t = i / (levels - 1);
    const threshold = -0.42 + t * 0.84;

    // Lines nearer the middle of the range sit "closer" — brighter and thicker.
    const centrality = 1 - Math.abs(t - 0.5) * 2;
    const alpha = 0.1 + centrality * 0.42;
    const tint = t > 0.62 ? SIGNAL : TWILIGHT;
    ctx.strokeStyle = `rgba(${i % 5 === 0 ? WHITE : tint}, ${alpha})`;
    ctx.lineWidth = i % 5 === 0 ? 1.1 : 0.7;
    ctx.beginPath();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tl = field[y][x];
        const tr = field[y][x + 1];
        const br = field[y + 1][x + 1];
        const bl = field[y + 1][x];

        let state = 0;
        if (tl > threshold) state |= 8;
        if (tr > threshold) state |= 4;
        if (br > threshold) state |= 2;
        if (bl > threshold) state |= 1;
        if (state === 0 || state === 15) continue;

        const x0 = x * cw;
        const y0 = y * ch;
        // Linear interpolation puts each crossing at the true zero, which is
        // what stops the lines looking like stair-stepped pixels.
        const lerpX = (a: number, b: number) => (threshold - a) / (b - a);
        const top = { x: x0 + cw * lerpX(tl, tr), y: y0 };
        const right = { x: x0 + cw, y: y0 + ch * lerpX(tr, br) };
        const bottom = { x: x0 + cw * lerpX(bl, br), y: y0 + ch };
        const left = { x: x0, y: y0 + ch * lerpX(tl, bl) };

        const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        };

        switch (state) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(left, bottom); seg(top, right); break;
        }
      }
    }
    ctx.stroke();
  }
}

/**
 * Flow — particles advected through a noise-driven vector field, each leaving
 * a trail. The result is a wind map: directional, organic, unmistakably a
 * simulation rather than a texture.
 */
function drawFlow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
) {
  const noise = makeNoise(rand);
  const particles = 900;
  const steps = 90;
  const stepLength = Math.max(w, h) / 190;
  const scale = 0.0032;

  ctx.lineCap = 'round';

  for (let i = 0; i < particles; i++) {
    let x = rand() * w;
    let y = rand() * h;

    // Depth cue: a third of the trails are brighter and sit "in front".
    const front = rand() > 0.68;
    const tint = front ? WHITE : rand() > 0.5 ? SIGNAL : TWILIGHT;
    ctx.strokeStyle = `rgba(${tint}, ${front ? 0.3 : 0.14})`;
    ctx.lineWidth = front ? 0.9 : 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let s = 0; s < steps; s++) {
      const angle = fbm(noise, x * scale, y * scale, 4) * Math.PI * 2.4;
      x += Math.cos(angle) * stepLength;
      y += Math.sin(angle) * stepLength;
      if (x < 0 || x > w || y < 0 || y > h) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/**
 * Lattice — a node graph with proximity edges. Reads as a service topology,
 * which is the most on-subject image an infrastructure portfolio can carry.
 */
function drawLattice(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
) {
  // Density is set against area so a small thumbnail and a full-bleed hero
  // both read as the same graph rather than the same node count stretched.
  const count = Math.max(28, Math.round((w * h) / 1250));
  const nodes: { x: number; y: number; r: number }[] = [];

  // Rejection sampling keeps nodes from clumping, so the graph reads evenly.
  const minDist = Math.min(w, h) / 16;
  let guard = 0;
  while (nodes.length < count && guard < count * 80) {
    guard++;
    const x = rand() * w;
    const y = rand() * h;
    if (nodes.some((n) => Math.hypot(n.x - x, n.y - y) < minDist)) continue;
    nodes.push({ x, y, r: 1 + rand() * 1.8 });
  }

  const linkDist = minDist * 2.9;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d > linkDist) continue;
      // Closer pairs draw stronger links — the falloff is what gives depth.
      const strength = 1 - d / linkDist;
      ctx.strokeStyle = `rgba(${TWILIGHT}, ${0.16 + strength * 0.62})`;
      ctx.lineWidth = 0.5 + strength * 0.5;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
  }

  for (const n of nodes) {
    const hot = rand() > 0.82;
    ctx.fillStyle = hot ? `rgba(${SIGNAL}, 0.95)` : `rgba(${WHITE}, 0.62)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();

    if (hot) {
      ctx.fillStyle = `rgba(${SIGNAL}, 0.14)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Orbit — nested elliptical traces perturbed by noise, like a plotted
 * trajectory. The one mode that keeps a clear focal point.
 */
function drawOrbit(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
) {
  const noise = makeNoise(rand);
  const cx = w * (0.42 + rand() * 0.16);
  const cy = h * (0.46 + rand() * 0.12);
  const tilt = (-0.5 + rand()) * 0.7;
  const rings = 34;

  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1);
    const rx = (Math.min(w, h) * 0.12 + t * Math.max(w, h) * 0.46) * 1;
    const ry = rx * (0.26 + t * 0.16);
    const alpha = (1 - t) * 0.42 + 0.05;
    ctx.strokeStyle = `rgba(${t > 0.75 ? SIGNAL : t > 0.3 ? TWILIGHT : WHITE}, ${alpha})`;
    ctx.lineWidth = t < 0.2 ? 1 : 0.6;
    ctx.beginPath();

    const segments = 220;
    for (let s = 0; s <= segments; s++) {
      const a = (s / segments) * Math.PI * 2;
      // Noise perturbation stops the rings reading as a plain vector ellipse.
      const wobble = 1 + fbm(noise, Math.cos(a) * 1.4 + i * 0.2, Math.sin(a) * 1.4, 3) * 0.28;
      const px = Math.cos(a) * rx * wobble;
      const py = Math.sin(a) * ry * wobble;
      const x = cx + px * Math.cos(tilt) - py * Math.sin(tilt);
      const y = cy + px * Math.sin(tilt) + py * Math.cos(tilt);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Core glow, drawn last so it sits above the traces.
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.3);
  glow.addColorStop(0, `rgba(${WHITE}, 0.75)`);
  glow.addColorStop(0.25, `rgba(${SIGNAL}, 0.16)`);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

const MODES: Record<
  ArtVariant,
  (ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void
> = {
  contour: drawContour,
  flow: drawFlow,
  lattice: drawLattice,
  orbit: drawOrbit,
};

/* --- Component -----------------------------------------------------------*/

export function Artwork({
  variant,
  uid,
  className = '',
}: {
  variant: ArtVariant;
  /** Any stable string. The same uid always produces the same image. */
  uid: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const render = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      // Render at device resolution; hairlines alias badly otherwise.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = INK_GROUND;
      ctx.fillRect(0, 0, width, height);

      MODES[variant](ctx, width, height, mulberry32(hashSeed(uid + variant)));
    };

    render();

    // Redraw on resize — the composition is laid out in CSS pixels, so a
    // stretched bitmap would blur rather than reflow.
    const observer = new ResizeObserver(render);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [variant, uid]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}

/**
 * Full-bleed backdrop for hero and statement sections. Sits behind content at
 * reduced opacity with a scrim, so text keeps its contrast ratio.
 */
export function Atmosphere({
  uid,
  variant = 'contour',
  className = '',
}: {
  uid: string;
  variant?: ArtVariant;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <Artwork variant={variant} uid={uid} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.88) 100%)',
        }}
      />
    </div>
  );
}
