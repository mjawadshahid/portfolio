import { site, socials, nav } from "@/lib/site";

/**
 * The shell's command table.
 *
 * Kept as data rather than a switch so `help` and tab-completion are derived
 * from the same source the executor uses, there's no way for them to drift.
 */

export type Line =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string }
  | { kind: "accent"; text: string }
  | { kind: "error"; text: string };

export type CommandResult = {
  lines: Line[];
  /** Internal route to push. */
  navigate?: string;
  /** External URL to open in a new tab. */
  external?: string;
  clear?: boolean;
};

const SECTIONS = nav.map((n) => n.href.replace("/", ""));

const FILES: Record<string, string[]> = {
  "about.txt": [
    `${site.name} · ${site.role}`,
    "",
    "Three years building machine learning systems that run in production.",
    "Optimisation and scheduling, LLM systems with real evaluation, and the",
    "software around the model that makes it usable.",
    "",
    "Shipped in aviation ground operations and clinical healthcare, two",
    "industries where being wrong has consequences.",
  ],
  "education.txt": [
    "FAST NUCES, BS Software Engineering",
    "Gold Medal, 1st in class",
    "CGPA 3.88",
  ],
  "certs.txt": ["AWS Certified Solutions Architect"],
  "contact.txt": [
    site.email,
    socials.github,
    socials.linkedin,
  ],
};

export const COMMANDS = [
  "help",
  "ls",
  "cd",
  "cat",
  "whoami",
  "open",
  "clear",
  "pwd",
  "date",
] as const;

/** Everything tab-completion should consider, in one list. */
export function completions(input: string): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    return COMMANDS.filter((c) => c.startsWith(parts[0] ?? ""));
  }

  const [cmd, arg = ""] = parts;
  if (cmd === "cd") return SECTIONS.filter((s) => s.startsWith(arg));
  if (cmd === "cat") return Object.keys(FILES).filter((f) => f.startsWith(arg));
  if (cmd === "open") {
    return Object.keys(socials)
      .filter((k) => socials[k as keyof typeof socials])
      .filter((k) => k.startsWith(arg));
  }
  return [];
}

export function run(raw: string): CommandResult {
  const input = raw.trim();
  const echo: Line = { kind: "input", text: input };

  if (!input) return { lines: [echo] };

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args[0] ?? "";

  switch (cmd) {
    case "help":
      return {
        lines: [
          echo,
          { kind: "accent", text: "Available commands" },
          { kind: "output", text: "  ls              list sections" },
          { kind: "output", text: "  cd <section>    go to a section" },
          { kind: "output", text: "  cat <file>      read a file" },
          { kind: "output", text: "  open <site>     github, linkedin, medium, devto" },
          { kind: "output", text: "  whoami          short version" },
          { kind: "output", text: "  clear           clear the screen" },
          { kind: "output", text: "" },
          { kind: "output", text: "  Tab completes. ↑ ↓ walk history." },
        ],
      };

    case "ls":
      return {
        lines: [
          echo,
          { kind: "accent", text: SECTIONS.map((s) => `${s}/`).join("    ") },
          { kind: "output", text: Object.keys(FILES).join("    ") },
        ],
      };

    case "pwd":
      return { lines: [echo, { kind: "output", text: "~/jawadshahid.dev" }] };

    case "date":
      return {
        lines: [
          echo,
          { kind: "output", text: new Date().toUTCString() },
        ],
      };

    case "whoami":
      return {
        lines: [
          echo,
          {
            kind: "accent",
            text: "i'm an ai engineer · 3 years · production systems",
          },
        ],
      };

    case "cd": {
      if (!arg || arg === "~" || arg === "/") return { lines: [echo], navigate: "/" };
      const target = arg.replace(/\/$/, "");
      if (SECTIONS.includes(target)) {
        return {
          lines: [echo, { kind: "accent", text: `→ /${target}` }],
          navigate: `/${target}`,
        };
      }
      return {
        lines: [
          echo,
          { kind: "error", text: `cd: no such section: ${arg}` },
          { kind: "output", text: `try: ${SECTIONS.join(", ")}` },
        ],
      };
    }

    case "cat": {
      if (!arg) return { lines: [echo, { kind: "error", text: "cat: missing file" }] };
      const file = FILES[arg];
      if (!file) {
        return {
          lines: [
            echo,
            { kind: "error", text: `cat: ${arg}: no such file` },
            { kind: "output", text: `try: ${Object.keys(FILES).join(", ")}` },
          ],
        };
      }
      return {
        lines: [echo, ...file.map((text) => ({ kind: "output" as const, text }))],
      };
    }

    case "open": {
      const url = socials[arg as keyof typeof socials];
      if (!url) {
        return {
          lines: [
            echo,
            { kind: "error", text: `open: unknown: ${arg}` },
            {
              kind: "output",
              text: `try: ${Object.keys(socials).filter((k) => socials[k as keyof typeof socials]).join(", ")}`,
            },
          ],
        };
      }
      return { lines: [echo, { kind: "accent", text: `opening ${url}` }], external: url };
    }

    case "clear":
      return { lines: [], clear: true };

    case "sudo":
      return {
        lines: [echo, { kind: "error", text: "nice try" }],
      };

    default:
      return {
        lines: [
          echo,
          { kind: "error", text: `command not found: ${cmd}` },
          { kind: "output", text: "type `help`" },
        ],
      };
  }
}
