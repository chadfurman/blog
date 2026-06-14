import type { Redis } from "@upstash/redis";

export type Message = { role: "user" | "assistant"; content: string };

const MAX_VISITOR_MESSAGES = parseInt(
  process.env.MAX_VISITOR_MESSAGES ?? "5",
  10
);
const DAILY_TOKEN_CEILING = parseInt(
  process.env.DAILY_TOKEN_CEILING ?? "500000",
  10
);
const TTL_24H = 24 * 60 * 60; // seconds
const TTL_48H = 48 * 60 * 60;
const TTL_30D = 30 * 24 * 60 * 60; // 2592000

function utcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkVisitorLimit(
  visitorId: string,
  redis: Redis
): Promise<{ allowed: boolean; count: number }> {
  const key = `chat:visitor:${visitorId}:count`;
  const count = ((await redis.get<number>(key)) ?? 0) as number;
  return { allowed: count < MAX_VISITOR_MESSAGES, count };
}

export async function checkGlobalBudget(
  redis: Redis
): Promise<{ allowed: boolean; tokensUsed: number }> {
  const key = `chat:global:tokens:${utcDate()}`;
  const tokensUsed = ((await redis.get<number>(key)) ?? 0) as number;
  return { allowed: tokensUsed < DAILY_TOKEN_CEILING, tokensUsed };
}

// AMENDMENT: per-IP cap mirroring per-visitor cap
export async function checkIpLimit(
  ip: string,
  redis: Redis
): Promise<{ allowed: boolean; count: number }> {
  const key = `chat:ip:${ip}:count`;
  const count = ((await redis.get<number>(key)) ?? 0) as number;
  return { allowed: count < MAX_VISITOR_MESSAGES, count };
}

export async function recordUsage(opts: {
  redis: Redis;
  visitorId: string;
  ip: string;
  messages: Message[];
  tokensUsed: number;
}): Promise<void> {
  const { redis, visitorId, ip, messages, tokensUsed } = opts;

  // Increment visitor counter (24h rolling TTL)
  const visitorKey = `chat:visitor:${visitorId}:count`;
  await redis.incr(visitorKey);
  await redis.expire(visitorKey, TTL_24H);

  // Increment IP counter (24h rolling TTL)
  const ipKey = `chat:ip:${ip}:count`;
  await redis.incr(ipKey);
  await redis.expire(ipKey, TTL_24H);

  // Add tokens to global daily tally
  const tokenKey = `chat:global:tokens:${utcDate()}`;
  // Use set with existing value + tokensUsed; simpler than incrby for Upstash REST
  const existing = ((await redis.get<number>(tokenKey)) ?? 0) as number;
  await redis.set(tokenKey, existing + tokensUsed, { ex: TTL_48H });

  // Append transcript (30-day TTL)
  const ts = Date.now();
  const transcriptKey = `chat:transcript:${visitorId}:${ts}`;
  await redis.set(
    transcriptKey,
    JSON.stringify({ messages, ip, ts }),
    { ex: TTL_30D }
  );
}
