import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoist mutable references so vi.mock factories can access them ─────────
const { mockStreamText, mockRedisInstance } = vi.hoisted(() => {
  const mockRedisInstance = {
    get: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    set: vi.fn(),
  };
  const mockStreamText = vi.fn();
  return { mockStreamText, mockRedisInstance };
});

// ── Mock ai (streamText) ─────────────────────────────────────────────────
vi.mock("ai", () => ({
  streamText: mockStreamText,
}));

// ── Mock @upstash/redis ──────────────────────────────────────────────────
vi.mock("@upstash/redis", () => {
  // Use a proper class so `new Redis(...)` works
  class Redis {
    get = mockRedisInstance.get;
    incr = mockRedisInstance.incr;
    expire = mockRedisInstance.expire;
    set = mockRedisInstance.set;
  }
  return { Redis };
});

// ── import handler AFTER mocks ───────────────────────────────────────────
import { POST as handler } from "../chat.js";

// ── helpers ──────────────────────────────────────────────────────────────
function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "1.2.3.4",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeStreamResult() {
  // AI SDK v5 shape: an async-iterable `textStream` + a `usage` promise.
  async function* textStream() {
    yield "hello";
    yield " world";
  }
  return {
    textStream: textStream(),
    usage: Promise.resolve({ inputTokens: 100, outputTokens: 50, totalTokens: 150 }),
  };
}

// ── setup ─────────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();

  // Default: Redis returns null (no prior usage)
  mockRedisInstance.get.mockResolvedValue(null);
  mockRedisInstance.incr.mockResolvedValue(1);
  mockRedisInstance.expire.mockResolvedValue(1);
  mockRedisInstance.set.mockResolvedValue("OK");

  // Default: streamText succeeds
  mockStreamText.mockReturnValue(makeStreamResult());
});

// ── validation tests ──────────────────────────────────────────────────────
describe("handler — input validation", () => {
  it("returns 400 bad_request when body is missing", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{{",
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("bad_request");
  });

  it("returns 400 bad_request when visitorId is missing", async () => {
    const res = await handler(
      makeRequest({ messages: [{ role: "user", content: "hi" }] })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("bad_request");
  });

  it("returns 400 bad_request when messages is empty array", async () => {
    const res = await handler(
      makeRequest({ visitorId: "v1", messages: [] })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("bad_request");
  });

  it("returns 400 input_too_long when last user message exceeds 99 chars", async () => {
    const longContent = "a".repeat(100);
    const res = await handler(
      makeRequest({
        visitorId: "v1",
        messages: [{ role: "user", content: longContent }],
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("input_too_long");
  });

  it("returns 400 input_too_long for exactly 100 chars", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v1",
        messages: [{ role: "user", content: "x".repeat(100) }],
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("input_too_long");
  });

  it("accepts message of exactly 99 chars (boundary — should pass validation)", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v1",
        messages: [{ role: "user", content: "y".repeat(99) }],
      })
    );
    // Should NOT be 400 input_too_long (stream or other error is ok here)
    if (res.status === 400) {
      const json = await res.json();
      expect(json.error).not.toBe("input_too_long");
    }
  });
});

// ── rate-limit tests ──────────────────────────────────────────────────────
describe("handler — rate limiting", () => {
  it("returns 503 global_exhausted when daily token ceiling is hit", async () => {
    // daily tally >= ceiling (500000)
    mockRedisInstance.get.mockImplementation(async (key: string) => {
      if (key.startsWith("chat:global:tokens:")) return 500_000;
      return null;
    });

    const res = await handler(
      makeRequest({
        visitorId: "v1",
        messages: [{ role: "user", content: "hello" }],
      })
    );
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe("global_exhausted");
  });

  it("returns 429 visitor_exhausted when visitor hit the cap", async () => {
    mockRedisInstance.get.mockImplementation(async (key: string) => {
      if (key.startsWith("chat:visitor:")) return 5;
      return null;
    });

    const res = await handler(
      makeRequest({
        visitorId: "v-capped",
        messages: [{ role: "user", content: "hello" }],
      })
    );
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe("visitor_exhausted");
  });

  it("returns 429 visitor_exhausted when IP is at the cap (even if visitor is under)", async () => {
    mockRedisInstance.get.mockImplementation(async (key: string) => {
      if (key.startsWith("chat:ip:")) return 5;
      return null;
    });

    const res = await handler(
      makeRequest({
        visitorId: "v-new",
        messages: [{ role: "user", content: "hello" }],
      })
    );
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe("visitor_exhausted");
  });

  it("checks global budget before visitor limit", async () => {
    // Both global ceiling AND visitor cap hit — should return 503 (global checked first)
    mockRedisInstance.get.mockImplementation(async (key: string) => {
      if (key.startsWith("chat:global:tokens:")) return 600_000;
      if (key.startsWith("chat:visitor:")) return 5;
      return null;
    });

    const res = await handler(
      makeRequest({
        visitorId: "v1",
        messages: [{ role: "user", content: "hello" }],
      })
    );
    expect(res.status).toBe(503);
  });
});

// ── happy-path smoke test ─────────────────────────────────────────────────
describe("handler — happy path", () => {
  it("calls streamText and returns a streaming response", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v-happy",
        messages: [{ role: "user", content: "What did Chad build?" }],
      })
    );
    expect(mockStreamText).toHaveBeenCalledOnce();
    // Should NOT be an error status
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(429);
    expect(res.status).not.toBe(503);
  });

  it("passes the system prompt to streamText", async () => {
    await handler(
      makeRequest({
        visitorId: "v-happy",
        messages: [{ role: "user", content: "What did Chad build?" }],
      })
    );
    const [callArgs] = mockStreamText.mock.calls;
    expect(callArgs[0]).toHaveProperty("system");
    expect(callArgs[0].system).toContain("Chad Furman");
  });

  it("truncates history to MAX_HISTORY_MESSAGES", async () => {
    const manyMessages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `message ${i}`,
    }));

    await handler(
      makeRequest({
        visitorId: "v-happy",
        messages: manyMessages,
      })
    );

    const [callArgs] = mockStreamText.mock.calls;
    expect(callArgs[0].messages.length).toBeLessThanOrEqual(10);
  });
});
