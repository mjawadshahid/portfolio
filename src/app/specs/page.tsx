import type { Metadata } from "next";

import { specs } from "@/data/specs";
import { education, certifications } from "@/data/helpers";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Tech specs",
  description:
    "Stack, tools, cloud and domains — Python, PyTorch, LLM tooling, optimisation, AWS. The full specification sheet.",
  path: "/specs",
});

/**
 * Lifted from Apple's tech-specs pages. Reads as confidence rather than a
 * skills cloud, and quietly ranks for every tool name on it.
 */
export default function SpecsPage() {
  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">Tech specs</p>
          <h1 className="t-h1 mt-5 max-w-[16ch] text-[var(--color-terminal-bright)]">
            Everything I&apos;d be happy to be interviewed on.
          </h1>
          <p className="t-body mt-7 text-[var(--color-terminal-text)]">
            Not a skills cloud. If it&apos;s listed here, I&apos;ve shipped
            something with it.
          </p>
        </div>
      </section>

      <section className="ground-paper-raised">
        <div className="shell py-16 sm:py-20">
          {specs.map((group) => (
            <section key={group.label} className="mb-12 last:mb-0">
              <h2 className="t-label mb-5 flex items-center gap-3 text-[var(--color-amber-ink)]">
                <span>{group.label}</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-[var(--color-paper-rule)]"
                />
              </h2>

              <dl>
                {group.rows.map((row) => (
                  <div
                    key={row.key}
                    className="grid items-baseline gap-x-7 gap-y-1 border-t border-[var(--color-paper-rule)] py-4 last:border-b sm:grid-cols-[190px_1fr]"
                  >
                    <dt className="t-label text-[var(--color-muted)]">{row.key}</dt>
                    <dd
                      className={
                        row.emphasis
                          ? "text-[0.99rem] leading-relaxed font-medium text-[var(--color-ink)]"
                          : "text-[0.99rem] leading-relaxed text-[var(--color-ink-body)]"
                      }
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <section className="mt-14">
            <h2 className="t-label mb-5 flex items-center gap-3 text-[var(--color-amber-ink)]">
              <span>Credentials</span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[var(--color-paper-rule)]"
              />
            </h2>
            <dl>
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className="grid items-baseline gap-x-7 gap-y-1 border-t border-[var(--color-paper-rule)] py-4 sm:grid-cols-[190px_1fr]"
                >
                  <dt className="t-label text-[var(--color-muted)]">Certification</dt>
                  <dd className="text-[0.99rem] font-medium text-[var(--color-ink)]">
                    {c.name}
                  </dd>
                </div>
              ))}
              <div className="grid items-baseline gap-x-7 gap-y-1 border-t border-[var(--color-paper-rule)] py-4 sm:grid-cols-[190px_1fr]">
                <dt className="t-label text-[var(--color-muted)]">Education</dt>
                <dd className="text-[0.99rem] text-[var(--color-ink-body)]">
                  {education.degree}, {education.institution} —{" "}
                  {education.distinction}, CGPA {education.cgpa}
                </dd>
              </div>
              <div className="grid items-baseline gap-x-7 gap-y-1 border-y border-[var(--color-paper-rule)] py-4 sm:grid-cols-[190px_1fr]">
                <dt className="t-label text-[var(--color-muted)]">Languages</dt>
                <dd className="text-[0.99rem] text-[var(--color-ink-body)]">
                  {/* TODO(jawad): confirm — English, Urdu? */}
                  English, Urdu
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tech specs", path: "/specs" },
        ])}
      />
    </>
  );
}
