/**
 * Shared mutable state between the ScrollTriggers that measure the DOM and the
 * render loop that draws the canvas.
 *
 * Deliberately not React state: this updates every frame, and routing it
 * through the reconciler would re-render the tree 60 times a second.
 */

/**
 * The canvas is alive for the entire page, not just the opening.
 *
 * Each act is a band of scroll with its own visual state, and the dark bands
 * are interleaved with paper document sections all the way to the footer — so
 * the field keeps reappearing rather than being hidden away after the hero.
 */
export const ACTS = [
  "tokenize", // text scatters into glyph rows
  "embed", // two dense clusters
  "stream", // a flowing band behind the marquee
  "gallery", // wide lattice behind the horizontal track
  "denoise", // noise resolving toward the portrait
  "constellation", // sparse, calm, behind the credentials
  "disperse", // blows apart behind the contact block
] as const;

export type Act = (typeof ACTS)[number];

type ActState = Record<Act, number>;

const zeroed = Object.fromEntries(ACTS.map((a) => [a, 0])) as ActState;

export const scrollState = {
  ...zeroed,

  /** Normalised pointer, -1 → 1, for parallax drift. */
  pointerX: 0,
  pointerY: 0,

  /**
   * Scroll velocity in px/frame, smoothed. Drives the marquee skew and the
   * field's turbulence, so the whole page reacts to how hard you're scrolling.
   */
  velocity: 0,

  /**
   * 0 on a dark band, 1 on a paper band. The field inverts its palette rather
   * than switching off, so it can still show through light sections that want
   * it.
   */
  lightness: 0,
};

export type ScrollState = typeof scrollState;
