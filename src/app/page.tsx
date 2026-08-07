import Link from "next/link";

import { site, domains } from "@/lib/site";
import { roles, education, certifications } from "@/data/work";
import { getPosts, getProjects, formatMonth, formatDate } from "@/lib/content";
import { SectionLabel } from "@/components/SectionLabel";
import { TerminalBoot } from "@/components/home/TerminalBoot";
import { InferenceStage } from "@/webgl/InferenceStage";

/**
 * The home page.
 *
 * Structure mirrors PLAN.md §3 — prompt, tokenize, embed, denoise, generate.
 * Every act is real DOM; the WebGL canvas is fixed behind at z-index -1 and
 * reads scroll progress off these sections. Delete the canvas and this page is
 * still complete, readable and crawlable.
 */
export default function HomePage() {
  const posts = getPosts().slice(0, 3);
  const projects = getProjects().slice(0, 3);

  return (
    <>
      {/* The canvas layer. Mounts after hydration, never blocks paint. */}
      <InferenceStage />

      {/* ------------------------------------------------ ACT 00 — prompt */}
      <section
        className="ground-field relative min-h-[92svh] flex flex-col justify-center"
        data-act="prompt"
      >
        <div className="shell py-20">
          <TerminalBoot />

          <h1 className="t-display mt-10 text-[var(--color-terminal-bright)]">
            JAWAD
            <br />
            SHAHID
            <span className="text-[var(--color-amber)]">_</span>
          </h1>

          <p className="t-body mt-8 text-[var(--color-terminal-text)]">
            I build machine learning systems that run in production — ground
            operations optimisation in aviation, and clinical software in
            healthcare. Two domains where being wrong has consequences.
          </p>

          <ul className="t-label mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[var(--color-terminal-dim)]">
            <li>AWS Certified Solutions Architect</li>
            <li aria-hidden="true" className="text-[var(--color-amber)]">
              //
            </li>
            <li>
              Gold Medal, {education.institution}
            </li>
            <li aria-hidden="true" className="text-[var(--color-amber)]">
              //
            </li>
            <li>CGPA {education.cgpa}</li>
          </ul>
        </div>
      </section>

      {/* --------------------------------- ACT 01–03 — tokenize, embed, denoise
          These sections are mostly empty by design: they are the scroll runway
          the canvas animates against. The text in them is still real, and is
          what a crawler or a reduced-motion visitor reads. */}
      <section
        className="ground-field relative border-t border-[var(--color-terminal-rule)]"
        data-act="tokenize"
      >
        <div className="shell py-28 sm:py-40">
          <SectionLabel index="01" tone="terminal">
            Tokenize
          </SectionLabel>
          <p className="t-h2 max-w-[22ch] text-[var(--color-terminal-bright)]">
            A name is just text until something makes sense of it.
          </p>
        </div>
      </section>

      <section
        className="ground-field relative"
        data-act="embed"
        id="domains"
      >
        <div className="shell py-28 sm:py-40">
          <SectionLabel index="02" tone="terminal">
            Embed
          </SectionLabel>
          <p className="t-h2 max-w-[26ch] text-[var(--color-terminal-bright)]">
            Two clusters, because the work has two domains.
          </p>

          <div className="mt-14 grid gap-px sm:grid-cols-2 bg-[var(--color-terminal-rule)] border border-[var(--color-terminal-rule)]">
            {(["aviation", "healthcare"] as const).map((key) => {
              const d = domains[key];
              return (
                <Link
                  key={key}
                  href={`/${d.slug}`}
                  className="group ground-terminal p-8 sm:p-10 transition-colors hover:bg-[var(--color-terminal-raised)]"
                >
                  <p className="t-label text-[var(--color-amber)]">
                    {d.label}
                  </p>
                  <p className="t-h3 mt-4 text-[var(--color-terminal-bright)]">
                    {d.blurb}
                  </p>
                  <p className="t-body mt-4 text-[var(--color-terminal-dim)] text-[0.95rem]">
                    {d.description}
                  </p>
                  <p className="t-mono-sm mt-6 text-[var(--color-amber)]">
                    cd {d.slug}/{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="ground-field relative"
        data-act="denoise"
      >
        <div className="shell py-28 sm:py-40">
          <SectionLabel index="03" tone="terminal">
            Denoise
          </SectionLabel>
          <p className="t-h2 max-w-[24ch] text-[var(--color-terminal-bright)]">
            Everything starts as noise. The job is getting it to resolve.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ ACT 04 — generate
          The canvas steps back; documents take over. */}
      <section className="ground-paper" data-act="generate">
        <div className="shell py-24 sm:py-32">
          <div className="text-center max-w-[19ch] mx-auto">
            <p className="text-[clamp(1.75rem,4.6vw,3.15rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-balance">
              Models are easy. <span className="text-[var(--color-amber-ink)]">Production</span> is
              the job.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-[42ch] text-center text-[0.98rem] leading-relaxed text-[var(--color-muted)]">
            Three years of it, across aviation and healthcare — two domains where
            being wrong has consequences.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ selected work */}
      <section className="ground-paper border-t border-[var(--color-paper-rule)]">
        <div className="shell py-20 sm:py-24">
          <SectionLabel index="04">Selected work</SectionLabel>

          <ul>
            {roles.map((role) => (
              <li
                key={role.company}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-[var(--color-paper-rule)] py-6 last:border-b"
              >
                <h3 className="t-h3 text-[var(--color-ink)]">
                  {role.company}
                </h3>
                <p className="t-mono-sm text-[var(--color-muted)]">
                  {formatMonth(role.start)} — {formatMonth(role.end)}
                </p>
                <p className="col-span-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                  <span className="text-[var(--color-muted)]">{role.title} · </span>
                  {role.summary}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/work"
            className="t-mono-sm mt-8 inline-block text-[var(--color-amber-ink)] hover:underline underline-offset-4"
          >
            Full history →
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------- projects */}
      {projects.length > 0 && (
        <section className="ground-paper-raised">
          <div className="shell py-20 sm:py-24">
            <SectionLabel index="05">Projects</SectionLabel>
            <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-[var(--color-paper-rule)] border border-[var(--color-paper-rule)]">
              {projects.map((p) => (
                <li key={p.slug} className="ground-paper">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block h-full p-7 transition-colors hover:bg-[var(--color-paper-raised)]"
                  >
                    <p className="t-label text-[var(--color-amber-ink)]">
                      {p.domains.join(" · ")}
                    </p>
                    <h3 className="t-h3 mt-3 text-[var(--color-ink)]">{p.title}</h3>
                    <p className="mt-3 text-[0.93rem] leading-relaxed text-[var(--color-ink-body)]">
                      {p.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- writing */}
      {posts.length > 0 && (
        <section className="ground-paper">
          <div className="shell py-20 sm:py-24">
            <SectionLabel index="06">Writing</SectionLabel>
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
                    <h3 className="t-h3 text-[var(--color-ink)] group-hover:text-[var(--color-amber-ink)] transition-colors">
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
            <Link
              href="/writing"
              className="t-mono-sm mt-8 inline-block text-[var(--color-amber-ink)] hover:underline underline-offset-4"
            >
              All writing →
            </Link>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- credentials */}
      <section className="ground-paper-raised border-t border-[var(--color-paper-rule)]">
        <div className="shell py-20 sm:py-24">
          <SectionLabel index="07">Credentials</SectionLabel>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Certification", v: certifications[0].name },
              { k: "Degree", v: `${education.degree}, ${education.institution}` },
              { k: "Distinction", v: education.distinction },
              { k: "CGPA", v: education.cgpa },
            ].map((item) => (
              <div key={item.k}>
                <dt className="t-label text-[var(--color-muted)] mb-1">{item.k}</dt>
                <dd className="font-[family-name:var(--font-mono)] text-[1.02rem] tracking-[-0.02em] text-[var(--color-ink)]">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/specs"
            className="t-mono-sm mt-10 inline-block text-[var(--color-amber-ink)] hover:underline underline-offset-4"
          >
            Full tech specs →
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------ contact */}
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-24">
          <p className="t-h2 max-w-[20ch] text-[var(--color-terminal-bright)]">
            Working on something in aviation or healthcare?
          </p>
          <a
            href={`mailto:${site.email}`}
            className="t-mono-sm mt-6 inline-block text-[var(--color-amber)] hover:underline underline-offset-4"
          >
            {site.email} →
          </a>
        </div>
      </section>
    </>
  );
}
