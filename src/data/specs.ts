/**
 * The tech specs sheet — lifted from Apple's product spec pages.
 * Reads as confidence rather than a skills cloud, and it quietly ranks for
 * every tool name on it.
 *
 * TODO(jawad): this is my best guess at your stack from what you've told me.
 * Correct it — anything on this page should be something you'd be happy to be
 * interviewed on.
 */

export type SpecGroup = {
  label: string;
  rows: { key: string; value: string; emphasis?: boolean }[];
};

export const specs: SpecGroup[] = [
  {
    label: "Languages",
    rows: [
      { key: "Primary", value: "Python", emphasis: true },
      { key: "Also", value: "TypeScript, SQL" },
    ],
  },
  {
    label: "AI / ML",
    rows: [
      { key: "Frameworks", value: "PyTorch, Hugging Face Transformers" },
      { key: "LLM tooling", value: "Retrieval-augmented generation, structured extraction, evaluation harnesses" },
      { key: "Serving", value: "Batch and real-time inference, model versioning" },
    ],
  },
  {
    label: "Optimisation",
    rows: [
      {
        key: "Applied to",
        value: "Task-to-driver assignment under time, equipment and location constraints",
        emphasis: true,
      },
      { key: "Behaviour", value: "Live reassignment as upstream conditions change" },
    ],
  },
  {
    label: "Cloud",
    rows: [
      { key: "Platform", value: "AWS — Certified Solutions Architect", emphasis: true },
      { key: "Services", value: "Lambda, ECS, S3, CloudFront, RDS, SQS" },
      { key: "Practice", value: "Infrastructure as code, CI/CD, cost and latency budgets" },
    ],
  },
  {
    label: "Data",
    rows: [
      { key: "Stores", value: "PostgreSQL, Redis, vector databases" },
      { key: "Pipelines", value: "Batch ETL, event-driven ingestion" },
    ],
  },
  {
    label: "Product",
    rows: [
      { key: "Front end", value: "React, Next.js, TypeScript" },
      { key: "Interfaces", value: "Operational dashboards, clinical tooling" },
    ],
  },
  {
    label: "Domains",
    rows: [
      { key: "Aviation", value: "Ground handling operations, turnaround coordination", emphasis: true },
      { key: "Healthcare", value: "Patient management, clinical reporting, decision support", emphasis: true },
    ],
  },
];
