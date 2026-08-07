import Link from "next/link";
import { nav, site, socialList } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Transparent, so the particle field carries on behind the footer instead
    // of the page ending in a flat slab.
    <footer className="ground-field border-t border-[var(--color-terminal-rule)]">
      <div className="shell py-14">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="t-h3 lowercase text-[var(--color-terminal-bright)]">
              {site.name}
            </p>
            <p className="keep-case t-mono-sm mt-2 text-[var(--color-terminal-dim)]">
              {site.role} · {site.location.city}, {site.location.country}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="t-mono-sm mt-4 inline-block text-[var(--color-amber)] hover:underline underline-offset-4"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="t-label text-[var(--color-terminal-dim)] mb-3">Pages</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-mono-sm text-[var(--color-terminal-text)] hover:text-[var(--color-amber)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-label text-[var(--color-terminal-dim)] mb-3">Elsewhere</p>
            <ul className="space-y-2">
              {socialList.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="t-mono-sm text-[var(--color-terminal-text)] hover:text-[var(--color-amber)] transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="t-mono-sm text-[var(--color-terminal-text)] hover:text-[var(--color-amber)] transition-colors"
                >
                  RSS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="t-mono-sm mt-12 pt-6 border-t border-[var(--color-terminal-rule)] text-[var(--color-terminal-dim)]">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
