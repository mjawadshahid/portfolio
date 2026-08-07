/**
 * Target layouts for the particle field. Each function fills an
 * xyz Float32Array; the shader interpolates between them as you scroll.
 *
 * Four states, matching the acts in PLAN.md §3:
 *   tokens   — glyph-like rows, as if text were laid out in space
 *   clusters — two gaussian blobs: aviation and healthcare
 *   noise    — uniform sphere, the pre-diffusion state
 *   resolved — a portrait plane
 */

/** Deterministic PRNG so the layout is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller, for cluster falloff that looks like an actual distribution. */
function gaussian(rand: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function tokenLayout(count: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  // Nine lines of "text". The gap between rows has to stay well clear of the
  // within-row jitter or the whole thing collapses into static instead of
  // reading as type.
  const lines = 9;
  const lineHeight = 0.95;
  const width = 9;
  const glyphs = 34;
  const glyphW = width / glyphs;

  for (let i = 0; i < count; i++) {
    const line = Math.floor(rand() * lines);

    // Ragged right edge — real lines of text don't all end in the same place.
    const lineLength = 0.45 + ((line * 7919) % 100) / 180;
    const glyph = Math.floor(rand() * glyphs * lineLength);

    // Word gaps: leave a few columns empty so runs of glyphs are visible.
    if (glyph % 7 === 6) {
      out[i * 3] = -width / 2 + glyph * glyphW;
      out[i * 3 + 1] = (lines / 2 - line) * lineHeight;
      out[i * 3 + 2] = 40; // parked far behind; effectively invisible
      continue;
    }

    out[i * 3] = -width / 2 + glyph * glyphW + rand() * glyphW * 0.72;
    out[i * 3 + 1] = (lines / 2 - line) * lineHeight + (rand() - 0.5) * 0.2;
    out[i * 3 + 2] = (rand() - 0.5) * 0.2;
  }
  return out;
}

export function clusterLayout(count: number, seed = 2): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  // Two centres. The separation is the point — it's the site's whole structure.
  const centres = [
    [-2.6, 0.35, 0],
    [2.6, -0.35, 0],
  ];

  for (let i = 0; i < count; i++) {
    const c = centres[i % 2];
    const spread = 1.15;
    out[i * 3] = c[0] + gaussian(rand) * spread;
    out[i * 3 + 1] = c[1] + gaussian(rand) * spread * 0.8;
    out[i * 3 + 2] = c[2] + gaussian(rand) * spread * 0.7;
  }
  return out;
}

export function noiseLayout(count: number, seed = 3): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Uniform inside a sphere — evenly filled, no centre clumping.
    const u = rand();
    const v = rand();
    const w = rand();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const r = 5.2 * Math.cbrt(w);

    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

/**
 * The resolved state — a portrait plane.
 *
 * TODO(jawad): once you send a high-resolution portrait, this gets replaced by
 * a version that samples the image on a canvas and writes per-particle
 * positions and colours from its pixels, so the face resolves out of the noise
 * carrying its own colour. Until then it's an even plane with a soft vignette,
 * which reads correctly but isn't the payoff yet.
 */
export function portraitLayout(count: number, seed = 4): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  const w = 4.4;
  const h = 5.6;

  for (let i = 0; i < count; i++) {
    let x = (rand() - 0.5) * w;
    let y = (rand() - 0.5) * h;

    // Elliptical falloff so the mass sits where a head and shoulders would.
    const d = Math.sqrt((x / (w * 0.5)) ** 2 + (y / (h * 0.5)) ** 2);
    if (d > 1) {
      const pull = 1 / d;
      x *= pull;
      y *= pull;
    }

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (rand() - 0.5) * 0.4;
  }
  return out;
}

/** Per-particle randoms: size jitter, colour mix, drift phase. */
export function attributes(count: number, seed = 9) {
  const rand = mulberry32(seed);
  const random = new Float32Array(count);
  for (let i = 0; i < count; i++) random[i] = rand();
  return { random };
}
