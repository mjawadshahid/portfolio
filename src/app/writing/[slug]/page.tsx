import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getPost, getPosts, formatDate, readingTime } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, articleSchema, breadcrumbSchema } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
}

/**
 * The one page on the site with no canvas and no spectacle. Reading is the
 * job, so the serif appears here and the WebGL layer stays out of the way.
 */
export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="ground-paper">
        <div className="shell-narrow py-16 sm:py-24">
          <p className="t-label text-[var(--color-amber-ink)]">
            <Link href="/writing" className="hover:underline underline-offset-4">
              Writing
            </Link>
          </p>

          <h1 className="keep-case t-h1 mt-6 text-[var(--color-ink)]">{post.title}</h1>

          <p className="t-mono-sm mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[var(--color-muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTime(post.body)} min read</span>
            {post.domains.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.domains.join(", ")}</span>
              </>
            )}
          </p>

          <hr className="my-10 border-[var(--color-paper-rule)]" />

          <div className="prose-article">
            <MDXRemote source={post.body} />
          </div>

          {post.crossposts && (
            <aside className="mt-16 border-t border-[var(--color-paper-rule)] pt-6">
              <p className="t-label mb-3 text-[var(--color-muted)]">
                Also published at
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {post.crossposts.medium && (
                  <li>
                    <a
                      href={post.crossposts.medium}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      className="t-mono-sm text-[var(--color-amber-ink)] hover:underline underline-offset-4"
                    >
                      Medium →
                    </a>
                  </li>
                )}
                {post.crossposts.devto && (
                  <li>
                    <a
                      href={post.crossposts.devto}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      className="t-mono-sm text-[var(--color-amber-ink)] hover:underline underline-offset-4"
                    >
                      dev.to →
                    </a>
                  </li>
                )}
              </ul>
              <p className="mt-3 text-[0.85rem] text-[var(--color-muted)]">
                Those copies point their canonical URL back here.
              </p>
            </aside>
          )}
        </div>
      </article>

      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/writing" },
            { name: post.title, path: `/writing/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}
