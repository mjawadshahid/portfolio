/**
 * The toolbox, as a wall of tiles rather than a scrolling strip.
 *
 * Labels keep their real capitalisation — they're product names. The site is
 * lowercase by default (see `body` in globals.css), so these render through
 * `.keep-case`. The notes are prose and stay lowercase.
 *
 * TODO(jawad): correct freely. Anything here should be something you'd be
 * happy to be interviewed on.
 */
export const toolbox = [
  { label: "Python", note: "the default. services, models, pipelines" },
  { label: "TypeScript", note: "front ends and internal tooling" },
  { label: "PyTorch", note: "training and fine-tuning" },
  { label: "Hugging Face", note: "model hosting, tokenizers, transformers" },
  { label: "LLM APIs", note: "anthropic and openai, in production paths" },
  { label: "RAG", note: "retrieval, chunking, reranking, grounding" },
  { label: "Vector search", note: "pgvector and friends" },
  { label: "Evaluation", note: "harnesses, regression suites, human review" },
  { label: "OR-Tools", note: "constraint solving for assignment" },
  { label: "FastAPI", note: "the service layer" },
  { label: "PostgreSQL", note: "system of record" },
  { label: "Redis", note: "queues and hot state" },
  { label: "AWS", note: "certified solutions architect" },
  { label: "Lambda + ECS", note: "batch and always-on workloads" },
  { label: "Terraform", note: "infrastructure as code" },
  { label: "Docker", note: "everything ships in one" },
  { label: "GitHub Actions", note: "ci, tests, deploys" },
  { label: "React + Next.js", note: "dashboards and clinical tooling" },
  { label: "Grafana", note: "when it breaks at 3am" },
  { label: "Sentry", note: "and when it breaks quietly" },
] as const;
