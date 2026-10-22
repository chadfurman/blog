import { streamText } from "ai";
import { Redis } from "@upstash/redis";
import { buildSystemPrompt } from "./lib/systemPrompt.js";
import { buildMetrics, normalizeUsage, METRICS_SENTINEL } from "./lib/metrics.js";
import {
  checkVisitorLimit,
  checkGlobalBudget,
  checkIpLimit,
  recordUsage,
  recordRejection,
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
const MODEL = process.env.CHAT_MODEL ?? "anthropic/claude-haiku-5.5";

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

const VISITOR_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const IP_RE = /^[0-9a-fA-F:.]{1,45}$/;

function getClientIp(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return IP_RE.test(ip) ? ip : "unknown";
}

// ── handler ───────────────────────────────────────────────────────────────
// Exported as named method handlers (POST/OPTIONS) so Vercel invokes this with
// a Web-standard `Request` (and we return a `Response`), not the Node req/res.
async function handler(req: Request): Promise<Response> {
  const startedAt = Date.now();
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
    !VISITOR_ID_RE.test(visitorId) ||
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
  const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
  const ip = getClientIp(req);

  // Vercel Upstash integration injects KV_REST_API_*
  const redis = new Redis({
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
    token:
      process.env.KV_REST_API_TOKEN ??
      process.env.UPSTASH_REDIS_REST_TOKEN ??
      "",
  });

  // Test bypass: only active when CHAT_BYPASS_TOKEN is set on the project AND
  // the request carries the matching header. Skips all caps and recording so
  // our own testing never eats the real rate limit or token budget.
  const bypassToken = process.env.CHAT_BYPASS_TOKEN;
  const bypass = !!bypassToken && req.headers.get("x-chat-bypass") === bypassToken;

  // Every rejection past body validation is saved with its status and reason.
  const reject = async (status: number, reason: string): Promise<Response> => {
    if (!bypass) {
      await recordRejection({ redis, visitorId, ip, messages: trimmedMessages, status, reason });
    }
    return jsonError(req, status, reason);
  };

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) {
    return reject(400, "bad_request");
  }
  if (lastUserMsg.content.length > MAX_INPUT_CHARS) {
    return reject(400, "input_too_long");
  }

  if (!bypass) {
    // Global budget first, then visitor + IP limits (either blocks -> 429)
    const globalCheck = await checkGlobalBudget(redis);
    if (!globalCheck.allowed) {
      return reject(503, "global_exhausted");
    }

    const [visitorCheck, ipCheck] = await Promise.all([
      checkVisitorLimit(visitorId, redis),
      checkIpLimit(ip, redis),
    ]);

    if (!visitorCheck.allowed || !ipCheck.allowed) {
      return reject(429, "visitor_exhausted");
    }
  }

  // 8. Stream from the model via the AI Gateway, as plain text
  const modelStartedAt = Date.now();
  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(),
    messages: trimmedMessages,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    onError: ({ error }) => console.error("chat stream error", error),
  });

  // Pull the first chunk up front: a failed model call ends the stream empty,
  // and once a 200 is committed the client can't be told it failed.
  const chunks = result.textStream[Symbol.asyncIterator]();
  const first = await chunks.next();
  const ttftMs = Date.now() - modelStartedAt;
  if (first.done) {
    return reject(502, "model_error");
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(first.value));
        for (let next = await chunks.next(); !next.done; next = await chunks.next()) {
          controller.enqueue(encoder.encode(next.value));
        }
      } finally {
        // Each step is isolated: a client that disconnects mid-stream makes
        // enqueue/close throw, and that must never skip usage accounting.
        const usage = (await Promise.resolve(result.usage).catch(() => undefined)) as
          | Record<string, number>
          | undefined;
        const metrics = buildMetrics({
          model: MODEL,
          usage,
          ttftMs,
          serverMs: Date.now() - startedAt,
        });
        try {
          controller.enqueue(encoder.encode(METRICS_SENTINEL + JSON.stringify(metrics)));
        } catch {
          // Client already gone.
        }
        // Record usage before the stream closes so the serverless function
        // stays alive for the KV writes.
        try {
          if (!bypass) {
            await recordUsage({
              redis,
              visitorId,
              ip,
              messages: trimmedMessages,
              tokensUsed: normalizeUsage(usage).totalTokens,
            });
          }
        } catch {
          // Never fail the response on a bookkeeping error.
        }
        try {
          controller.close();
        } catch {
          // Already closed by a cancel.
        }
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

export const POST = handler;
export const OPTIONS = handler;
