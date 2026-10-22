import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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

  it("uses the gateway's haiku 5.5 model id by default", async () => {
    await handler(
      makeRequest({
        visitorId: "v-happy",
        messages: [{ role: "user", content: "What did Chad build?" }],
      })
    );
    const [callArgs] = mockStreamText.mock.calls;
    expect(callArgs[0].model).toBe("anthropic/claude-haiku-5.5");
  });

  it("logs model stream errors instead of swallowing them", async () => {
    await handler(
      makeRequest({
        visitorId: "v-happy",
        messages: [{ role: "user", content: "What did Chad build?" }],
      })
    );
    const [callArgs] = mockStreamText.mock.calls;
    expect(callArgs[0]).toHaveProperty("onError");
  });

  it("returns 502 model_error without leaking the raw error when the model yields no text", async () => {
    mockStreamText.mockImplementation((opts: { onError: (e: { error: unknown }) => void }) => {
      opts.onError({ error: new Error("gateway boom") });
      async function* empty() {}
      return { textStream: empty(), usage: Promise.resolve({}) };
    });
    const res = await handler(
      makeRequest({
        visitorId: "v-fail",
        messages: [{ role: "user", content: "hi" }],
      })
    );
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toBe("model_error");
    expect(JSON.stringify(json)).not.toContain("gateway boom");
  });

  it("saves the transcript of a failed request without an expiry", async () => {
    mockStreamText.mockImplementation(() => {
      async function* empty() {}
      return { textStream: empty(), usage: Promise.resolve({}) };
    });
    await handler(
      makeRequest({
        visitorId: "v-fail-saved",
        messages: [{ role: "user", content: "will this be kept?" }],
      })
    );
    const call = mockRedisInstance.set.mock.calls.find(([k]) =>
      (k as string).startsWith("chat:transcript:v-fail-saved:")
    );
    expect(call).toBeDefined();
    const payload = JSON.parse(call![1] as string);
    expect(payload.status).toBe(502);
    expect(payload.reason).toBe("model_error");
    expect(payload.messages[0].content).toBe("will this be kept?");
    expect(call![2]?.ex).toBeUndefined();
  });

  it("sends no metrics trailer unless the client opts in", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v-nometrics",
        messages: [{ role: "user", content: "hi" }],
      })
    );
    expect(await res.text()).toBe("hello world");
  });

  it("ends the stream with a metrics trailer after the answer", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v-metrics",
        metrics: true,
        messages: [{ role: "user", content: "hi" }],
      })
    );
    const body = await res.text();
    const [text, trailer] = body.split("\u001e");
    expect(text).toBe("hello world");
    const metrics = JSON.parse(trailer);
    expect(metrics).toMatchObject({
      model: "anthropic/claude-haiku-5.5",
      inputTokens: 100,
      systemTokens: 95,
      outputTokens: 50,
    });
    expect(metrics.costUsd).toBeCloseTo(0.000035, 9);
    expect(typeof metrics.ttftMs).toBe("number");
    expect(typeof metrics.serverMs).toBe("number");
  });

  it("still records usage when the client disconnects before the stream ends", async () => {
    const res = await handler(
      makeRequest({
        visitorId: "v-disconnect",
        messages: [{ role: "user", content: "hi" }],
      })
    );
    await res.body!.cancel();
    await new Promise((r) => setTimeout(r, 50));
    const bumped = mockRedisInstance.incr.mock.calls.some(([k]) =>
      (k as string).startsWith("chat:visitor:v-disconnect:")
    );
    expect(bumped).toBe(true);
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


// ── transcript logging: every request with a valid shape is kept ──────────
function savedTranscript(visitorId: string) {
  const call = mockRedisInstance.set.mock.calls.find(([k]) =>
    (k as string).startsWith(`chat:transcript:${visitorId}:`)
  );
  return call ? { payload: JSON.parse(call[1] as string), opts: call[2] } : undefined;
}

describe("handler — transcript logging", () => {
  it("saves input_too_long rejections with status and reason", async () => {
    await handler(
      makeRequest({
        visitorId: "v-long",
        messages: [{ role: "user", content: "a".repeat(100) }],
      })
    );
    const saved = savedTranscript("v-long");
    expect(saved?.payload).toMatchObject({ status: 400, reason: "input_too_long" });
  });

  it("saves global_exhausted rejections", async () => {
    mockRedisInstance.get.mockImplementation(async (key: string) =>
      key.startsWith("chat:global:tokens:") ? 500_000 : null
    );
    await handler(
      makeRequest({ visitorId: "v-glob", messages: [{ role: "user", content: "hi" }] })
    );
    expect(savedTranscript("v-glob")?.payload).toMatchObject({
      status: 503,
      reason: "global_exhausted",
    });
  });

  it("saves rate-limited rejections", async () => {
    mockRedisInstance.get.mockImplementation(async (key: string) =>
      key.startsWith("chat:visitor:") ? 5 : null
    );
    await handler(
      makeRequest({ visitorId: "v-rl", messages: [{ role: "user", content: "hi" }] })
    );
    expect(savedTranscript("v-rl")?.payload).toMatchObject({
      status: 429,
      reason: "visitor_exhausted",
    });
  });

  it("saves successful requests with status 200 and no expiry", async () => {
    const res = await handler(
      makeRequest({ visitorId: "v-ok", messages: [{ role: "user", content: "hi" }] })
    );
    await res.text();
    const saved = savedTranscript("v-ok");
    expect(saved?.payload.status).toBe(200);
    expect(saved?.payload.reason).toBeUndefined();
    expect(saved?.opts?.ex).toBeUndefined();
  });

  it("stops saving rejections for an IP past the daily rejection cap", async () => {
    mockRedisInstance.incr.mockResolvedValue(10_000);
    await handler(
      makeRequest({
        visitorId: "v-spam",
        messages: [{ role: "user", content: "a".repeat(100) }],
      })
    );
    expect(savedTranscript("v-spam")).toBeUndefined();
  });

  it("truncates long history messages in the saved transcript", async () => {
    await handler(
      makeRequest({
        visitorId: "v-trunc",
        messages: [
          { role: "assistant", content: "x".repeat(50_000) },
          { role: "user", content: "a".repeat(100) },
        ],
      })
    );
    const stored = savedTranscript("v-trunc")!.payload.messages;
    expect(stored[0].content.length).toBeLessThanOrEqual(2000);
  });

  it("does not save anything for bypass requests", async () => {
    process.env.CHAT_BYPASS_TOKEN = "tok";
    await handler(
      makeRequest(
        { visitorId: "v-byp", messages: [{ role: "user", content: "a".repeat(100) }] },
        { "x-chat-bypass": "tok" }
      )
    );
    delete process.env.CHAT_BYPASS_TOKEN;
    expect(savedTranscript("v-byp")).toBeUndefined();
  });
});

describe("handler — identifier validation", () => {
  it("rejects a visitorId that is too long or has odd characters without writing to redis", async () => {
    for (const visitorId of ["a".repeat(65), "bad id/with:chars"]) {
      const res = await handler(
        makeRequest({ visitorId, messages: [{ role: "user", content: "hi" }] })
      );
      expect(res.status).toBe(400);
    }
    expect(mockRedisInstance.set).not.toHaveBeenCalled();
    expect(mockRedisInstance.incr).not.toHaveBeenCalled();
  });

  it("stores 'unknown' when the forwarded IP isn't a valid address", async () => {
    await handler(
      makeRequest(
        { visitorId: "v-badip", messages: [{ role: "user", content: "a".repeat(100) }] },
        { "x-forwarded-for": "x".repeat(500) }
      )
    );
    const call = mockRedisInstance.set.mock.calls.find(([k]) =>
      (k as string).startsWith("chat:transcript:v-badip:")
    );
    expect(JSON.parse(call![1] as string).ip).toBe("unknown");
  });
});

// ── limit reset times ─────────────────────────────────────────────────────
describe("handler — limit reset times", () => {
  const NOW = new Date("2026-10-22T15:20:00.000Z");
  beforeEach(() => vi.useFakeTimers({ toFake: ["Date"], now: NOW }));
  afterEach(() => vi.useRealTimers());

  async function limited(getImpl: (key: string) => number | null) {
    mockRedisInstance.get.mockImplementation(async (key: string) => getImpl(key));
    return handler(
      makeRequest({ visitorId: "v-reset", messages: [{ role: "user", content: "hi" }] })
    );
  }

  it("resets at the top of the next UTC hour when the hourly cap is hit", async () => {
    const res = await limited((k) => (k.startsWith("chat:visitor:") ? 5 : null));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.resetAt).toBe("2026-10-22T16:00:00.000Z");
    expect(res.headers.get("Retry-After")).toBe("2400");
  });

  it("resets at the next UTC midnight when the daily cap is hit", async () => {
    const res = await limited((k) =>
      k.startsWith("chat:visitor:") ? (k.includes(":d:") ? 20 : 1) : null
    );
    const json = await res.json();
    expect(json.resetAt).toBe("2026-10-23T00:00:00.000Z");
  });

  it("resets at the next UTC midnight when the global budget is spent", async () => {
    const res = await limited((k) => (k.startsWith("chat:global:tokens:") ? 500_000 : null));
    expect(res.status).toBe(503);
    expect((await res.json()).resetAt).toBe("2026-10-23T00:00:00.000Z");
  });
});
