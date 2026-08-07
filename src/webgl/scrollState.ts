/**
 * A single mutable object shared between the ScrollTrigger that measures the
 * DOM and the render loop that draws the canvas.
 *
 * Deliberately not React state: this updates every frame, and putting it
 * through the reconciler would re-render the tree 60 times a second for no
 * reason. The canvas reads it inside useFrame.
 */
export const scrollState = {
  /** 0 → 1 across the whole act sequence (prompt through denoise). */
  progress: 0,
  /** Per-act progress, each 0 → 1. */
  tokenize: 0,
  embed: 0,
  denoise: 0,
  /** Normalised pointer, -1 → 1, for the parallax drift. */
  pointerX: 0,
  pointerY: 0,
  /** Set false once the sequence is fully scrolled past, to skip work. */
  visible: true,
};

export type ScrollState = typeof scrollState;
