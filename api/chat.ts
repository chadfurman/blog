import { streamText } from "ai";
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

// Vercel AI Gateway resolves this string model id; auth is automatic on Vercel
// via the function's OIDC token (no ANTHROPIC_API_KEY needed).
const MODEL = process.env.CHAT_MODEL ?? "anthropic/claude-haiku-4-5";

// The widget is served cross-origin (separate Vercel project), so every
// response — including errors and the stream — needs CORS headers.
const ALLOWED_ORIGINS = new Set([
  "https://chadfurman.com",
  "https://www.chadfurman.com",
  "https://chads.website",
  "http://localhost:3000",
]);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://chadfurman.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

// ── helpers ───────────────────────────────────────────────────────────────
function jsonError(req: Request, status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(req) },
  });
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ── handler ───────────────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  // 1. Parse + validate body
  let body: { visitorId?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError(req, 400, "bad_request");
  }

  const { visitorId, messages: rawMessages } = body;

  if (
    typeof visitorId !== "string" ||
    !visitorId ||
    !Array.isArray(rawMessages) ||
    rawMessages.length === 0
  ) {
    return jsonError(req, 400, "bad_request");
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
      return jsonError(req, 400, "bad_request");
    }
  }

  const messages = rawMessages as Message[];

  // 2. Check last user message length
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) {
    return jsonError(req, 400, "bad_request");
  }
  if (lastUserMsg.content.length > MAX_INPUT_CHARS) {
    return jsonError(req, 400, "input_too_long");
  }

  // 3. Get client IP
  const ip = getClientIp(req);

  // 4. Initialise Redis (Vercel Upstash integration injects KV_REST_API_*)
  const redis = new Redis({
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
    token:
      process.env.KV_REST_API_TOKEN ??
      process.env.UPSTASH_REDIS_REST_TOKEN ??
      "",
  });

  // 5. Check global budget FIRST
  const globalCheck = await checkGlobalBudget(redis);
  if (!globalCheck.allowed) {
    return jsonError(req, 503, "global_exhausted");
  }

  // 6. Check visitor + IP limits (either blocks → 429)
  const [visitorCheck, ipCheck] = await Promise.all([
    checkVisitorLimit(visitorId, redis),
    checkIpLimit(ip, redis),
  ]);

  if (!visitorCheck.allowed || !ipCheck.allowed) {
    return jsonError(req, 429, "visitor_exhausted");
  }

  // 7. Trim history to MAX_HISTORY_MESSAGES
  const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  // 8. Stream from the model via the AI Gateway, as plain text
  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(),
    messages: trimmedMessages,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } finally {
        // Record usage once generation completes, before the stream closes,
        // so the serverless function stays alive for the KV writes.
        try {
          const usage = (await result.usage) as Record<string, number> | undefined;
          const tokensUsed =
            usage?.totalTokens ??
            (usage?.inputTokens ?? usage?.promptTokens ?? 0) +
              (usage?.outputTokens ?? usage?.completionTokens ?? 0);
          await recordUsage({ redis, visitorId, ip, messages, tokensUsed });
        } catch {
          // Never fail the response on a bookkeeping error.
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(req),
    },
  });
}
