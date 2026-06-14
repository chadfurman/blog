import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Redis } from "@upstash/redis";

// ── mock helpers ───────────────────────────────────────────────────────────
function makeRedis(overrides: Partial<Record<string, unknown>> = {}): Redis {
  const store: Record<string, number | string> = {};

  const redis = {
    get: vi.fn(async (key: string) => {
      if (key in overrides) return overrides[key] as number | null;
      return (store[key] ?? null) as number | null;
    }),
    incr: vi.fn(async (key: string) => {
      const cur = (store[key] as number) ?? 0;
      store[key] = cur + 1;
      return store[key] as number;
    }),
    expire: vi.fn(async () => 1),
    set: vi.fn(async (key: string, value: unknown, opts?: unknown) => {
      store[key] = value as string;
      return "OK";
    }),
  } as unknown as Redis;

  return redis;
}

// ── imports after mocking ─────────────────────────────────────────────────
import {
  checkVisitorLimit,
  checkGlobalBudget,
  checkIpLimit,
  recordUsage,
} from "../ratelimit.js";

const MAX_VISITOR_MESSAGES = 5;
const DAILY_TOKEN_CEILING = 500_000;

describe("checkVisitorLimit", () => {
  it("allows when count is 0 (no prior messages)", async () => {
    const redis = makeRedis();
    const result = await checkVisitorLimit("visitor-abc", redis);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(0);
  });

  it("allows when count is 4 (one under cap)", async () => {
    const redis = makeRedis({ "chat:visitor:visitor-abc:count": 4 });
    const result = await checkVisitorLimit("visitor-abc", redis);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(4);
  });

  it("blocks when count is 5 (at cap)", async () => {
    const redis = makeRedis({ "chat:visitor:visitor-abc:count": 5 });
    const result = await checkVisitorLimit("visitor-abc", redis);
    expect(result.allowed).toBe(false);
    expect(result.count).toBe(5);
  });

  it("blocks when count is above 5", async () => {
    const redis = makeRedis({ "chat:visitor:visitor-abc:count": 10 });
    const result = await checkVisitorLimit("visitor-abc", redis);
    expect(result.allowed).toBe(false);
  });
});

describe("checkGlobalBudget", () => {
  it("allows when tally is 0", async () => {
    const redis = makeRedis();
    const result = await checkGlobalBudget(redis);
    expect(result.allowed).toBe(true);
    expect(result.tokensUsed).toBe(0);
  });

  it("allows when tally is under ceiling", async () => {
    const redis = makeRedis({ [`chat:global:tokens:${utcDate()}`]: 100_000 });
    const result = await checkGlobalBudget(redis);
    expect(result.allowed).toBe(true);
    expect(result.tokensUsed).toBe(100_000);
  });

  it("blocks when tally equals ceiling", async () => {
    const redis = makeRedis({
      [`chat:global:tokens:${utcDate()}`]: DAILY_TOKEN_CEILING,
    });
    const result = await checkGlobalBudget(redis);
    expect(result.allowed).toBe(false);
    expect(result.tokensUsed).toBe(DAILY_TOKEN_CEILING);
  });

  it("blocks when tally exceeds ceiling", async () => {
    const redis = makeRedis({
      [`chat:global:tokens:${utcDate()}`]: DAILY_TOKEN_CEILING + 1,
    });
    const result = await checkGlobalBudget(redis);
    expect(result.allowed).toBe(false);
  });
});

describe("checkIpLimit (amendment: per-IP cap)", () => {
  it("allows when IP count is 0", async () => {
    const redis = makeRedis();
    const result = await checkIpLimit("1.2.3.4", redis);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(0);
  });

  it("allows when IP count is 4", async () => {
    const redis = makeRedis({ "chat:ip:1.2.3.4:count": 4 });
    const result = await checkIpLimit("1.2.3.4", redis);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(4);
  });

  it("blocks when IP count is 5 (at cap)", async () => {
    const redis = makeRedis({ "chat:ip:1.2.3.4:count": 5 });
    const result = await checkIpLimit("1.2.3.4", redis);
    expect(result.allowed).toBe(false);
    expect(result.count).toBe(5);
  });
});

describe("recordUsage", () => {
  it("increments visitor counter", async () => {
    const redis = makeRedis();
    const incrSpy = vi.spyOn(redis, "incr");
    await recordUsage({
      redis,
      visitorId: "v1",
      ip: "1.2.3.4",
      messages: [{ role: "user", content: "hello" }],
      tokensUsed: 100,
    });
    const visitorKey = "chat:visitor:v1:count";
    expect(incrSpy).toHaveBeenCalledWith(visitorKey);
  });

  it("increments IP counter", async () => {
    const redis = makeRedis();
    const incrSpy = vi.spyOn(redis, "incr");
    await recordUsage({
      redis,
      visitorId: "v1",
      ip: "5.6.7.8",
      messages: [{ role: "user", content: "hello" }],
      tokensUsed: 50,
    });
    const ipKey = "chat:ip:5.6.7.8:count";
    expect(incrSpy).toHaveBeenCalledWith(ipKey);
  });

  it("adds tokens to the global daily tally via incrby", async () => {
    const redis = makeRedis();
    // We expect an incrby or set-based approach; check the token key is touched
    const setSpy = vi.spyOn(redis, "set");
    const incrSpy = vi.spyOn(redis, "incr");

    await recordUsage({
      redis,
      visitorId: "v1",
      ip: "1.2.3.4",
      messages: [{ role: "user", content: "hello" }],
      tokensUsed: 250,
    });

    // Either incr or set should have been called for the token key
    const tokenKey = `chat:global:tokens:${utcDate()}`;
    const tokenKeyTouched =
      setSpy.mock.calls.some(([k]) => k === tokenKey) ||
      incrSpy.mock.calls.some(([k]) => k === tokenKey);
    expect(tokenKeyTouched).toBe(true);
  });

  it("writes transcript with 30-day TTL", async () => {
    const redis = makeRedis();
    const setSpy = vi.spyOn(redis, "set");

    await recordUsage({
      redis,
      visitorId: "v-transcript",
      ip: "9.9.9.9",
      messages: [{ role: "user", content: "test" }],
      tokensUsed: 10,
    });

    // Find the transcript set call
    const transcriptCall = setSpy.mock.calls.find(([k]) =>
      (k as string).startsWith("chat:transcript:v-transcript:")
    );
    expect(transcriptCall).toBeDefined();

    // Check TTL option: ex: 2592000 (30 days in seconds)
    const opts = transcriptCall![2] as { ex?: number };
    expect(opts?.ex).toBe(2592000);
  });

  it("transcript JSON includes ip and messages", async () => {
    const redis = makeRedis();
    const setSpy = vi.spyOn(redis, "set");
    const msgs = [{ role: "user" as const, content: "Who are you?" }];

    await recordUsage({
      redis,
      visitorId: "v2",
      ip: "10.0.0.1",
      messages: msgs,
      tokensUsed: 20,
    });

    const transcriptCall = setSpy.mock.calls.find(([k]) =>
      (k as string).startsWith("chat:transcript:v2:")
    );
    const payload = JSON.parse(transcriptCall![1] as string);
    expect(payload.ip).toBe("10.0.0.1");
    expect(payload.messages).toEqual(msgs);
    expect(typeof payload.ts).toBe("number");
  });
});

// ── helpers ────────────────────────────────────────────────────────────────
function utcDate(): string {
  return new Date().toISOString().slice(0, 10);
}
