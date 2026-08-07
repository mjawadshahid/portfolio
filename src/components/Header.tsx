import Link from "next/link";
import { nav, site } from "@/lib/site";

/**
 * Terminal window chrome. The three dots and the path are the cheapest way to
 * establish the register before anything else has loaded, and it's all static
 * HTML, so it costs nothing.
 */
export function Header() {
  return (
    <header className="ground-veil sticky top-0 z-40">
      <div className="shell flex items-center gap-3 py-3 sm:gap-4">
        <Link
          href="/"
          className="t-mono-sm shrink-0 text-[var(--color-terminal-dim)] transition-colors hover:text-[var(--color-amber)]"
        >
          {/* The full path is a nice touch, but it isn't worth a line of
              vertical space on a phone. */}
          <span className="hidden sm:inline">~/{site.url.replace("https://", "")}</span>
          <span className="sm:hidden">~/js</span>
        </Link>

        {/*
          One row, always. On narrow screens it scrolls horizontally rather
          than wrapping to three lines, no menu button, no JS, everything
          still reachable.
        */}
        <nav
          aria-label="Main"
          className="-mx-1 ml-auto min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max items-center gap-x-4 px-1 sm:gap-x-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="t-label whitespace-nowrap text-[var(--color-terminal-dim)] transition-colors hover:text-[var(--color-amber)]"
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
