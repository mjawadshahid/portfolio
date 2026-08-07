"use client";

/**
 * Tile grid where hovering lifts a tile forward out of the plane.
 *
 * This is the treatment the reference uses on its helmets wall: a base frame
 * with a second overlay frame that cross-fades in over ~0.75s, plus a label
 * and a year. Here it replaces the scrolling skills strip, a wall you can
 * actually read and poke at, instead of a carousel moving text past you.
 *
 * Pure CSS: no JS, no observers. It works with JavaScript disabled and costs
 * nothing on the main thread.
 */
export function StackGrid({
  items,
}: {
  items: readonly { label: string; note: string }[];
}) {
  return (
    <ul
      className="grid grid-cols-2 gap-2.5 [perspective:1200px] sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
      style={{ transformStyle: "preserve-3d" }}
    >
      {items.map((item, i) => (
        <li
          key={item.label}
          className="group relative isolate cursor-default rounded-[2px] border border-[var(--color-terminal-rule)] bg-[var(--color-terminal-raised)] p-4 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.65,0.05,0,1)] hover:z-10 hover:-translate-y-2 hover:scale-[1.035] hover:border-[var(--color-amber)] hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] sm:p-5"
        >
          {/* The overlay frame that fades in on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 0%, rgba(232,163,61,0.15), transparent 65%)",
            }}
          />

          <p className="t-mono-sm relative text-[0.66rem] text-[var(--color-terminal-dim)]">
            {String(i + 1).padStart(2, "0")}
          </p>
          {/* Product names keep their real capitalisation; the note is prose. */}
          <p className="keep-case relative mt-3 font-[family-name:var(--font-mono)] text-[1.02rem] tracking-[-0.03em] text-[var(--color-terminal-bright)]">
            {item.label}
          </p>
          <p className="relative mt-1.5 text-[0.82rem] leading-snug text-[var(--color-terminal-dim)]">
            {item.note}
          </p>
        </li>
      ))}
    </ul>
  );
}
