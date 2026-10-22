import type { Message } from "./ratelimit.js";

// Marks the end of the answer text; the JSON metrics follow it in the same stream.
export const METRICS_SENTINEL = "\u001e";

// USD per token, from the AI Gateway model list (no markup).
const PRICES: Record<string, { input: number; output: number }> = {
  "anthropic/claude-haiku-5.5": { input: 1e-7, output: 5e-7 },
};

export type Metrics = {
  model: string;
  inputTokens: number; // billed total, system prompt included
  systemTokens: number; // estimated share of inputTokens that is the system prompt
  outputTokens: number;
  costUsd: number | null;
  ttftMs: number;
  serverMs: number;
};

export function normalizeUsage(usage: Record<string, number> | undefined) {
  const inputTokens = usage?.inputTokens ?? usage?.promptTokens ?? 0;
  const outputTokens = usage?.outputTokens ?? usage?.completionTokens ?? 0;
  return {
    inputTokens,
    outputTokens,
    totalTokens: usage?.totalTokens ?? inputTokens + outputTokens,
  };
}

// Rough count for the visitor's own messages: ~3.5 chars per token plus a few
// framing tokens per message. The system prompt is whatever the billed total
// has beyond this.
export function estimateTokens(messages: Message[]): number {
  return messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 3.5) + 4, 0);
}

export function buildMetrics(opts: {
  model: string;
  usage: Record<string, number> | undefined;
  userTokens: number;
  ttftMs: number;
  serverMs: number;
}): Metrics {
  const { inputTokens, outputTokens } = normalizeUsage(opts.usage);
  const price = PRICES[opts.model];
  const costUsd = price
    ? Math.round((inputTokens * price.input + outputTokens * price.output) * 1e8) / 1e8
    : null;
  return {
    model: opts.model,
    inputTokens,
    systemTokens: Math.max(0, inputTokens - opts.userTokens),
    outputTokens,
    costUsd,
    ttftMs: opts.ttftMs,
    serverMs: opts.serverMs,
  };
}
