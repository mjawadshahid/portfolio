# jawadshahid.dev

Personal site for Jawad Shahid — AI engineer, aviation and healthcare.

Next.js 15 (App Router, static), React Three Fiber, GSAP + Lenis, Tailwind v4,
MDX content in the repo. Design direction and rationale live in [PLAN.md](PLAN.md).

```bash
pnpm install
pnpm dev
```

| Command | |
|---|---|
| `pnpm dev` | Dev server on :3000. Drafts render here. |
| `pnpm build` | Production build. Drafts are excluded. |
| `pnpm typecheck` | `tsc --noEmit` |

## The one rule

**The DOM owns every word; the canvas owns none.**

The WebGL layer is a `position: fixed` canvas at `z-index: -1`. Sections that
want the particle field showing through use `.ground-field` (transparent);
sections that want a solid ground use `.ground-terminal` or `.ground-paper`.

Delete `src/webgl/` entirely and the site is still complete, readable and
crawlable. That's the point — it's why a site this animated can still rank.

Two consequences worth knowing before you edit anything:

- `<body>` must stay transparent. An opaque background on `body` paints *over*
  a `z-index: -1` child and the canvas vanishes. The ground colour lives on
  `<html>`.
- Act 00 (the terminal boot) is server-rendered text and is the LCP element.
  Don't put anything above it that needs JavaScript.

## Adding content

Content is MDX files under `content/`. Frontmatter is validated by Zod at build
time, so a typo fails `pnpm build` rather than shipping a broken page. Schemas
are in [src/lib/content.ts](src/lib/content.ts).

```
content/writing/<slug>.mdx     posts
content/projects/<slug>.mdx    project write-ups
content/speaking/<slug>.mdx    talks
```

Set `draft: true` to keep something out of production, the sitemap and the RSS
feed while still rendering it in dev. The two `_template.mdx` files show every
supported field; delete them once you have real entries.

Structured data (roles, education, certifications, tech specs) lives in
`src/data/` as typed TypeScript, not MDX.

## Publishing a post

The cross-posting order is the single biggest SEO lever on this site, and
getting it backwards hands the credit to Medium:

1. Publish here first.
2. Wait until Search Console shows it indexed — usually 1–3 days.
3. Then cross-post with a canonical URL pointing back here. dev.to takes a
   `canonical_url` frontmatter field; Medium's import tool sets it for you.
4. Record the mirrors in the post's `crossposts` frontmatter.

## Deploying

Vercel, `main` → production. Set the custom domain to `jawadshahid.dev` in
project settings; no environment variables are required.

## Outstanding

Grep for `TODO(jawad)` — those are placeholders I couldn't source. The ones
that matter most:

- **A high-resolution portrait.** `portraitLayout()` in
  [src/webgl/particles.ts](src/webgl/particles.ts) currently resolves to an
  even plane. With a real photo it samples the image and each particle carries
  its own colour, so your face resolves out of the noise. That's the payoff the
  whole sequence is built toward, and it's the one thing still missing.
- **Numbers.** The work bullets describe what you built but not what it moved.
  Turnarounds per day, assignment time cut, report volume, clinicians served.
- **Real roles and dates** in `src/data/work.ts` — the healthcare entry is a
  placeholder company name.
- **Speaking entries** — events, photos, LinkedIn post URLs.
