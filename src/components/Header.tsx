import Link from "next/link";
import { nav, site } from "@/lib/site";

/**
 * Terminal window chrome. The three dots and the path are the cheapest way to
 * establish the register before anything else has loaded — and it's all static
 * HTML, so it costs nothing.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 ground-terminal border-b border-[var(--color-terminal-rule)] backdrop-blur-[2px]">
      <div className="shell flex items-center gap-4 py-3">
        <span className="flex gap-[6px]" aria-hidden="true">
          <i className="block h-[9px] w-[9px] rounded-full bg-[var(--color-terminal-rule)]" />
          <i className="block h-[9px] w-[9px] rounded-full bg-[var(--color-terminal-rule)]" />
          <i className="block h-[9px] w-[9px] rounded-full bg-[var(--color-terminal-rule)]" />
        </span>

        <Link
          href="/"
          className="t-mono-sm text-[var(--color-terminal-dim)] hover:text-[var(--color-amber)] transition-colors"
        >
          ~/{site.url.replace("https://", "")}
        </Link>

        <nav aria-label="Main" className="ml-auto">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 justify-end">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="t-label text-[var(--color-terminal-dim)] hover:text-[var(--color-amber)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
