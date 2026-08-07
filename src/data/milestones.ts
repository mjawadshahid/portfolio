/**
 * The horizontal gallery's contents.
 *
 * Modelled on landonorris.com's `horizontal-grid-col` layout: columns of
 * varying height, scattered vertically, each tile captioned "title, year",
 * with pull-quotes interleaved between the photos.
 *
 * `image` is optional on purpose — real photography drops straight in when
 * you send it, and until then each tile renders a procedural plate so the
 * composition is already correct.
 *
 * TODO(jawad): send stage photos, screenshots, team shots. Any tile with an
 * `image` will use it.
 */

export type Tile =
  | {
      kind: "plate";
      title: string;
      year: string;
      /** Tile height in px at desktop. Variety here is the whole effect. */
      h: number;
      /** Vertical offset within the column, positive = pushed down. */
      offset?: number;
      image?: string;
      alt?: string;
    }
  | {
      kind: "quote";
      text: string;
      attribution?: string;
      h: number;
      offset?: number;
    };

export type Column = {
  /** Column width in px at desktop. */
  w: number;
  /** Gap after this column; varied widths are what break the grid rhythm. */
  gap: number;
  /**
   * Parallax depth. 1 = moves with the track, <1 drifts slower (further
   * away), >1 faster (nearer). This is what stops it reading as a flat strip.
   */
  depth: number;
  tiles: Tile[];
};

export const galleryColumns: Column[] = [
  {
    w: 380,
    gap: 40,
    depth: 0.92,
    tiles: [
      { kind: "plate", title: "fast nuces, gold medal", year: "2022", h: 420 },
      { kind: "plate", title: "first production model", year: "2022", h: 240, offset: 28 },
    ],
  },
  {
    w: 300,
    gap: 96,
    depth: 1.08,
    tiles: [
      { kind: "plate", title: "clinical reporting", year: "2023", h: 300, offset: 150 },
    ],
  },
  {
    w: 440,
    gap: 40,
    depth: 1,
    tiles: [
      {
        kind: "quote",
        text: "anyone can get a model working. the job is keeping it working.",
        h: 260,
        offset: 60,
      },
      { kind: "plate", title: "patient management", year: "2023", h: 330 },
    ],
  },
  {
    w: 340,
    gap: 64,
    depth: 0.86,
    tiles: [
      { kind: "plate", title: "aws solutions architect", year: "2023", h: 380, offset: -40 },
    ],
  },
  {
    w: 400,
    gap: 40,
    depth: 1.14,
    tiles: [
      { kind: "plate", title: "neural lab", year: "2024", h: 260, offset: 200 },
      { kind: "plate", title: "ground ops platform", year: "2024", h: 300 },
    ],
  },
  {
    w: 320,
    gap: 96,
    depth: 0.94,
    tiles: [
      { kind: "plate", title: "task-to-driver assignment", year: "2024", h: 460, offset: -20 },
    ],
  },
  {
    w: 460,
    gap: 40,
    depth: 1.04,
    tiles: [
      {
        kind: "quote",
        text: "a model nobody can override is a model that gets switched off.",
        h: 240,
        offset: 120,
      },
      { kind: "plate", title: "live reassignment", year: "2025", h: 280 },
    ],
  },
  {
    w: 360,
    gap: 40,
    depth: 0.9,
    tiles: [
      { kind: "plate", title: "speaking", year: "2025", h: 340, offset: 40 },
    ],
  },
];
