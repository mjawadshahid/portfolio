# jawadshahid.dev — build plan

Personal site for Jawad Shahid, AI Engineer. Heavy WebGL/GSAP experience that
does not sacrifice SEO, because those two goals are usually in direct conflict
and most sites in this genre pick one.

---

## 1. The core tension, and how we resolve it

Sites like landonorris.com are effectively WebGL applications. Google sees a
near-empty DOM, LCP lands past 4s, and they rank for nothing but their own
brand name. That is fine for someone with a Wikipedia page. It is not fine for
you, because "Jawad Shahid AI engineer" is a query you actually want to win.

The resolution is a strict separation of layers:

| Layer | Owns | Visible to crawler |
|---|---|---|
| DOM | 100% of content, all routes, all metadata | Yes — everything |
| Canvas | `position: fixed`, decoration + navigation affordance | No — and it doesn't matter |

Rules that follow from this, and which we do not break:

1. **Every word is server-rendered HTML.** The canvas never contains text that
   isn't also in the DOM.
2. **Real routes, not scroll positions.** `/work`, `/projects/[slug]`,
   `/writing/[slug]`, `/speaking` each have their own URL, title, description,
   OG image and structured data. The home page is the cinematic scroll; the
   content is independently addressable.
3. **LCP is DOM text.** Act 00 (the terminal boot) is plain HTML and paints
   almost immediately. The entire WebGL bundle streams in behind it during that
   beat, via `next/dynamic` with `ssr: false`, deferred to idle.
4. **The site is fully usable with JavaScript off**, and with
   `prefers-reduced-motion: reduce`, and on a low-end Android. Three separate
   fallback paths, all tested.
5. **Hard performance budget**, enforced in CI: LCP < 1.2s, CLS < 0.05,
   INP < 200ms, initial JS < 120KB gz (canvas chunk excluded and lazy).

---

## 2. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | Static generation by default, per-route metadata API, `next/og`, best-in-class image pipeline. RSC keeps the content layer off the client bundle. |
| Hosting | **Vercel** | Your call. Zero-config, preview deploy per push, free at this scale. |
| 3D | **React Three Fiber + drei + postprocessing** | Declarative Three.js that composes with React state, so the scroll orchestration and the DOM stay in sync instead of fighting. |
| Animation | **GSAP + ScrollTrigger** | The scroll orchestration tool. All GSAP plugins went free in 2025, so ScrollTrigger and SplitText cost nothing now. |
| Smooth scroll | **Lenis** | Pairs cleanly with ScrollTrigger; gives the weighted scroll feel that sells the effect. Disabled under reduced-motion. Confirmed in use on the reference site. |
| Micro-motion | **Rive** (optional) | For animated icons, button arrows, transition wipes. The reference site runs ~20 of these. Far lighter than WebGL for small UI motion — but it needs authoring in the Rive editor, so it's a phase-13 nice-to-have, not a dependency. |
| Styling | **Tailwind v4 + CSS custom properties** | Tokens live in CSS vars so the palette is one file; Tailwind handles layout. |
| Content | **MDX + gray-matter + Zod** | Posts, projects and talks are files in the repo. No CMS, no vendor, no runtime fetch. Zod validates frontmatter at build so a typo fails the build instead of the page. |
| Analytics | **Vercel Analytics + Speed Insights** | Free, cookieless, no consent banner needed. |

Deliberately **not** using: a CMS (overkill, and a network dependency on the
critical path), Framer Motion for the scroll work (GSAP is better at
timelines), Contentlayer (unmaintained).

---

## 2.5 What landonorris.com actually is (teardown)

I pulled the site apart rather than working from memory. Findings:

**Stack** — built by the studio OFF+BRAND on **Webflow**, of all things, plus
jQuery. The impressive parts are all bolted on: **Lenis** (smooth scroll),
**GSAP/ScrollTrigger** (bundled, not global), **Taxi.js** (page transitions),
**Rive** (~20 small canvases driving icons, buttons, the helmet badge and a
full-screen 2560×1440 transition wipe), and exactly **one** custom WebGL canvas.

**The architecture is the one proposed in §1** — and this is the part worth
copying. That single `canvas.gl` sits in a `.gl-wrap` that is
`position: fixed; z-index: -1`. Every `<section>` above it has a transparent
background. So the DOM holds 100% of the content and scrolls normally; the
canvas is a fixed backdrop showing through. Their entire text content is in the
served HTML — I extracted it in one call. **They did not trade SEO for
spectacle, and neither will we.**

**Structure** — home page is 11,438px, ~16 viewport heights, 12 sections. One
is a 2,484px GSAP-pinned **horizontal scroll** track for the photo gallery.

**Palette** — worth noting, because it isn't what people assume. It is not
"dark site with a neon accent":

| | |
|---|---|
| Olive ground | `#282C20` / `#33372B` / `#3B3C38` |
| Paper | `#F4F4ED` (hero and footer) |
| Acid lime | `#D2FF00` |
| Secondary green | `#B2C73A` |
| Muted | `#B4B8A5`, `#535450` |

The hero is *light*. The page ground is *olive*, not black. That three-way —
warm paper, desaturated olive, one acid accent — is why it looks considered
instead of default. **Your Direction B is structurally closer to your reference
than Direction A is.**

**Type** — `Brier` (characterful display) over `Mona Sans Variable` (GitHub's
free variable workhorse). One display face with personality, one neutral
variable face doing all the work. That's the pairing model to follow.

**Rive is the real lesson.** Every small animated thing — icons, button
arrows, the transition wipe — is Rive, not WebGL and not Lottie. It's far
lighter than spinning up Three.js for a 23×23px animated arrow. Recommended
addition to our stack for exactly that tier of motion.

---

## 3. The scroll narrative — "Inference"

You're right that we can't reuse the entry. Lando's move is: **open on the
face, then abstract it** (a wireframe helmet assembles over his head as you
scroll). Anything that opens on a portrait and pulls back reads as a copy, and
people who know that site will clock it immediately.

So we invert it. **We open on the abstraction and resolve to the face.** Same
level of spectacle, opposite structure, and — unlike a helmet — every beat is
something you genuinely work with. The metaphor isn't decoration; it's an
inference pass over your own name.

- **Act 00 — Prompt.** Black. A caret. A sentence types itself:
  `jawad shahid is an ai engineer who` — then stops, cursor blinking, like a
  completion left pending. Pure DOM; this is the LCP element and it paints
  almost instantly.
- **Act 01 — Tokenize.** The sentence fragments into tokens, each in a tinted
  chip with its token ID flickering beneath — a real tokenizer visualisation,
  the thing you've stared at a hundred times. The chips detach and lift off the
  plane.
- **Act 02 — Embed.** The tokens fly outward and settle as points in a vector
  space — and the field separates into **two dense clusters**, because your
  career does. One is aviation, one is healthcare. The camera drifts between
  them; each resolves into a labelled entry point. This is the site's
  navigation, and it's the moment the visual metaphor stops being decorative:
  the embedding has two clusters because *you* have two domains.
- **Act 03 — Denoise.** The field turns out to be noise. Scroll scrubs the
  reverse diffusion process — noise organises, structure emerges, and across
  about a screen and a half **your portrait resolves out of it.** This is the
  screenshot moment and the reveal.
- **Act 04 — Generate.** The pending sentence from Act 00 completes itself,
  and the rest of the site streams in beneath it like generated tokens.

Three reasons this is the stronger call:

1. **It cannot read as derivative.** The reference opens on a face; we end on
   one. Structurally inverted.
2. **The loading state stops being a lie.** A diffusion hero legitimately
   begins as noise, so the "loader" is the first frame of the content rather
   than a spinner pretending to be one.
3. **Your portrait becomes a payoff instead of a demand.** It arrives already
   stylised, mid-resolve — so it needs a good photo, but tolerates a less than
   perfect one. Lando's opening needs a studio shoot.

Cheap, too: Acts 02 and 03 are the same point-cloud machinery pointed at
different targets, so the two most expensive beats share one implementation.

### The four techniques, reassigned per section

Per your clarification — the vocabulary doesn't retire after the hero. Each
technique gets the section it actually suits, so the site feels like one
language spoken in four dialects rather than a hero followed by a spreadsheet.

| Route | Technique | Treatment |
|---|---|---|
| `/` | All five acts | The full sequence |
| `/work` | Kinetic type | Each role is a giant type block, displacement shader on scroll, dates in mono |
| `/projects` | Embedding space | Projects as clusters in the vector field; the index *is* the 3D space |
| `/projects/[slug]` | Denoise | Opens by flying into that cluster; the project's hero image resolves out of noise |
| `/writing` | Tokenizer | Index rendered as a token stream — each post title chipped and ID'd |
| `/writing/[slug]` | None | Reading is the job. Quiet page, no canvas. |
| `/speaking` | Masked reveals | Stage photos arriving through animated masks; horizontal-scroll gallery |
| `/about` | Constellation | The personal one — the point field at rest |

One shader library, reused. This is why the technique count doesn't
multiply the build cost the way it looks like it should.

---

## 3.5 Content architecture — two domains

The strongest thing you've told me about yourself is that the work splits
cleanly into **aviation** and **healthcare**. That beats a flat reverse-chron
job list on every axis: it's more memorable, it's what a hiring manager
actually screens for, it gives the 3D field a real reason to have two clusters,
and it targets two genuinely distinct search spaces instead of one generic one.

So the site's spine is two domains, not one timeline.

**Aviation** — ground operations handling software, including AI task-to-driver
assignment optimisation. Current role at **Neural Lab**. This is an operations
research problem wearing an AI hat (assignment under constraints, real-time
reassignment, driver utilisation), and it's worth saying so plainly, because
"I optimise dispatch for ground handling" is a much sharper claim than
"I build AI systems".

**Healthcare** — AI and software for clinical organisations: patient management
systems, automated checkup report generation, clinical decision support for
doctors. Regulated-domain experience is rare and valuable; the site should say
so rather than leaving it implied.

**Route shape:**

```
/                      the inference sequence, both clusters visible
/aviation              domain landing: the problem space, then the work
/healthcare            domain landing: the problem space, then the work
/work                  full chronology, for people who want the CV view
/specs                 tech specs sheet: stack, tools, certifications
/projects/[slug]       individual builds, tagged by domain
/writing/[slug]        posts, tagged by domain
/speaking              talks and events
```

`/specs` is lifted straight from Apple's tech-specs pages: your stack, tools,
cloud, certifications and domains as a precise spec sheet rather than a skills
cloud. It reads as confidence, and it quietly ranks for every tool name on it.

The two domain pages are the SEO workhorses. `/work` still exists for anyone
scanning a conventional résumé, but it isn't the front door.

One thing I'd want from you here: **numbers**. "Optimises task-to-driver
assignment" is good; "cut average assignment time by X%" or "handles N daily
turnarounds" is what makes someone stop scrolling. Even rough, even
approximate, even NDA-safe ranges. If you can't share figures, say so and I'll
write around it rather than leaving vague claims that read as padding.

---

## 4. SEO plan

The single biggest lever is that you write natively and cross-post with
canonical — which you chose. Everything else is table stakes we do properly.

**On-page**
- Per-route `generateMetadata`: title, description, canonical, OG, Twitter card.
- Dynamic OG images via `next/og` — one template, per-page text.
- Semantic heading hierarchy, one `h1` per route, real `<article>`/`<time>`.
- Descriptive alt text on every image (also the accessible thing to do).

**Structured data (JSON-LD)**
- `Person` on `/` and `/about` — with `alumniOf` (FAST NUCES),
  `hasCredential` (AWS Solutions Architect), `knowsAbout`, `sameAs` (GitHub,
  LinkedIn, Medium, dev.to).
- `BlogPosting` per article, `BreadcrumbList` on nested routes,
  `WebSite` sitewide.
- `Event` + `ImageObject` for speaking entries.

**Technical**
- `sitemap.ts` and `robots.ts` (Next built-ins), RSS at `/rss.xml`.
- All routes statically generated; no client-side-only content.
- Google Search Console + Bing Webmaster verified at launch.

**Cross-posting workflow** — this is the part people get wrong:
1. Publish on jawadshahid.dev first.
2. Wait until Search Console shows it indexed (usually 1–3 days).
3. Then cross-post: dev.to takes a `canonical_url` frontmatter field;
   Medium's import tool sets canonical automatically. Never paste manually.

Result: Medium and dev.to send you readers, and Google credits your domain.

**Target queries**, now that the two domains are the spine:

| Tier | Queries | Where it's won |
|---|---|---|
| Brand | `Jawad Shahid`, `Jawad Shahid AI engineer` | Must own outright. `Person` schema + `sameAs` does most of this. |
| Domain | `aviation AI engineer`, `ground handling optimisation`, `healthcare AI engineer`, `clinical decision support developer` | The two domain landing pages |
| Long-tail | `task to driver assignment algorithm`, `AI generated checkup reports`, `patient management system architecture` | The blog. This is where non-brand traffic actually comes from. |

The domain tier is the opportunity. "AI engineer" is unwinnable and worthless;
"aviation AI engineer" is a real query with thin competition, and you have
genuine authority in it. Same for the healthcare side. Two focused pages beat
one generic one.

---

## 5. LinkedIn posts — the honest constraints

You want LinkedIn posts embedded, mostly for the speaking photos. Three facts
determine the design here:

1. **There is no public API to list your own posts.** LinkedIn's Community
   Management API requires partner approval that personal sites don't get. So
   an auto-updating feed is off the table — entries are curated by you, which
   at your volume is the right trade anyway.
2. **The official embed is an iframe**
   (`linkedin.com/embed/feed/update/urn:li:share:<id>`). It works, but it's
   heavy, sets third-party cookies, can't be styled, breaks silently if a post
   is deleted, and — critically — its content is **invisible to Google**
   because it's cross-origin.
3. So embedding posts *as the content* means your best proof-of-work is
   invisible to search and slow to load.

**The approach instead — facade pattern:**

Each talk is a native MDX entry: your own photos, event name, date, venue,
your own words, optionally the slides. Real crawlable HTML with `Event` and
`ImageObject` structured data. The LinkedIn post appears as a
"View discussion on LinkedIn" affordance that either links out, or loads the
real iframe on click for people who want it.

You get the photos, the credibility, the SEO, and no perf tax on people who
don't click. The LinkedIn embed becomes an enhancement rather than a
dependency — same principle as the canvas layer.

---

## 6. Build phases

Sequenced so the site is **live and indexing early**, while the spectacle gets
built on top. Domain age and crawl history are things you cannot buy later.

| # | Phase | Outcome |
|---|---|---|
| 1 | Scaffold — Next 15, TS, Tailwind v4, lint/format, repo overwrite | Builds and deploys |
| 2 | Design system — tokens, type scale, layout primitives | Palette in one file |
| 3 | Content layer — MDX pipeline, Zod schemas, real content | Your CV is in the repo |
| 4 | **Static site — every section, no WebGL** | **Ship to Vercel. Domain live.** |
| 5 | SEO layer — metadata, JSON-LD, sitemap, RSS, OG images | Submitted to Search Console |
| 6 | WebGL foundation — R3F canvas, Lenis, ScrollTrigger harness | Scroll orchestration working |
| 7 | Acts 00–01 — terminal boot, portrait zoom | First real moment |
| 8 | Act 02 — point-cloud decomposition | The screenshot moment |
| 9 | Act 03 — latent space + cluster navigation | Home page complete |
| 10 | Act 04 — kinetic type, masked reveals | |
| 11 | Per-section techniques (§3 table) | Whole site speaks the language |
| 12 | Speaking section + LinkedIn facade | |
| 13 | Perf pass — mobile fallbacks, reduced-motion, Lighthouse CI | Budgets enforced |
| 14 | Polish — 404, favicon, analytics, launch | |

Phase 4 is the important one. A fast, complete, boring version of this site
beats a spectacular one that ships in three months.

**Git**: work directly on `main` as you asked, small frequent commits. Old
commits stay; phase 1 lands as a clean overwrite on top of existing history.

---

## 7. Design direction — "amber phosphor"

Settled after three rounds. You liked B′'s palette but said A felt like a
developer built it. Those were never in conflict: **the dev feeling was coming
from the monospace and the command line, not from the black background.** So
Direction C keeps every device from A, drops the didone serif that was making
B read as a blog, and keeps the palette you preferred.

The happy accident: **burnt amber on dark slate-teal is an amber phosphor
terminal.** Real terminal themes are never `#000` — Solarized, Nord and Gruvbox
are all tinted darks. So the coloured ground is *more* authentic than A was,
not a compromise against it.

### Tokens

| Role | Value | Notes |
|---|---|---|
| Terminal ground | `#12211F` | Dark slate-teal. Reads cockpit and clinical at once. |
| Terminal raised | `#1A2B29` | |
| Amber phosphor | `#E8A33D` | On dark only. Cursor, prompt output, live state. |
| Amber ink | `#B4650E` | On paper only — the dark-ground amber fails contrast on light. |
| Paper | `#F0EFEA` | Reading ground. |
| Paper raised | `#E8E7E1` | Spec sheets. |
| Ink | `#14191A` | |
| Muted (paper) | `#636B6D` | |
| Dim (terminal) | `#7E9A95` | |

### Type — three roles, and a rule for each

- **Display: monospace, set huge.** Berkeley Mono if you'll pay (it's worth it
  at display sizes), Geist Mono if not. Mono at scale reads technical and
  editorial simultaneously, which is the register you asked for. Tracking
  around `-0.035em` at hero sizes.
- **UI and running text: SF Pro.** You're on a Mac and you like Apple type;
  it's free, it's a variable font, and it's the correct neutral workhorse.
  Mona Sans is the fallback if we want something non-Apple.
- **Long-form body: a serif — and only here.** `/writing/[slug]` is the one
  place reading comfort outranks personality. Confining the serif to article
  bodies is what stops the site feeling like a blog everywhere else.

### The Apple read

What transfers is structure and restraint, not styling. Cloning apple.com's
surface reads as an impression of Apple within seconds.

**Take:** the pinned scroll-scrub reveal (their product pages invented the
grammar we're already using); the dark-chapter / light-spec-sheet rhythm
(structurally identical to what we have); `/specs` as a real tech-specs page;
generous air; optical tracking that tightens as type scales up.

**Leave:** glassmorphism, the floating pill nav, ultra-light weights at small
sizes, blue-to-purple gradients. Most-cloned things on the web, and they date.

### Still open

Nothing blocking. Two small calls once content lands: whether to pay for
Berkeley Mono, and whether the serif for article bodies is worth licensing or
should be a free face like Newsreader.

---

## 8. What I need from you

Blocking phase 3 onward:

- **CV / resume** — roles, companies, dates, what you actually owned
- **Projects** — names, one-liners, stack, links, any images
- **One high-resolution portrait** — Acts 01 and 02 both live or die on this
- **Speaking photos** + event names, dates, venues
- **LinkedIn post URLs** you want featured
- **Medium / dev.to usernames**, and any existing posts to carry over
- **GitHub, LinkedIn, X handles**
- **City/country** — for the `Person` schema and local search
- **Contact preference** — form, or just a mailto?

Not blocking: I can build phases 1, 2 and 6 with placeholder content and swap
the real thing in.
