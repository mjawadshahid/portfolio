/**
 * Target layouts for the particle field. Each fills an xyz Float32Array; the
 * shader blends between them as you scroll.
 *
 * Seven states, one per act in scrollState.ts. The field is alive for the
 * whole page, so it needs somewhere to go the whole way down.
 */

/** Deterministic PRNG so layouts are identical on server and client. */
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

/** Box-Muller, for cluster falloff that looks like a real distribution. */
function gaussian(rand: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Parked far behind the camera — effectively invisible for this state. */
const PARKED = 60;

export function tokenLayout(count: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  const lines = 9;
  const lineHeight = 0.95;
  const width = 9;
  const glyphs = 34;
  const glyphW = width / glyphs;

  for (let i = 0; i < count; i++) {
    const line = Math.floor(rand() * lines);
    const lineLength = 0.45 + ((line * 7919) % 100) / 180;
    const glyph = Math.floor(rand() * glyphs * lineLength);

    // Word gaps, so runs of glyphs read as words rather than a solid mat.
    if (glyph % 7 === 6) {
      out[i * 3] = 0;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = PARKED;
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

  const centres = [
    [-2.8, 0.35, 0],
    [2.8, -0.35, 0],
  ];

  for (let i = 0; i < count; i++) {
    const c = centres[i % 2];
    const spread = 1.2;
    out[i * 3] = c[0] + gaussian(rand) * spread;
    out[i * 3 + 1] = c[1] + gaussian(rand) * spread * 0.8;
    out[i * 3 + 2] = c[2] + gaussian(rand) * spread * 0.7;
  }
  return out;
}

/**
 * A horizontal flowing band. Sits behind the marquee, so the field appears to
 * be moving with the text.
 */
export function streamLayout(count: number, seed = 5): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * 26;
    // Three ribbons, each with its own vertical offset and wave phase.
    const ribbon = i % 3;
    const base = (ribbon - 1) * 1.5;
    const wave = Math.sin(x * 0.42 + ribbon * 2.1) * 0.55;

    out[i * 3] = x;
    out[i * 3 + 1] = base + wave + gaussian(rand) * 0.28;
    out[i * 3 + 2] = gaussian(rand) * 0.7 - 1.5;
  }
  return out;
}

/**
 * A wide, deep lattice. Behind the pinned horizontal gallery, so the field
 * reads as a space the cards are travelling through.
 */
export function latticeLayout(count: number, seed = 6): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  const cols = 60;
  const rows = 16;

  for (let i = 0; i < count; i++) {
    const col = Math.floor(rand() * cols);
    const row = Math.floor(rand() * rows);
    const depth = Math.floor(rand() * 5);

    // Jitter each node so it's a lattice, not graph paper.
    out[i * 3] = (col / cols - 0.5) * 34 + (rand() - 0.5) * 0.34;
    out[i * 3 + 1] = (row / rows - 0.5) * 11 + (rand() - 0.5) * 0.34;
    out[i * 3 + 2] = -depth * 1.9 + (rand() - 0.5) * 0.5;
  }
  return out;
}

/**
 * The opening state: particles everywhere.
 *
 * A wide, deep, evenly-filled volume that overfills the frame, so the page
 * opens inside the field rather than looking at a shape sitting in the middle
 * of it. The whole sequence is bookended — it starts scattered, condenses
 * through the acts, and disperses again at the end.
 *
 * Depth is biased backwards so the densest part sits behind the headline
 * instead of on top of it.
 */
export function ambientLayout(count: number, seed = 10): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 30;
    out[i * 3 + 1] = (rand() - 0.5) * 18;
    // cbrt biases toward the far end, so the near plane stays sparse.
    out[i * 3 + 2] = -1 - Math.cbrt(rand()) * 15;
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
    const r = 5.4 * Math.cbrt(w);

    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

/**
 * The resolved state — a portrait plane.
 *
 * TODO(jawad): once there's a high-resolution portrait, this gets replaced by
 * a version that samples the image on a canvas and writes per-particle
 * positions and colours from its pixels, so the face resolves out of the noise
 * carrying its own colour. Until then it's a soft elliptical mass, which reads
 * correctly but isn't the payoff yet.
 */
export function portraitLayout(count: number, seed = 4): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  const w = 4.4;
  const h = 5.6;

  for (let i = 0; i < count; i++) {
    let x = (rand() - 0.5) * w;
    let y = (rand() - 0.5) * h;

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

/** Sparse and calm. Behind the credentials block. */
export function constellationLayout(count: number, seed = 7): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Only a fraction participate; the rest park. Sparseness is the point.
    if (rand() > 0.34) {
      out[i * 3] = 0;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = PARKED;
      continue;
    }
    out[i * 3] = (rand() - 0.5) * 22;
    out[i * 3 + 1] = (rand() - 0.5) * 13;
    out[i * 3 + 2] = (rand() - 0.5) * 8 - 2;
  }
  return out;
}

/** Blown outward past the frame. The exit. */
export function disperseLayout(count: number, seed = 8): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = 9 + rand() * 16;

    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    out[i * 3 + 2] = r * Math.cos(phi) * 0.5;
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
