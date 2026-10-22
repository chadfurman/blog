// The chat API ends each answer with this marker followed by a JSON metrics blob.
export const METRICS_SENTINEL = "\u001e";

export interface AskMetrics {
  model: string;
  inputTokens: number;
  systemTokens: number;
  outputTokens: number;
  costUsd: number | null;
  ttftMs: number;
  serverMs: number;
  endToEndMs?: number;
}

export function splitMetrics(raw: string): { text: string; metrics: AskMetrics | null } {
  const cut = raw.indexOf(METRICS_SENTINEL);
  if (cut === -1) return { text: raw, metrics: null };
  try {
    return { text: raw.slice(0, cut), metrics: JSON.parse(raw.slice(cut + 1)) as AskMetrics };
  } catch {
    return { text: raw.slice(0, cut), metrics: null };
  }
}

export function formatCost(usd: number | null): string {
  if (usd === null) return "—";
  if (usd < 0.0001) return "<$0.0001";
  return `$${usd.toFixed(4)}`;
}

export function formatMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

export function shortModel(model: string): string {
  return model.replace(/^[^/]+\/(claude-)?/, "");
}
