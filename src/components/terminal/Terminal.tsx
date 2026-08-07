"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { run, completions, type Line } from "./commands";

/**
 * A working shell in the hero.
 *
 * The boot output is server-rendered (see TerminalBoot) so crawlers and no-JS
 * visitors get the content; this takes over on hydration and adds the input.
 * `cd work` actually navigates, `open github` actually opens, tab completes,
 * arrows walk history.
 */

const BOOT: Line[] = [
  { kind: "input", text: "whoami" },
  { kind: "accent", text: "i'm an ai engineer · 3 years · production systems" },
  { kind: "input", text: "ls" },
  { kind: "accent", text: "work/    projects/    writing/    speaking/    specs/" },
  { kind: "output", text: "type `help` — this one actually works" },
];

export function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view without scrolling the page itself.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = useCallback(
    (raw: string) => {
      const result = run(raw);

      if (result.clear) {
        setLines([]);
      } else {
        setLines((prev) => [...prev, ...result.lines]);
      }

      if (raw.trim()) {
        setHistory((prev) => [raw.trim(), ...prev].slice(0, 50));
      }
      setHistoryIndex(-1);
      setValue("");

      if (result.external) {
        window.open(result.external, "_blank", "noopener,noreferrer");
      }
      if (result.navigate) {
        // Let the line render before the route changes.
        setTimeout(() => router.push(result.navigate as string), 220);
      }
    },
    [router]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const matches = completions(value);
      if (matches.length === 1) {
        const parts = value.split(/\s+/);
        parts[parts.length - 1] = matches[0];
        setValue(parts.join(" "));
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { kind: "input", text: value },
          { kind: "output", text: matches.join("    ") },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (next >= 0) {
        setHistoryIndex(next);
        setValue(history[next]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  };

  return (
    <div
      className="group cursor-text font-[family-name:var(--font-mono)] text-[0.72rem] leading-[1.85] sm:text-[0.88rem]"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="max-h-[42svh] overflow-y-auto pr-2 [scrollbar-width:thin]"
        data-lenis-prevent
      >
        {lines.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}

        <div className="flex items-center gap-[0.5ch]">
          <Prompt />
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input. Try: help, ls, cd work"
              className="w-full bg-transparent text-[var(--color-amber)] caret-transparent outline-none"
            />
            {/*
              Block caret sitting after the typed text.

              It blinks whether or not the input is focused — an unlit caret
              reads as a dead decoration, and the blink is what tells people
              the terminal is something they can actually type into. Focus
              only changes its brightness. Reduced motion stops it via the
              global rule in globals.css.
            */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 animate-[blink_1.1s_steps(1)_infinite] bg-[var(--color-amber)]"
              style={{
                left: `${value.length}ch`,
                width: "0.55em",
                height: "1.05em",
                boxShadow: "0 0 10px rgba(232,163,61,0.55)",
                filter: focused ? "none" : "brightness(0.6)",
              }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[0.62rem] tracking-[0.14em] text-[var(--color-terminal-dim)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-[0.66rem]">
        CLICK TO TYPE · TAB COMPLETES · ↑ FOR HISTORY
      </p>
    </div>
  );
}

function Prompt() {
  return (
    <span className="shrink-0 text-[var(--color-amber-ink)]">
      <span className="text-[var(--color-terminal-dim)]">jawad@shahid</span> ~ %
    </span>
  );
}

function TerminalLine({ line }: { line: Line }) {
  if (line.kind === "input") {
    return (
      <div className="text-[var(--color-amber-ink)]">
        <span className="text-[var(--color-terminal-dim)]">jawad@shahid</span> ~ %{" "}
        {line.text}
      </div>
    );
  }
  if (line.kind === "accent") {
    return <div className="text-[var(--color-amber)]">{line.text}</div>;
  }
  if (line.kind === "error") {
    return <div className="text-[#E06C5B]">{line.text}</div>;
  }
  return (
    <div className="whitespace-pre-wrap text-[var(--color-terminal-text)]">
      {line.text || " "}
    </div>
  );
}
