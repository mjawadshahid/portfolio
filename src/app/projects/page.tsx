import type { Metadata } from "next";
import Link from "next/link";

import { getProjects } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description:
    "Things I've built: ground operations optimisation in aviation, clinical reporting and decision support in healthcare.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">Projects</p>
          <h1 className="t-h1 mt-5 max-w-[18ch] text-[var(--color-terminal-bright)]">
            Things that shipped, and what they had to survive.
          </h1>
        </div>
      </section>

      <section className="ground-paper">
        <div className="shell py-16 sm:py-20">
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <li
                key={p.slug}
                className="rounded-[2px] border border-[var(--color-paper-rule)]"
              >
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-[var(--color-paper-raised)]"
                >
                  <p className="t-label text-[var(--color-amber-ink)]">
                    {p.domains.join(" · ")}
                  </p>
                  <h2 className="keep-case t-h3 mt-4 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-amber-ink)]">
                    {p.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                    {p.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => (
                      <li
                        key={s}
                        className="keep-case t-mono-sm rounded-full border border-[var(--color-paper-rule)] px-2.5 py-0.5 text-[0.68rem] text-[var(--color-muted)]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />
    </>
  );
}
