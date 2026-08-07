import Link from "next/link";
import { nav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="ground-terminal min-h-[70svh] flex items-center">
      <div className="shell py-24">
        <div className="font-[family-name:var(--font-mono)] text-[0.9rem] leading-[1.9]">
          <p className="text-[var(--color-amber-ink)]">
            <span className="text-[var(--color-terminal-dim)]">jawad@shahid</span> ~
            % cat $REQUESTED_PATH
          </p>
          <p className="text-[var(--color-amber)]">
            cat: no such file or directory
          </p>
        </div>

        <h1 className="t-h1 mt-8 max-w-[16ch] text-[var(--color-terminal-bright)]">
          That page doesn&apos;t exist.
        </h1>

        <p className="t-body mt-6 text-[var(--color-terminal-text)]">
          Either it moved, or the link was wrong. These all work:
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <Link
              href="/"
              className="t-mono-sm text-[var(--color-amber)] hover:underline underline-offset-4"
            >
              Home
            </Link>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="t-mono-sm text-[var(--color-terminal-dim)] transition-colors hover:text-[var(--color-amber)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
