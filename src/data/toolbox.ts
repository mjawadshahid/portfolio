/**
 * The toolbox, as a wall of tiles rather than a scrolling strip.
 *
 * Each entry carries a short note saying what it's actually for — a bare list
 * of logos tells a reader nothing, and "i've used redis" is worth less than
 * "queue and cache in front of the assignment engine".
 *
 * TODO(jawad): correct freely. Anything here should be something you'd be
 * happy to be interviewed on.
 */
export const toolbox = [
  { label: "python", note: "the default. services, models, pipelines" },
  { label: "typescript", note: "front ends and internal tooling" },
  { label: "pytorch", note: "training and fine-tuning" },
  { label: "hugging face", note: "model hosting, tokenizers, transformers" },
  { label: "llm apis", note: "anthropic and openai, in production paths" },
  { label: "rag", note: "retrieval, chunking, reranking, grounding" },
  { label: "vector search", note: "pgvector and friends" },
  { label: "evaluation", note: "harnesses, regression suites, human review" },
  { label: "or-tools", note: "constraint solving for assignment" },
  { label: "fastapi", note: "the service layer" },
  { label: "postgresql", note: "system of record" },
  { label: "redis", note: "queues and hot state" },
  { label: "aws", note: "certified solutions architect" },
  { label: "lambda + ecs", note: "batch and always-on workloads" },
  { label: "terraform", note: "infrastructure as code" },
  { label: "docker", note: "everything ships in one" },
  { label: "github actions", note: "ci, tests, deploys" },
  { label: "react + next.js", note: "dashboards and clinical tooling" },
  { label: "grafana", note: "when it breaks at 3am" },
  { label: "sentry", note: "and when it breaks quietly" },
] as const;
