import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    // The domain pages carry the non-brand SEO, so they rank above /work here.
    { url: `${site.url}/aviation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/healthcare`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/specs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/speaking`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const posts: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: `${site.url}/writing/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const projects: MetadataRoute.Sitemap = getProjects().map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...posts, ...projects];
}
