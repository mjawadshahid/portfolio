import type { Metadata } from "next";
import Link from "next/link";

import { roles, education, certifications, formatMonthSafe } from "@/data/helpers";
import { SectionLabel } from "@/components/SectionLabel";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Work",
  description:
    "Full working history — AI and software engineering across aviation ground operations and clinical healthcare systems.",
  path: "/work",
});

/** The conventional CV view, for people who screen that way. */
export default function WorkPage() {
  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">History</p>
          <h1 className="t-h1 mt-5 max-w-[18ch] text-[var(--color-terminal-bright)]">
            Where the three years actually went.
          </h1>
          <p className="t-body mt-7 text-[var(--color-terminal-text)]">
            the short version is on the{" "}
            <Link
              href="/"
              className="text-[var(--color-amber)] underline underline-offset-4"
            >
              home page
            </Link>
            ; this is everything, in order.
          </p>
        </div>
      </section>

      <section className="ground-paper">
        <div className="shell py-16 sm:py-20">
          <SectionLabel index="01">Roles</SectionLabel>

          {roles.map((role) => (
            <article
              key={role.company}
              className="border-t border-[var(--color-paper-rule)] py-9 last:border-b"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="keep-case t-h2 text-[var(--color-ink)]">{role.company}</h2>
                <p className="t-mono-sm text-[var(--color-muted)]">
                  {formatMonthSafe(role.start)} — {formatMonthSafe(role.end)}
                </p>
              </div>

              <p className="keep-case t-label mt-2 text-[var(--color-amber-ink)]">
                {role.title} · {role.domains.join(", ")}
              </p>

              <p className="t-body mt-5 text-[var(--color-ink-body)]">{role.summary}</p>

              <ul className="mt-5 space-y-3">
                {role.highlights.map((h) => (
                  <li
                    key={h}
                    className="grid grid-cols-[auto_1fr] gap-3 text-[0.96rem] leading-relaxed text-[var(--color-ink-body)]"
                  >
                    <span
                      aria-hidden="true"
                      className="t-mono-sm translate-y-[2px] text-[var(--color-amber-ink)]"
                    >
                      —
                    </span>
                    <span className="max-w-[64ch]">{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="ground-paper-raised">
        <div className="shell py-16 sm:py-20">
          <SectionLabel index="02">Education &amp; certification</SectionLabel>

          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            <div>
              <dt className="t-label mb-2 text-[var(--color-muted)]">Degree</dt>
              <dd className="keep-case font-[family-name:var(--font-mono)] text-[1.05rem] tracking-[-0.02em] text-[var(--color-ink)]">
                {education.degree}
                <span className="block text-[0.9rem] text-[var(--color-muted)] mt-1">
                  {education.institution} · {education.end}
                </span>
              </dd>
            </div>
            <div>
              <dt className="t-label mb-2 text-[var(--color-muted)]">Distinction</dt>
              <dd className="keep-case font-[family-name:var(--font-mono)] text-[1.05rem] tracking-[-0.02em] text-[var(--color-ink)]">
                {education.distinction}
                <span className="block text-[0.9rem] text-[var(--color-muted)] mt-1">
                  CGPA {education.cgpa}
                </span>
              </dd>
            </div>
            {certifications.map((c) => (
              <div key={c.name}>
                <dt className="t-label mb-2 text-[var(--color-muted)]">Certification</dt>
                <dd className="keep-case font-[family-name:var(--font-mono)] text-[1.05rem] tracking-[-0.02em] text-[var(--color-ink)]">
                  {c.name}
                  <span className="block text-[0.9rem] text-[var(--color-muted)] mt-1">
                    {c.issuer}
                  </span>
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

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />
    </>
  );
}
