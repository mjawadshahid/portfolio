import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Content is files in the repo — no CMS, no runtime fetch, nothing on the
 * critical path. Frontmatter is validated with Zod at build time, so a typo
 * fails `next build` rather than rendering a broken page.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

const domainEnum = z.enum(["aviation", "healthcare"]);

/**
 * YAML parses an unquoted `2026-08-07` into a Date, and a quoted one into a
 * string. Rather than making every author remember the quotes, accept both and
 * normalise to `yyyy-mm-dd`.
 */
const dateField = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v.trim()))
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "date must be yyyy-mm-dd",
  });

const baseFields = {
  title: z.string().min(1),
  description: z.string().min(1).max(200),
  date: dateField,
  draft: z.boolean().optional().default(false),
};

const postSchema = z.object({
  ...baseFields,
  domains: z.array(domainEnum).default([]),
  tags: z.array(z.string()).default([]),
  /** Set when the post has been cross-posted, so we can link the mirror. */
  crossposts: z
    .object({ medium: z.string().url().optional(), devto: z.string().url().optional() })
    .optional(),
});

const projectSchema = z.object({
  ...baseFields,
  domains: z.array(domainEnum).min(1),
  role: z.string(),
  stack: z.array(z.string()).default([]),
  /** Rendered as the spec block at the top of a project page. */
  facts: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
  cover: z.string().optional(),
});

const talkSchema = z.object({
  ...baseFields,
  event: z.string(),
  venue: z.string().optional(),
  /**
   * The LinkedIn post is an enhancement, never the content. LinkedIn has no
   * public API for listing your own posts, and its embed is a cross-origin
   * iframe Google cannot read — so the talk itself lives here as real HTML and
   * the post is a click-to-load facade. See PLAN.md §5.
   */
  linkedin: z.string().url().optional(),
  photos: z
    .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
    .default([]),
});

export type Post = z.infer<typeof postSchema> & { slug: string; body: string };
export type Project = z.infer<typeof projectSchema> & { slug: string; body: string };
export type Talk = z.infer<typeof talkSchema> & { slug: string; body: string };

function readCollection<T extends z.ZodTypeAny>(
  dir: string,
  schema: T
): (z.infer<T> & { slug: string; body: string })[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];

  const entries = fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const items = entries.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(full, file), "utf8");
    const { data, content } = matter(raw);

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in content/${dir}/${file}:\n` +
          parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
      );
    }

    return { ...parsed.data, slug, body: content };
  });

  // Newest first. Drafts never reach production.
  return items
    .filter((i) => (process.env.NODE_ENV === "development" ? true : !i.draft))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPosts(): Post[] {
  return readCollection("writing", postSchema) as Post[];
}

export function getProjects(): Project[] {
  return readCollection("projects", projectSchema) as Project[];
}

export function getTalks(): Talk[] {
  return readCollection("speaking", talkSchema) as Talk[];
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function projectsByDomain(domain: "aviation" | "healthcare"): Project[] {
  return getProjects().filter((p) => p.domains.includes(domain));
}

export function postsByDomain(domain: "aviation" | "healthcare"): Post[] {
  return getPosts().filter((p) => p.domains.includes(domain));
}

/** Rough reading time; deliberately not shown to two decimal places. */
export function readingTime(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2024-01" → "Jan 2024"; null → "Present". */
export function formatMonth(iso: string | null): string {
  if (iso === null) return "Present";
  return new Date(iso + "-01T00:00:00Z").toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
