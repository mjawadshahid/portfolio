/**
 * Numbered section marker.
 *
 * The numbering is real — these are read in order down the page — so it
 * encodes something true rather than decorating.
 *
 * No trailing rule. A hairline running to the edge of every section turned
 * into visual noise once there were nine of them, and the number plus the
 * letter-spacing already does the work.
 */
export function SectionLabel({
  index,
  children,
  tone = "paper",
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "paper" | "terminal";
}) {
  const accent = tone === "paper" ? "var(--color-amber-ink)" : "var(--color-amber)";
  const muted =
    tone === "paper" ? "var(--color-muted)" : "var(--color-terminal-dim)";

  return (
    <p className="t-label mb-7 flex items-baseline gap-2.5">
      {index ? <span style={{ color: accent }}>{index}</span> : null}
      <span style={{ color: muted }}>{children}</span>
    </p>
  );
}
