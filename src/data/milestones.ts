/**
 * The opening gallery's contents.
 *
 * Modelled on landonorris.com's `horizontal-grid-col` layout: columns of
 * varying height, scattered vertically, tiles captioned "title, year", with
 * statements interleaved between them.
 *
 * This is the answer to "what i do" — capability statements sitting alongside
 * the work that proves them, rather than a grid of feature cards.
 *
 * `image` is optional on purpose: real photography drops straight in when you
 * send it, and until then each tile renders a procedural plate so the
 * composition is already correct.
 *
 * TODO(jawad): send stage photos, screenshots, team shots. Any tile with an
 * `image` uses it.
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
      kind: "say";
      /** Short label above the statement, e.g. "optimisation". */
      label?: string;
      text: string;
      h: number;
      offset?: number;
    };

export type Column = {
  /** Column width in px at desktop. */
  w: number;
  /** Gap after this column; varied widths break the grid rhythm. */
  gap: number;
  /**
   * Parallax depth. 1 moves with the track, below 1 drifts slower (further
   * away), above 1 faster (nearer). This is what stops it reading as a flat
   * strip.
   */
  depth: number;
  tiles: Tile[];
};

export const galleryColumns: Column[] = [
  {
    w: 420,
    gap: 48,
    depth: 1,
    tiles: [
      {
        kind: "say",
        label: "optimisation and scheduling",
        text: "assignment and routing under real constraints, re-solved live as conditions change rather than planned once and hoped for.",
        h: 280,
        offset: 40,
      },
    ],
  },
  {
    w: 340,
    gap: 40,
    depth: 0.9,
    tiles: [
      { kind: "plate", title: "task-to-driver assignment", year: "2024", h: 400 },
      { kind: "plate", title: "live reassignment", year: "2025", h: 200, offset: 24 },
    ],
  },
  {
    w: 300,
    gap: 96,
    depth: 1.12,
    tiles: [
      { kind: "plate", title: "ground ops platform", year: "2024", h: 300, offset: 180 },
    ],
  },
  {
    w: 430,
    gap: 48,
    depth: 0.94,
    tiles: [
      {
        kind: "say",
        label: "llm systems that hold up",
        text: "retrieval, structured extraction and generation, with evaluation harnesses. the interesting part is what happens when the model is wrong.",
        h: 300,
        offset: -30,
      },
    ],
  },
  {
    w: 360,
    gap: 40,
    depth: 1.06,
    tiles: [
      { kind: "plate", title: "clinical reporting", year: "2023", h: 330, offset: 120 },
      { kind: "plate", title: "patient management", year: "2023", h: 240 },
    ],
  },
  {
    w: 400,
    gap: 96,
    depth: 0.88,
    tiles: [
      {
        kind: "say",
        label: "production ml platform",
        text: "serving, versioning, monitoring, cost and latency budgets. the unglamorous work that decides whether a model survives contact with users.",
        h: 300,
        offset: 60,
      },
    ],
  },
  {
    w: 330,
    gap: 40,
    depth: 1.1,
    tiles: [
      { kind: "plate", title: "aws solutions architect", year: "2023", h: 420, offset: -50 },
    ],
  },
  {
    w: 420,
    gap: 48,
    depth: 0.96,
    tiles: [
      {
        kind: "say",
        label: "the software around the model",
        text: "operational dashboards and internal tools. a model nobody can override is a model that gets switched off.",
        h: 260,
        offset: 150,
      },
    ],
  },
  {
    w: 340,
    gap: 40,
    depth: 1.02,
    tiles: [
      { kind: "plate", title: "fast nuces, gold medal", year: "2022", h: 360, offset: 20 },
      { kind: "plate", title: "first production model", year: "2022", h: 200 },
    ],
  },
];
