/**
 * Re-exports plus the date formatter, so components can pull work data and its
 * formatting from one place without reaching into lib/content (which touches
 * the filesystem and is server-only).
 */
export { roles, education, certifications, currentRole } from "./work";
export type { Role } from "./work";

/** "2024-01" → "Jan 2024"; null → "Present". */
export function formatMonthSafe(iso: string | null): string {
  if (iso === null) return "Present";
  const d = new Date(`${iso}-01T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
