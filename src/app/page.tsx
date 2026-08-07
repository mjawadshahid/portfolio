import Link from "next/link";

import { site, capabilities, domainLabels } from "@/lib/site";
import { roles, education, certifications } from "@/data/work";
import { toolbox } from "@/data/toolbox";
import { specs } from "@/data/specs";
import { getPosts, getProjects, formatMonth, formatDate } from "@/lib/content";
import { SectionLabel } from "@/components/SectionLabel";
import { Terminal } from "@/components/terminal/Terminal";
import { InferenceStage } from "@/webgl/InferenceStage";
import { Marquee } from "@/components/effects/Marquee";
import { HorizontalTrack } from "@/components/effects/HorizontalTrack";
import { KineticHeading } from "@/components/effects/KineticHeading";
import { Magnetic } from "@/components/effects/Magnetic";
import { TiltCard } from "@/components/effects/TiltCard";

/**
 * The home page.
 *
 * Dark WebGL bands are interleaved with paper document sections the whole way
 * down, so the field keeps reappearing rather than being hidden after the
 * hero. `data-act` marks which state the canvas should be in;
 * `data-ground="paper"` tells it to invert its palette rather than switch off.
 *
 * Every act is real DOM. Delete src/webgl and this page is still complete,
 * readable and crawlable.
 */
export default function HomePage() {
  const posts = getPosts().slice(0, 3);
  const projects = getProjects();

  return (
    <>
      <InferenceStage />

      {/* ═══════════════════════════════════════════ hero — a working shell */}
      <section className="ground-field relative flex min-h-[94svh] flex-col justify-center">
        <div className="shell py-20">
          <Terminal />

          <h1 className="t-display mt-10 text-[var(--color-terminal-bright)]">
            JAWAD
            <br />
            SHAHID
            <span className="text-[var(--color-amber)]">_</span>
          </h1>

          <p className="t-body mt-8 text-[var(--color-terminal-text)]">
            {site.tagline} Optimisation, LLM systems, and the software that has
            to work when the model doesn&apos;t.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ 01 — tokenize */}
      <section
        className="ground-field relative border-t border-[var(--color-terminal-rule)]"
        data-act="tokenize"
      >
        <div className="shell py-28 sm:py-36">
          <SectionLabel index="01" tone="terminal">
            What I do
          </SectionLabel>

          <KineticHeading
            as="h2"
            className="t-h2 max-w-[24ch] text-[var(--color-terminal-bright)]"
          >
            Anyone can get a model working. The job is keeping it working.
          </KineticHeading>

          <ul className="mt-16 grid gap-px border border-[var(--color-terminal-rule)] bg-[var(--color-terminal-rule)] sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <li key={c.key} className="ground-terminal p-8">
                <p className="t-mono-sm text-[var(--color-amber)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-h3 mt-4 text-[var(--color-terminal-bright)]">
                  {c.title}
                </h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-[var(--color-terminal-dim)]">
                  {c.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════════════════════════════════════ 02 — the toolbox marquee */}
      <section
        className="ground-field relative overflow-hidden border-y border-[var(--color-terminal-rule)] py-14"
        data-act="stream"
      >
        <div className="shell mb-8">
          <SectionLabel index="02" tone="terminal">
            Toolbox
          </SectionLabel>
        </div>

        <Marquee
          items={toolbox}
          direction={1}
          baseSpeed={0.5}
          className="text-[var(--color-terminal-bright)]"
        />
        <Marquee
          items={[...toolbox].reverse()}
          direction={-1}
          baseSpeed={0.35}
          className="mt-3 text-[var(--color-terminal-dim)]"
        />

        <p className="shell mt-10 t-mono-sm text-[var(--color-terminal-dim)]">
          Scroll harder — it reacts.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════ 03 — embed */}
      <section className="ground-field relative" data-act="embed">
        <div className="shell py-28 sm:py-36">
          <SectionLabel index="03" tone="terminal">
            Where it&apos;s run
          </SectionLabel>

          <KineticHeading
            as="h2"
            className="t-h2 max-w-[26ch] text-[var(--color-terminal-bright)]"
          >
            Shipped into places where being wrong has consequences.
          </KineticHeading>

          <p className="t-body mt-7 text-[var(--color-terminal-dim)]">
            Aviation ground operations and clinical healthcare — regulated,
            operational, and unforgiving of a demo that only works on the happy
            path.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ paper: the work */}
      <section className="ground-paper" data-ground="paper">
        <div className="shell py-20 sm:py-24">
          <SectionLabel index="04">Selected work</SectionLabel>

          <ul>
            {roles.map((role) => (
              <li
                key={role.company}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-[var(--color-paper-rule)] py-7 last:border-b"
              >
                <h3 className="t-h3 text-[var(--color-ink)]">{role.company}</h3>
                <p className="t-mono-sm text-[var(--color-muted)]">
                  {formatMonth(role.start)} — {formatMonth(role.end)}
                </p>
                <p className="col-span-2 max-w-[64ch] text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                  <span className="text-[var(--color-muted)]">{role.title} · </span>
                  {role.summary}
                </p>
                <ul className="col-span-2 mt-1 flex flex-wrap gap-2">
                  {role.domains.map((d) => (
                    <li
                      key={d}
                      className="t-mono-sm rounded-full border border-[var(--color-paper-rule)] px-2.5 py-0.5 text-[0.66rem] text-[var(--color-muted)]"
                    >
                      {domainLabels[d]}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <Magnetic>
            <Link
              href="/work"
              className="t-mono-sm mt-9 inline-block text-[var(--color-amber-ink)] underline-offset-4 hover:underline"
            >
              Full history →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ═══════════════════════════════ 05 — pinned horizontal project track */}
      {projects.length > 0 && (
        <section className="ground-field relative border-y border-[var(--color-terminal-rule)]">
          <div className="shell pt-20">
            <SectionLabel index="05" tone="terminal">
              Projects
            </SectionLabel>
            <p className="t-h3 max-w-[30ch] text-[var(--color-terminal-bright)]">
              Keep scrolling — this one goes sideways.
            </p>
          </div>

          <HorizontalTrack>
            {projects.map((p, i) => (
              <TiltCard
                key={p.slug}
                className="w-[min(78vw,420px)] shrink-0 overflow-hidden rounded-sm border border-[var(--color-terminal-rule)] bg-[var(--color-terminal-raised)]"
              >
                <Link href={`/projects/${p.slug}`} className="flex h-full flex-col p-8">
                  <p className="t-mono-sm text-[var(--color-amber)]">
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </p>
                  <h3 className="t-h3 mt-5 text-[var(--color-terminal-bright)]">
                    {p.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[0.93rem] leading-relaxed text-[var(--color-terminal-dim)]">
                    {p.description}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => (
                      <li
                        key={s}
                        className="t-mono-sm rounded-full border border-[var(--color-terminal-rule)] px-2.5 py-0.5 text-[0.66rem] text-[var(--color-terminal-dim)]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="t-mono-sm mt-6 text-[var(--color-amber)]">
                    open →
                  </p>
                </Link>
              </TiltCard>
            ))}

            <div className="flex w-[min(70vw,340px)] shrink-0 items-center px-8">
              <Magnetic>
                <Link
                  href="/projects"
                  className="t-h3 text-[var(--color-amber)] underline-offset-8 hover:underline"
                >
                  All projects →
                </Link>
              </Magnetic>
            </div>
          </HorizontalTrack>
        </section>
      )}

      {/* ════════════════════════════════════════════════════ 06 — denoise */}
      <section className="ground-field relative" data-act="denoise">
        <div className="shell py-28 sm:py-40">
          <SectionLabel index="06" tone="terminal">
            Denoise
          </SectionLabel>
          <KineticHeading
            as="p"
            className="t-h2 max-w-[24ch] text-[var(--color-terminal-bright)]"
          >
            Everything starts as noise. The job is getting it to resolve.
          </KineticHeading>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════ paper: the stack */}
      <section className="ground-paper-raised" data-ground="paper">
        <div className="shell py-20 sm:py-24">
          <SectionLabel index="07">The stack, in detail</SectionLabel>

          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {specs.slice(0, 6).map((group) => (
              <div key={group.label}>
                <dt className="t-label mb-3 text-[var(--color-amber-ink)]">
                  {group.label}
                </dt>
                <dd className="space-y-1.5">
                  {group.rows.map((row) => (
                    <p
                      key={row.key}
                      className="text-[0.92rem] leading-relaxed text-[var(--color-ink-body)]"
                    >
                      {row.value}
                    </p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <Magnetic>
            <Link
              href="/specs"
              className="t-mono-sm mt-10 inline-block text-[var(--color-amber-ink)] underline-offset-4 hover:underline"
            >
              Full tech specs →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ paper: writing */}
      {posts.length > 0 && (
        <section className="ground-paper" data-ground="paper">
          <div className="shell py-20 sm:py-24">
            <SectionLabel index="08">Writing</SectionLabel>
            <ul>
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="border-t border-[var(--color-paper-rule)] last:border-b"
                >
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6"
                  >
                    <h3 className="t-h3 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-amber-ink)]">
                      {post.title}
                    </h3>
                    <time dateTime={post.date} className="t-mono-sm text-[var(--color-muted)]">
                      {formatDate(post.date)}
                    </time>
                    <p className="col-span-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                      {post.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════ 09 — constellation */}
      <section
        className="ground-field relative border-t border-[var(--color-terminal-rule)]"
        data-act="constellation"
      >
        <div className="shell py-24 sm:py-32">
          <SectionLabel index="09" tone="terminal">
            Credentials
          </SectionLabel>

          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Certification", v: certifications[0].name },
              { k: "Degree", v: `${education.degree}, ${education.institution}` },
              { k: "Distinction", v: education.distinction },
              { k: "CGPA", v: education.cgpa },
            ].map((item) => (
              <div key={item.k}>
                <dt className="t-label mb-2 text-[var(--color-terminal-dim)]">
                  {item.k}
                </dt>
                <dd className="font-[family-name:var(--font-mono)] text-[1.02rem] tracking-[-0.02em] text-[var(--color-terminal-bright)]">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ 10 — disperse */}
      <section className="ground-field relative" data-act="disperse">
        <div className="shell py-28 sm:py-40">
          <KineticHeading
            as="h2"
            className="t-h1 max-w-[18ch] text-[var(--color-terminal-bright)]"
          >
            Building something that has to actually work?
          </KineticHeading>

          <Magnetic strength={0.28}>
            <a
              href={`mailto:${site.email}`}
              className="t-h3 mt-8 inline-block text-[var(--color-amber)] underline-offset-8 hover:underline"
            >
              {site.email} →
            </a>
          </Magnetic>

          <p className="t-mono-sm mt-8 text-[var(--color-terminal-dim)]">
            or type <span className="text-[var(--color-amber)]">open linkedin</span> up top
          </p>
        </div>
      </section>
    </>
  );
}
