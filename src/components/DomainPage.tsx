import Link from "next/link";

import { domains, type Domain } from "@/lib/site";
import { roles, formatMonthSafe } from "@/data/helpers";
import { projectsByDomain, postsByDomain, formatDate } from "@/lib/content";
import { SectionLabel } from "@/components/SectionLabel";

/**
 * The two domain landing pages. These are the site's real front doors and the
 * realistic SEO win — "aviation AI engineer" is a thin query with genuine
 * authority behind it, where "AI engineer" is unwinnable. See PLAN.md §4.
 */
export function DomainPage({ domain }: { domain: Domain }) {
  const d = domains[domain];
  const domainRoles = roles.filter((r) => r.domains.includes(domain));
  const projects = projectsByDomain(domain);
  const posts = postsByDomain(domain);

  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">{d.label}</p>
          <h1 className="t-h1 mt-5 max-w-[20ch] text-[var(--color-terminal-bright)]">
            {d.blurb}
          </h1>
          <p className="t-body mt-7 text-[var(--color-terminal-text)]">
            {d.description}
          </p>
        </div>
      </section>

      {domainRoles.length > 0 && (
        <section className="ground-paper">
          <div className="shell py-16 sm:py-20">
            <SectionLabel index="01">The work</SectionLabel>

            {domainRoles.map((role) => (
              <article key={role.company} className="mb-14 last:mb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="t-h2 text-[var(--color-ink)]">{role.company}</h2>
                  <p className="t-mono-sm text-[var(--color-muted)]">
                    {formatMonthSafe(role.start)} — {formatMonthSafe(role.end)}
                  </p>
                </div>
                <p className="t-label mt-2 text-[var(--color-amber-ink)]">
                  {role.title}
                </p>
                <p className="t-body mt-5 text-[var(--color-ink-body)]">
                  {role.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      className="grid grid-cols-[auto_1fr] gap-3 text-[0.96rem] leading-relaxed text-[var(--color-ink-body)]"
                    >
                      <span
                        aria-hidden="true"
                        className="t-mono-sm text-[var(--color-amber-ink)] translate-y-[2px]"
                      >
                        —
                      </span>
                      <span className="max-w-[64ch]">{h}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {role.stack.map((s) => (
                    <li
                      key={s}
                      className="t-mono-sm rounded-full border border-[var(--color-paper-rule)] px-3 py-1 text-[0.72rem] text-[var(--color-muted)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="ground-paper-raised border-t border-[var(--color-paper-rule)]">
          <div className="shell py-16 sm:py-20">
            <SectionLabel index="02">Projects</SectionLabel>
            <ul className="grid gap-px sm:grid-cols-2 bg-[var(--color-paper-rule)] border border-[var(--color-paper-rule)]">
              {projects.map((p) => (
                <li key={p.slug} className="ground-paper">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block h-full p-7 transition-colors hover:bg-[var(--color-paper-raised)]"
                  >
                    <h3 className="t-h3 text-[var(--color-ink)] group-hover:text-[var(--color-amber-ink)] transition-colors">
                      {p.title}
                    </h3>
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

      {posts.length > 0 && (
        <section className="ground-paper">
          <div className="shell py-16 sm:py-20">
            <SectionLabel index="03">Writing on {d.label.toLowerCase()}</SectionLabel>
            <ul>
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="border-t border-[var(--color-paper-rule)] last:border-b"
                >
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
                  >
                    <span className="t-h3 text-[var(--color-ink)] group-hover:text-[var(--color-amber-ink)] transition-colors">
                      {post.title}
                    </span>
                    <time dateTime={post.date} className="t-mono-sm text-[var(--color-muted)]">
                      {formatDate(post.date)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="ground-terminal">
        <div className="shell py-14 flex flex-wrap gap-x-8 gap-y-3">
          <Link
            href={domain === "aviation" ? "/healthcare" : "/aviation"}
            className="t-mono-sm text-[var(--color-amber)] hover:underline underline-offset-4"
          >
            → {domain === "aviation" ? "Healthcare" : "Aviation"}
          </Link>
          <Link
            href="/work"
            className="t-mono-sm text-[var(--color-terminal-dim)] hover:text-[var(--color-amber)] transition-colors"
          >
            → Full history
          </Link>
        </div>
      </section>
    </>
  );
}
