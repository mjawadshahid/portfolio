import Link from "next/link";

import { site, domainLabels } from "@/lib/site";
import { roles, education, certifications } from "@/data/work";
import { toolbox } from "@/data/toolbox";
import { getPosts, getProjects, formatMonth, formatDate } from "@/lib/content";
import { SectionLabel } from "@/components/SectionLabel";
import { Terminal } from "@/components/terminal/Terminal";
import { InferenceStage } from "@/webgl/InferenceStage";
import { ScatterGallery } from "@/components/effects/ScatterGallery";
import { StackGrid } from "@/components/effects/StackGrid";
import { Converge } from "@/components/effects/Converge";
import { KineticHeading } from "@/components/effects/KineticHeading";
import { Magnetic } from "@/components/effects/Magnetic";
import { TiltCard } from "@/components/effects/TiltCard";

/**
 * The home page.
 *
 * Opaque paper sections alternate with transparent field sections the whole
 * way down. Two attributes drive that:
 *
 *   data-act        which shape the canvas morphs to. These must appear in the
 *                   same order as ACTS in src/webgl/scrollState.ts, because
 *                   the shader chains its blends in that sequence; a later act
 *                   on an earlier section silently overwrites the earlier one.
 *   data-ground     marks a section as opaque. The field freezes underneath
 *                   rather than morphing where nobody can see it, so an act
 *                   on an opaque section would do nothing.
 *
 * Every act is real DOM. Delete src/webgl and this page is still complete,
 * readable and crawlable.
 */
export default function HomePage() {
  const posts = getPosts().slice(0, 3);
  const projects = getProjects();

  /*
    Section numbers count what actually renders. The writing and projects
    sections are conditional, so hardcoding them left gaps (06 followed by 08)
    the moment a collection was empty. JSX evaluates top to bottom and `&&`
    short-circuits, so a skipped section never takes a number.
  */
  let n = 0;
  const step = () => String(++n).padStart(2, "0");

  return (
    <>
      <InferenceStage />

      {/* ═══════════════════════════════════════════ hero, a working shell */}
      <section className="ground-field relative flex min-h-[94svh] flex-col justify-center">
        <div className="shell py-20">
          <Terminal />

          <h1 className="t-display mt-10 text-[var(--color-terminal-bright)]">
            jawad shahid
          </h1>

          <p className="t-body mt-8 text-[var(--color-terminal-text)]">
            {site.tagline} optimisation, llm systems, and the software that has
            to work when the model doesn&apos;t.
          </p>
        </div>
      </section>

      {/* ═════════════ 01 — what i do, shown rather than listed in a grid */}
      <ScatterGallery index={step()} label="what i do" />

      {/* ══════════════════════════════════════════ 02 — where it's run */}
      <section className="ground-paper" data-ground="paper">
        <div className="shell py-24 sm:py-32">
          <SectionLabel index={step()}>where it&apos;s run</SectionLabel>

          <KineticHeading
            as="h2"
            className="t-h2 max-w-[26ch] text-[var(--color-ink)]"
          >
            shipped into places where being wrong has consequences.
          </KineticHeading>

          <p className="t-body mt-7 text-[var(--color-ink-body)]">
            aviation ground operations and clinical healthcare. regulated,
            operational, and unforgiving of a demo that only works on the happy
            path.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════ 03 — the toolbox, as a wall */}
      <section className="ground-field relative" data-act="stream">
        <div className="shell py-24 sm:py-32">
          <SectionLabel index={step()} tone="terminal">
            toolbox
          </SectionLabel>
          <p className="t-h3 mb-12 max-w-[34ch] text-[var(--color-terminal-dim)]">
            hover one. what it&apos;s for matters more than that i&apos;ve
            touched it.
          </p>

          <StackGrid items={toolbox} />
        </div>
      </section>

      {/* ═══════════════════════ 04 — the join, work assembles from the sides */}
      <section className="ground-paper" data-ground="paper">
        <div className="shell overflow-hidden py-20 sm:py-24">
          <SectionLabel index={step()}>selected work</SectionLabel>

          <Converge>
            <ul className="space-y-10">
              {roles.map((role) => (
                <li
                  key={role.company}
                  data-converge
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2"
                >
                  <h3 className="keep-case t-h3 text-[var(--color-ink)]">
                    {role.company}
                  </h3>
                  <p className="keep-case t-mono-sm text-[var(--color-muted)]">
                    {formatMonth(role.start)} → {formatMonth(role.end)}
                  </p>
                  <p className="col-span-2 max-w-[64ch] text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                    <span className="keep-case text-[var(--color-muted)]">
                      {role.title} ·{" "}
                    </span>
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
          </Converge>

          <Magnetic>
            <Link
              href="/work"
              className="t-mono-sm mt-12 inline-block text-[var(--color-amber-ink)] underline-offset-4 hover:underline"
            >
              full history →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ════════════════════════════════════════════ 05 — denoise, the oval
          Deliberately near-empty. The portrait mass needs open frame to
          resolve into; when this act shared a section with content, opaque
          cards sat on top of it and you never saw it happen. */}
      <section
        className="ground-field relative flex min-h-[86svh] items-center"
        data-act="denoise"
      >
        <div className="shell py-24">
          <SectionLabel index={step()} tone="terminal">
            denoise
          </SectionLabel>
          <KineticHeading
            as="p"
            className="t-h2 max-w-[24ch] text-[var(--color-terminal-bright)]"
          >
            everything starts as noise. the job is getting it to resolve.
          </KineticHeading>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ 06 — the projects */}
      {projects.length > 0 && (
        <section className="ground-field relative" data-act="constellation">
          <div className="shell py-24 sm:py-32">
            <SectionLabel index={step()} tone="terminal">
              projects
            </SectionLabel>

            <ul className="grid gap-5 lg:grid-cols-2">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <TiltCard className="h-full overflow-hidden rounded-[2px] border border-[var(--color-terminal-rule)] bg-[var(--color-terminal-raised)]">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="flex h-full flex-col p-8"
                    >
                      <p className="t-mono-sm text-[var(--color-amber)]">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </p>
                      <h3 className="keep-case t-h3 mt-5 text-[var(--color-terminal-bright)]">
                        {p.title}
                      </h3>
                      <p className="mt-4 flex-1 text-[0.93rem] leading-relaxed text-[var(--color-terminal-dim)]">
                        {p.description}
                      </p>
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {p.stack.slice(0, 5).map((s) => (
                          <li
                            key={s}
                            className="keep-case t-mono-sm rounded-full border border-[var(--color-terminal-rule)] px-2.5 py-0.5 text-[0.66rem] text-[var(--color-terminal-dim)]"
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
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ 07 — writing */}
      {posts.length > 0 && (
        <section className="ground-paper" data-ground="paper">
          <div className="shell py-20 sm:py-24">
            <SectionLabel index={step()}>writing</SectionLabel>
            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1"
                  >
                    <h3 className="keep-case t-h3 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-amber-ink)]">
                      {post.title}
                    </h3>
                    <time
                      dateTime={post.date}
                      className="t-mono-sm text-[var(--color-muted)]"
                    >
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

      {/* ═══════════════════════════════════════════════ 08 — credentials */}
      <section className="ground-paper-raised" data-ground="paper">
        <div className="shell py-24 sm:py-32">
          <SectionLabel index={step()}>credentials</SectionLabel>

          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "certification", v: certifications[0].name },
              { k: "degree", v: `${education.degree}, ${education.institution}` },
              { k: "distinction", v: education.distinction },
              { k: "cgpa", v: education.cgpa },
            ].map((item) => (
              <div key={item.k}>
                <dt className="t-label mb-2 text-[var(--color-muted)]">
                  {item.k}
                </dt>
                {/* Proper nouns: degrees, awards, issuers. */}
                <dd className="keep-case font-[family-name:var(--font-mono)] text-[1.02rem] tracking-[-0.02em] text-[var(--color-ink)]">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ 09 — disperse */}
      <section className="ground-field relative" data-act="disperse">
        <div className="shell py-28 sm:py-40">
          <KineticHeading
            as="h2"
            className="t-h1 max-w-[18ch] text-[var(--color-terminal-bright)]"
          >
            building something that has to actually work?
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
            or type <span className="text-[var(--color-amber)]">open linkedin</span>{" "}
            up top
          </p>
        </div>
      </section>
    </>
  );
}
