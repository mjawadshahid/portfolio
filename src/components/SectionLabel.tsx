/**
 * Numbered section marker. The numbering is real — these are read in order on
 * the page — so it encodes something true rather than decorating.
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
  const color =
    tone === "paper" ? "var(--color-amber-ink)" : "var(--color-amber)";
  const rule =
    tone === "paper" ? "var(--color-paper-rule)" : "var(--color-terminal-rule)";

  return (
    <p className="t-label flex items-center gap-3 mb-7" style={{ color }}>
      {index ? <span>{index} —</span> : null}
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="flex-1 h-px"
        style={{ background: rule }}
      />
    </p>
  );
}
