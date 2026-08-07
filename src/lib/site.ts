/**
 * Single source of truth for anything that appears in metadata, structured
 * data, the sitemap or the RSS feed. Changing a name or a handle here changes
 * it everywhere, including the JSON-LD.
 *
 * Anything marked TODO(jawad) is a placeholder I could not source. Grep for it.
 */

export const site = {
  url: "https://jawadshahid.dev",
  name: "Jawad Shahid",
  shortName: "JS",
  role: "AI Engineer",
  tagline: "AI engineer working in aviation and healthcare.",
  description:
    "AI engineer with 3+ years building production machine learning systems — ground operations optimisation in aviation, and clinical software in healthcare. AWS Certified Solutions Architect.",
  locale: "en_US",
  // TODO(jawad): confirm city. Country inferred from FAST NUCES.
  location: { city: "Lahore", region: "Punjab", country: "Pakistan", countryCode: "PK" },
  // TODO(jawad): confirm the address you want public.
  email: "hello@jawadshahid.dev",
} as const;

export const socials = {
  github: "https://github.com/mjawadshahid",
  // TODO(jawad): confirm these handles.
  linkedin: "https://www.linkedin.com/in/mjawadshahid/",
  medium: "https://medium.com/@mjawadshahid",
  devto: "https://dev.to/mjawadshahid",
  x: "",
} as const;

/** Only non-empty socials end up in `sameAs` and the footer. */
export const socialList = Object.entries(socials)
  .filter(([, href]) => href.length > 0)
  .map(([key, href]) => ({
    key,
    href,
    label: key === "devto" ? "dev.to" : key === "x" ? "X" : key[0].toUpperCase() + key.slice(1),
  }));

export const nav = [
  { href: "/aviation", label: "Aviation" },
  { href: "/healthcare", label: "Healthcare" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/specs", label: "Specs" },
] as const;

export type Domain = "aviation" | "healthcare";

export const domains: Record<
  Domain,
  { slug: Domain; label: string; blurb: string; description: string }
> = {
  aviation: {
    slug: "aviation",
    label: "Aviation",
    blurb: "Ground operations, and the assignment problem underneath it.",
    description:
      "Ground handling operations software and the AI that decides which driver gets which task — assignment under real constraints, reassigned faster than the ramp changes.",
  },
  healthcare: {
    slug: "healthcare",
    label: "Healthcare",
    blurb: "Clinical software, and AI that clinicians will actually use.",
    description:
      "Patient management systems, automated checkup report generation, and decision support built for doctors and clinical organisations.",
  },
};
