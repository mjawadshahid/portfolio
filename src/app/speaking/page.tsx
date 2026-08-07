import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getTalks, formatDate } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { SectionLabel } from "@/components/SectionLabel";
import { LinkedInFacade } from "@/components/LinkedInFacade";
import { pageMeta, talkSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Speaking",
  description:
    "Talks and events — on production machine learning, optimisation, and building AI for aviation and healthcare.",
  path: "/speaking",
});

export default function SpeakingPage() {
  const talks = getTalks();

  return (
    <>
      <section className="ground-terminal">
        <div className="shell py-20 sm:py-28">
          <p className="t-label text-[var(--color-amber)]">Speaking</p>
          <h1 className="t-h1 mt-5 max-w-[18ch] text-[var(--color-terminal-bright)]">
            Talks, and the arguments that came after.
          </h1>
        </div>
      </section>

      <section className="ground-paper">
        <div className="shell py-16 sm:py-20">
          {talks.length === 0 ? (
            <p className="t-body text-[var(--color-muted)]">
              Nothing listed yet.
            </p>
          ) : (
            talks.map((talk, i) => (
              <article
                key={talk.slug}
                className="mb-20 border-t border-[var(--color-paper-rule)] pt-10 last:mb-0"
              >
                <SectionLabel index={String(i + 1).padStart(2, "0")}>
                  {talk.event}
                </SectionLabel>

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="t-h2 max-w-[24ch] text-[var(--color-ink)]">
                    {talk.title}
                  </h2>
                  <p className="t-mono-sm text-[var(--color-muted)]">
                    <time dateTime={talk.date}>{formatDate(talk.date)}</time>
                    {talk.venue ? ` · ${talk.venue}` : ""}
                  </p>
                </div>

                {talk.photos.length > 0 && (
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                    {talk.photos.map((photo) => (
                      <li key={photo.src}>
                        <figure>
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={1200}
                            height={800}
                            className="h-auto w-full rounded border border-[var(--color-paper-rule)]"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          {photo.caption && (
                            <figcaption className="t-mono-sm mt-2 text-[var(--color-muted)]">
                              {photo.caption}
                            </figcaption>
                          )}
                        </figure>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="prose-article mt-8">
                  <MDXRemote source={talk.body} />
                </div>

                {talk.linkedin && (
                  <div className="mt-10">
                    <LinkedInFacade url={talk.linkedin} title={talk.title} />
                  </div>
                )}

                <JsonLd
                  data={talkSchema({
                    title: talk.title,
                    description: talk.description,
                    event: talk.event,
                    venue: talk.venue,
                    date: talk.date,
                  })}
                />
              </article>
            ))
          )}
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Speaking", path: "/speaking" },
        ])}
      />
    </>
  );
}
