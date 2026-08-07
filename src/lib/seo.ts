import type { Metadata } from "next";
import { site, socialList } from "@/lib/site";
import { certifications, education, currentRole } from "@/data/work";

/**
 * Metadata and structured data. The whole SEO thesis is that the WebGL layer
 * is decoration and the DOM carries everything — so this file matters more to
 * ranking than the entire src/webgl directory does. See PLAN.md §4.
 */

type PageMetaInput = {
  title: string;
  description: string;
  /** Path with leading slash, e.g. "/work". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
};

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  tags,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const ogImage = `${site.url}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ---------------------------------------------------------------- JSON-LD */

const personId = `${site.url}/#person`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    description: site.description,
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.countryCode,
    },
    worksFor: { "@type": "Organization", name: currentRole.company },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
      description: `${education.degree} — ${education.distinction}, CGPA ${education.cgpa}`,
    },
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.issuer },
      ...(c.url ? { url: c.url } : {}),
    })),
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Aviation ground operations",
      "Ground handling optimisation",
      "Task assignment optimisation",
      "Healthcare software",
      "Clinical decision support",
      "Patient management systems",
      "Large language models",
      "AWS cloud architecture",
    ],
    sameAs: socialList.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": personId },
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
}) {
  const url = `${site.url}/writing/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.date,
    author: { "@id": personId },
    publisher: { "@id": personId },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: `${site.url}/api/og?title=${encodeURIComponent(input.title)}`,
    ...(input.tags?.length ? { keywords: input.tags.join(", ") } : {}),
  };
}

export function talkSchema(input: {
  title: string;
  description: string;
  event: string;
  venue?: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.event,
    description: input.description,
    startDate: input.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(input.venue
      ? { location: { "@type": "Place", name: input.venue } }
      : { location: { "@type": "Place", name: "TBC" } }),
    performer: { "@id": personId },
    about: input.title,
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path}`,
    })),
  };
}
