import { describe, it, expect } from "vitest";
import { buildMetrics, estimateTokens, normalizeUsage } from "../metrics.js";

describe("normalizeUsage", () => {
  it("reads AI SDK v5 field names", () => {
    expect(normalizeUsage({ inputTokens: 100, outputTokens: 50, totalTokens: 150 })).toEqual({
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    });
  });

  it("falls back to prompt/completion names and derives the total", () => {
    expect(normalizeUsage({ promptTokens: 7, completionTokens: 3 })).toEqual({
      inputTokens: 7,
      outputTokens: 3,
      totalTokens: 10,
    });
  });

  it("returns zeros when usage is missing", () => {
    expect(normalizeUsage(undefined)).toEqual({ inputTokens: 0, outputTokens: 0, totalTokens: 0 });
  });
});

describe("buildMetrics", () => {
  it("prices haiku 5.5 at $0.10/M input and $0.50/M output", () => {
    const m = buildMetrics({
      model: "anthropic/claude-haiku-5.5",
      usage: { inputTokens: 1000, outputTokens: 500 },
      userTokens: 100,
      ttftMs: 420,
      serverMs: 1500,
    });
    expect(m).toEqual({
      model: "anthropic/claude-haiku-5.5",
      inputTokens: 1000,
      systemTokens: 900,
      outputTokens: 500,
      costUsd: 0.00035,
      ttftMs: 420,
      serverMs: 1500,
    });
  });

  it("reports a null cost for a model with no known price", () => {
    const m = buildMetrics({
      model: "someone/unpriced-model",
      usage: { inputTokens: 10, outputTokens: 10 },
      userTokens: 4,
      ttftMs: 1,
      serverMs: 2,
    });
    expect(m.costUsd).toBeNull();
  });
});

describe("buildMetrics system tokens", () => {
  it("never reports negative system tokens when the estimate overshoots", () => {
    const m = buildMetrics({
      model: "anthropic/claude-haiku-5.5",
      usage: { inputTokens: 50, outputTokens: 5 },
      userTokens: 80,
      ttftMs: 1,
      serverMs: 2,
    });
    expect(m.systemTokens).toBe(0);
  });
});

describe("estimateTokens", () => {
  it("estimates about 3.5 characters per token plus 4 framing tokens per message", () => {
    expect(
      estimateTokens([
        { role: "user", content: "a".repeat(35) },
        { role: "assistant", content: "b".repeat(70) },
      ])
    ).toBe(10 + 4 + 20 + 4);
  });
});
