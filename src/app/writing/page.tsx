import type { Metadata } from "next";
import Link from "next/link";

import { getPosts, formatDate, readingTime } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Writing",
  description:
    "Notes on production machine learning, optimisation, and building software for aviation and healthcare.",
  path: "/writing",
});

/**
 * The index is rendered as a token stream, each post title chipped, with an
 * index and a reading cost, the way a tokenizer visualiser shows you what a
 * model is actually looking at.
 */
export default function WritingPage() {
  const posts = getPosts();

  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">Writing</p>
          <h1 className="t-h1 mt-5 max-w-[20ch] text-[var(--color-terminal-bright)]">
            Things I worked out the hard way.
          </h1>
          <p className="t-body mt-7 text-[var(--color-terminal-text)]">
            Published here first. Anything you find on Medium or dev.to is a
            mirror, pointing its canonical back at this page.
          </p>
        </div>
      </section>

      <section className="ground-paper">
        <div className="shell py-16 sm:py-20">
          {posts.length === 0 ? (
            <p className="t-body text-[var(--color-muted)]">
              Nothing published yet. The first post is being written.
            </p>
          ) : (
            <ul>
              {posts.map((post, i) => (
                <li
                  key={post.slug}
                  
                >
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group grid gap-x-6 gap-y-2 py-7 sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                  >
                    <span className="t-mono-sm text-[var(--color-amber-ink)]">
                      [{String(i).padStart(2, "0")}]
                    </span>
                    <span>
                      <span className="keep-case t-h3 block text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-amber-ink)]">
                        {post.title}
                      </span>
                      <span className="mt-2 block max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--color-ink-body)]">
                        {post.description}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="t-mono-sm rounded-full border border-[var(--color-paper-rule)] px-2.5 py-0.5 text-[0.68rem] text-[var(--color-muted)]"
                            >
                              {t}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    <span className="t-mono-sm whitespace-nowrap text-[var(--color-muted)]">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span className="block sm:text-right">
                        {readingTime(post.body)} min
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
        ])}
      />
    </>
  );
}
