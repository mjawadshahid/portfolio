import Link from "next/link";
import { nav, site, socialList } from "@/lib/site";

/**
 * Opaque paper, matching the other document sections.
 *
 * `data-ground="paper"` freezes the particle field underneath rather than
 * letting it morph behind something nobody can see through.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ground-paper-raised" data-ground="paper">
      <div className="shell py-16">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="t-h3 text-[var(--color-ink)]">{site.name}</p>
            {/* Role and place are proper nouns. */}
            <p className="keep-case t-mono-sm mt-2 text-[var(--color-muted)]">
              {site.role} · {site.location.city}, {site.location.country}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="t-mono-sm mt-4 inline-block text-[var(--color-amber-ink)] underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="t-label mb-3 text-[var(--color-muted)]">pages</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-mono-sm text-[var(--color-ink-body)] transition-colors hover:text-[var(--color-amber-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-label mb-3 text-[var(--color-muted)]">elsewhere</p>
            <ul className="space-y-2">
              {socialList.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="t-mono-sm text-[var(--color-ink-body)] transition-colors hover:text-[var(--color-amber-ink)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="t-mono-sm text-[var(--color-ink-body)] transition-colors hover:text-[var(--color-amber-ink)]"
                >
                  rss
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="t-mono-sm mt-12 text-[var(--color-muted)]">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
