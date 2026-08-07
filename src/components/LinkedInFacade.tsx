"use client";

import { useState } from "react";

/**
 * Click-to-load LinkedIn embed.
 *
 * LinkedIn's official embed is a cross-origin iframe: heavy, cookie-setting,
 * and invisible to Google. Making it the content would mean the best proof of
 * your work doesn't rank and everyone pays its loading cost. So the talk
 * itself is real HTML on the page, and this renders only when someone asks
 * for it. See PLAN.md §5.
 */

/** Extracts the activity/share URN LinkedIn's embed endpoint needs. */
function embedUrl(postUrl: string): string | null {
  const urn = postUrl.match(/(?:activity|share|ugcPost)[-:](\d{15,})/);
  if (urn) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${urn[1]}`;
  }
  return null;
}

export function LinkedInFacade({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = embedUrl(url);

  // No parseable ID — fall back to a plain outbound link rather than an
  // iframe that would render an error page.
  if (!src) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="t-mono-sm inline-block text-[var(--color-amber-ink)] hover:underline underline-offset-4"
      >
        View the post on LinkedIn →
      </a>
    );
  }

  if (!loaded) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="t-mono-sm rounded-full border border-[var(--color-paper-rule)] bg-[var(--color-paper)] px-4 py-2 text-[var(--color-amber-ink)] transition-colors hover:bg-[var(--color-paper-raised)]"
        >
          Load the LinkedIn post
        </button>
        <p className="text-[0.82rem] text-[var(--color-muted)]">
          Loads an embed from LinkedIn, which sets their cookies.{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Open it there instead
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={`LinkedIn post — ${title}`}
      height={560}
      className="w-full max-w-[560px] rounded border border-[var(--color-paper-rule)]"
      loading="lazy"
      frameBorder="0"
      allowFullScreen
    />
  );
}
