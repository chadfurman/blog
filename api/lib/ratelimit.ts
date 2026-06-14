import type { Redis } from "@upstash/redis";

export type Message = { role: "user" | "assistant"; content: string };

// Per-identity message caps: a tight hourly window plus a looser daily cap.
// Both apply to the visitor id AND the IP. Tune via env on the chat project.
const HOURLY_LIMIT = parseInt(process.env.MAX_MESSAGES_PER_HOUR ?? "5", 10);
const DAILY_LIMIT = parseInt(process.env.MAX_MESSAGES_PER_DAY ?? "20", 10);
const DAILY_TOKEN_CEILING = parseInt(
  process.env.DAILY_TOKEN_CEILING ?? "500000",
  10
);

const TTL_1H = 60 * 60; // seconds
const TTL_24H = 24 * 60 * 60;
const TTL_48H = 48 * 60 * 60;
const TTL_30D = 30 * 24 * 60 * 60;

// UTC time buckets — each bucketed key self-expires, so a window resets cleanly
// at the top of the hour / day rather than sliding forever.
function utcDate(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function utcHour(): string {
  return new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
}

async function checkWindows(
  redis: Redis,
  prefix: string,
  id: string
): Promise<{ allowed: boolean; hourly: number; daily: number }> {
  const hourKey = `${prefix}:${id}:h:${utcHour()}`;
  const dayKey = `${prefix}:${id}:d:${utcDate()}`;
  const [h, d] = await Promise.all([
    redis.get<number>(hourKey),
    redis.get<number>(dayKey),
  ]);
  const hourly = (h ?? 0) as number;
  const daily = (d ?? 0) as number;
  return {
    allowed: hourly < HOURLY_LIMIT && daily < DAILY_LIMIT,
    hourly,
    daily,
  };
}

export async function checkVisitorLimit(visitorId: string, redis: Redis) {
  return checkWindows(redis, "chat:visitor", visitorId);
}

export async function checkIpLimit(ip: string, redis: Redis) {
  return checkWindows(redis, "chat:ip", ip);
}

export async function checkGlobalBudget(
  redis: Redis
): Promise<{ allowed: boolean; tokensUsed: number }> {
  const key = `chat:global:tokens:${utcDate()}`;
  const tokensUsed = ((await redis.get<number>(key)) ?? 0) as number;
  return { allowed: tokensUsed < DAILY_TOKEN_CEILING, tokensUsed };
}

async function bump(redis: Redis, key: string, ttl: number): Promise<void> {
  await redis.incr(key);
  await redis.expire(key, ttl);
}

export async function recordUsage(opts: {
  redis: Redis;
  visitorId: string;
  ip: string;
  messages: Message[];
  tokensUsed: number;
}): Promise<void> {
  const { redis, visitorId, ip, messages, tokensUsed } = opts;
  const hour = utcHour();
  const day = utcDate();

  // Increment the hourly + daily windows for both visitor and IP.
  await Promise.all([
    bump(redis, `chat:visitor:${visitorId}:h:${hour}`, TTL_1H),
    bump(redis, `chat:visitor:${visitorId}:d:${day}`, TTL_24H),
    bump(redis, `chat:ip:${ip}:h:${hour}`, TTL_1H),
    bump(redis, `chat:ip:${ip}:d:${day}`, TTL_24H),
  ]);

  // Add tokens to the global daily tally.
  const tokenKey = `chat:global:tokens:${day}`;
  const existing = ((await redis.get<number>(tokenKey)) ?? 0) as number;
  await redis.set(tokenKey, existing + tokensUsed, { ex: TTL_48H });

  // Append transcript (30-day TTL).
  const ts = Date.now();
  await redis.set(
    `chat:transcript:${visitorId}:${ts}`,
    JSON.stringify({ messages, ip, ts }),
    { ex: TTL_30D }
  );
}
