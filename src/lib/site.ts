/**
 * Single source of truth for anything appearing in metadata, structured data,
 * the sitemap or the RSS feed.
 *
 * Anything marked TODO(jawad) is a placeholder I could not source. Grep for it.
 */

export const site = {
  url: "https://jawadshahid.dev",
  name: "Jawad Shahid",
  shortName: "JS",
  role: "AI Engineer",
  tagline: "AI engineer. I build machine learning systems that run in production.",
  description:
    "AI engineer with 3+ years building production machine learning systems — optimisation, LLM tooling, and the software around them. AWS Certified Solutions Architect. Gold medallist, FAST NUCES.",
  locale: "en_US",
  // TODO(jawad): confirm city.
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

export const socialList = Object.entries(socials)
  .filter(([, href]) => href.length > 0)
  .map(([key, href]) => ({
    key,
    href,
    label: key === "devto" ? "dev.to" : key === "x" ? "X" : key[0].toUpperCase() + key.slice(1),
  }));

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/specs", label: "Specs" },
] as const;

/**
 * Industries worked in. These are *tags* — useful context on a project or a
 * role, and nothing more. They are not the site's structure.
 */
export type Domain = "aviation" | "healthcare";

export const domainLabels: Record<Domain, string> = {
  aviation: "Aviation",
  healthcare: "Healthcare",
};

/**
 * What I actually do, which is broader than any one industry. This is the
 * spine of the home page.
 *
 * TODO(jawad): edit freely — these should be the things you want to be hired
 * for, in your own words.
 */
export const capabilities = [
  {
    key: "optimisation",
    title: "Optimisation and scheduling",
    blurb:
      "Assignment and routing problems under real constraints, re-solved live as conditions change rather than planned once and hoped for.",
  },
  {
    key: "llm",
    title: "LLM systems that hold up",
    blurb:
      "Retrieval, structured extraction and generation, with evaluation harnesses — because the interesting part is what happens when the model is wrong.",
  },
  {
    key: "platform",
    title: "Production ML platform",
    blurb:
      "Serving, versioning, monitoring, cost and latency budgets. The unglamorous work that decides whether a model survives contact with users.",
  },
  {
    key: "product",
    title: "The software around the model",
    blurb:
      "Operational dashboards, internal tools and the interfaces people actually run their day on. A model nobody can override gets switched off.",
  },
  {
    key: "cloud",
    title: "Cloud architecture",
    blurb:
      "AWS end to end, certified Solutions Architect. Infrastructure as code, CI/CD, and designing for the bill as well as the benchmark.",
  },
] as const;
