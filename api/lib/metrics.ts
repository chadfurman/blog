// Marks the end of the answer text; the JSON metrics follow it in the same stream.
export const METRICS_SENTINEL = "\u001e";

// USD per token, from the AI Gateway model list (no markup).
const PRICES: Record<string, { input: number; output: number }> = {
  "anthropic/claude-haiku-5.5": { input: 1e-7, output: 5e-7 },
};

export type Metrics = {
  model: string;
  inputTokens: number;
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

export function buildMetrics(opts: {
  model: string;
  usage: Record<string, number> | undefined;
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
    outputTokens,
    costUsd,
    ttftMs: opts.ttftMs,
    serverMs: opts.serverMs,
  };
}
