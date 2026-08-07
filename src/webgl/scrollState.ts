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
 * are interleaved with paper document sections all the way to the footer, so
 * the field keeps reappearing rather than being hidden away after the hero.
 */
/**
 * Order matters and is not arbitrary: the shader chains these blends in this
 * exact sequence, so the page's section order has to match. Put a later act
 * on an earlier section and the later blend simply overwrites it, and that
 * section appears to do nothing.
 */
export const ACTS = [
  "gallery", // wide lattice, behind the opening gallery
  "stream", // a flowing band behind the toolbox wall
  "embed", // two dense clusters
  "denoise", // resolves toward the portrait
  "constellation", // sparse and calm, behind the credentials
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

  /**
   * True while an opaque paper section covers the canvas.
   *
   * Scroll triggers keep firing behind it, so without this the field morphs
   * through a whole transition nobody can see and reappears already in the
   * next state. While occluded the render loop freezes its interpolation, and
   * on reveal it eases toward wherever the target has moved to, so the
   * transition actually plays where you can watch it.
   */
  occluded: false,
};

export type ScrollState = typeof scrollState;
