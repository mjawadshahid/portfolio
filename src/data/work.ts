import type { Domain } from "@/lib/site";

export type Role = {
  company: string;
  title: string;
  start: string; // ISO yyyy-mm
  end: string | null; // null = current
  domains: Domain[];
  summary: string;
  /**
   * One bullet per thing you actually owned. Keep these concrete.
   * TODO(jawad): these need your real numbers — turnarounds per day,
   * assignment time cut, report volume, clinicians served. A bullet with a
   * figure in it is worth five without.
   */
  highlights: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    company: "Neural Lab",
    title: "AI Engineer",
    start: "2024-01", // TODO(jawad): confirm start date
    end: null,
    domains: ["aviation"],
    summary:
      "Ground operations handling platform for airport turnarounds, and the optimisation layer that assigns work to drivers in real time.",
    highlights: [
      "Built the AI task-to-driver assignment engine — matching ground handling tasks to available drivers under time, equipment and location constraints.",
      "Handles live reassignment when the ramp changes, so a delayed aircraft reshuffles downstream work automatically instead of by radio.",
      "Shipped the surrounding ground operations software that dispatchers and ramp crews use day to day.",
    ],
    stack: ["Python", "Optimisation", "AWS", "PostgreSQL", "TypeScript"],
  },
  {
    // TODO(jawad): company name, exact title and dates.
    company: "Healthcare engagements",
    title: "AI / Software Engineer",
    start: "2022-01",
    end: "2024-01",
    domains: ["healthcare"],
    summary:
      "AI and software for clinical and healthcare organisations — patient records, generated reporting, and decision support for clinicians.",
    highlights: [
      "Built patient management systems used by clinical organisations to run day-to-day operations.",
      "Developed AI that generates checkup reports from clinical inputs, cutting the writing burden on practitioners.",
      "Built assistive tooling for doctors and clinicians, designed so the model supports the decision rather than making it.",
    ],
    stack: ["Python", "LLMs", "React", "PostgreSQL", "AWS"],
  },
];

export const education = {
  institution: "FAST NUCES",
  degree: "BS Software Engineering",
  distinction: "Gold Medal — 1st in class",
  cgpa: "3.88",
  // TODO(jawad): confirm graduation year.
  end: "2022",
};

export const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    // TODO(jawad): issue date and credential URL, if you want it linked.
    url: "",
  },
];

export const currentRole = roles.find((r) => r.end === null) ?? roles[0];
