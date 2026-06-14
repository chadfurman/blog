import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Redis } from "@upstash/redis";
import { buildSystemPrompt } from "./lib/systemPrompt.js";
import {
  checkVisitorLimit,
  checkGlobalBudget,
  checkIpLimit,
  recordUsage,
  type Message,
} from "./lib/ratelimit.js";

// ── env constants ─────────────────────────────────────────────────────────
const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS ?? "99", 10);
const MAX_OUTPUT_TOKENS = parseInt(process.env.MAX_OUTPUT_TOKENS ?? "300", 10);
const MAX_HISTORY_MESSAGES = parseInt(
  process.env.MAX_HISTORY_MESSAGES ?? "10",
  10
);

// ── helpers ───────────────────────────────────────────────────────────────
function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ── handler ───────────────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  // 1. Parse + validate body
  let body: { visitorId?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "bad_request");
  }

  const { visitorId, messages: rawMessages } = body;

  if (
    typeof visitorId !== "string" ||
    !visitorId ||
    !Array.isArray(rawMessages) ||
    rawMessages.length === 0
  ) {
    return jsonError(400, "bad_request");
  }

  // Validate each message shape
  for (const msg of rawMessages) {
    if (
      typeof msg !== "object" ||
      msg === null ||
      !("role" in msg) ||
      !("content" in msg) ||
      typeof (msg as { content: unknown }).content !== "string" ||
      !["user", "assistant"].includes((msg as { role: string }).role)
    ) {
      return jsonError(400, "bad_request");
    }
  }

  const messages = rawMessages as Message[];

  // 2. Check last user message length
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) {
    return jsonError(400, "bad_request");
  }
  if (lastUserMsg.content.length > MAX_INPUT_CHARS) {
    return jsonError(400, "input_too_long");
  }

  // 3. Get client IP
  const ip = getClientIp(req);

  // 4. Initialise Redis
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ?? "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  });

  // 5. Check global budget FIRST
  const globalCheck = await checkGlobalBudget(redis);
  if (!globalCheck.allowed) {
    return jsonError(503, "global_exhausted");
  }

  // 6. Check visitor + IP limits (either blocks → 429)
  const [visitorCheck, ipCheck] = await Promise.all([
    checkVisitorLimit(visitorId, redis),
    checkIpLimit(ip, redis),
  ]);

  if (!visitorCheck.allowed || !ipCheck.allowed) {
    return jsonError(429, "visitor_exhausted");
  }

  // 7. Trim history to MAX_HISTORY_MESSAGES
  const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  // 8. Stream from Anthropic
  const result = await streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages: trimmedMessages,
    maxTokens: MAX_OUTPUT_TOKENS,
    onFinish: async ({ usage }) => {
      const tokensUsed = (usage?.promptTokens ?? 0) + (usage?.completionTokens ?? 0);
      await recordUsage({
        redis,
        visitorId,
        ip,
        messages,
        tokensUsed,
      });
    },
  });

  return result.toDataStreamResponse();
}
