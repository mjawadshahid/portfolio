"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Act 00 — the boot sequence.
 *
 * This is the LCP element and it is plain DOM text. The full sequence is
 * server-rendered in its finished state; JS only *re-plays* it as a typing
 * animation on load. That ordering matters: crawlers, no-JS visitors and
 * reduced-motion users all get the complete text immediately, and nothing here
 * blocks paint.
 */

const LINES = [
  { prompt: "whoami", out: "ai engineer · 3 years · production systems" },
  { prompt: "ls domains/", out: "aviation/    healthcare/" },
] as const;

const FINAL_PROMPT = "cat about.txt";

export function TerminalBoot() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    setPlaying(true);
    setStep(0);

    // Total sequence ~1.5s. Any longer and it stops being an entrance and
    // starts being a wait.
    const schedule = [420, 760, 1120, 1460];
    schedule.forEach((delay, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), delay));
    });

    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // When not playing (no JS, reduced motion, or after the sequence finishes)
  // every line is simply visible.
  const visible = (i: number) => !playing || step >= i;

  return (
    <div className="font-[family-name:var(--font-mono)] text-[0.82rem] leading-[1.9] sm:text-[0.9rem]">
      {LINES.map((line, i) => (
        <div key={line.prompt}>
          <div
            style={{ opacity: visible(i * 2) ? 1 : 0 }}
            className="text-[var(--color-amber-ink)] transition-opacity duration-200"
          >
            <span className="text-[var(--color-terminal-dim)]">jawad@shahid</span> ~ %{" "}
            {line.prompt}
          </div>
          <div
            style={{ opacity: visible(i * 2 + 1) ? 1 : 0 }}
            className="text-[var(--color-amber)] transition-opacity duration-200"
          >
            {line.out}
          </div>
        </div>
      ))}

      <div className="text-[var(--color-amber-ink)]">
        <span className="text-[var(--color-terminal-dim)]">jawad@shahid</span> ~ %{" "}
        {FINAL_PROMPT}
        <Cursor />
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-[3px] inline-block h-[1.05em] w-[0.55em] translate-y-[3px] bg-[var(--color-amber)] motion-safe:animate-[blink_1.1s_steps(1)_infinite]"
      style={{ boxShadow: "0 0 10px rgba(232,163,61,0.55)" }}
    />
  );
}
