import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getProject, getProjects, formatDate } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMeta({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    type: "article",
    publishedTime: project.date,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-16 sm:py-24">
          <p className="t-label text-[var(--color-amber)]">
            <Link href="/projects" className="hover:underline underline-offset-4">
              Projects
            </Link>
            <span className="mx-2 text-[var(--color-terminal-dim)]">/</span>
            {project.domains.join(", ")}
          </p>

          <h1 className="keep-case t-h1 mt-6 max-w-[20ch] text-[var(--color-terminal-bright)]">
            {project.title}
          </h1>

          <p className="t-body mt-6 text-[var(--color-terminal-text)]">
            {project.description}
          </p>
        </div>
      </section>

      {project.facts.length > 0 && (
        <section className="ground-paper-raised">
          <div className="shell py-10">
            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-3">
              {project.facts.map((f) => (
                <div key={f.key}>
                  <dt className="t-label mb-1 text-[var(--color-muted)]">{f.key}</dt>
                  <dd className="keep-case font-[family-name:var(--font-mono)] text-[0.98rem] tracking-[-0.02em] text-[var(--color-ink)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <article className="ground-paper">
        <div className="shell-narrow py-16 sm:py-20">
          <div className="prose-article">
            <MDXRemote source={project.body} />
          </div>

          <dl className="mt-14 grid gap-x-10 gap-y-5 border-t border-[var(--color-paper-rule)] pt-8 sm:grid-cols-2">
            <div>
              <dt className="t-label mb-2 text-[var(--color-muted)]">Role</dt>
              <dd className="keep-case text-[0.98rem] text-[var(--color-ink-body)]">
                {project.role}
              </dd>
            </div>
            <div>
              <dt className="t-label mb-2 text-[var(--color-muted)]">Stack</dt>
              <dd className="keep-case text-[0.98rem] text-[var(--color-ink-body)]">
                {project.stack.join(", ")}
              </dd>
            </div>
          </dl>

          {project.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="t-mono-sm text-[var(--color-amber-ink)] hover:underline underline-offset-4"
                  >
                    {l.label} →
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="t-mono-sm mt-10 text-[var(--color-muted)]">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
          </p>
        </div>
      </article>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
    </>
  );
}
