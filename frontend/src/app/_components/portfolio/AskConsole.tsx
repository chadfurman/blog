"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ---- types ----------------------------------------------------------------

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}
type ErrorState =
  | "visitor_exhausted"
  | "global_exhausted"
  | "input_too_long"
  | "network"
  | null;

// ---- config ---------------------------------------------------------------

const MAX_CHARS = 99;

// The chat function ships as a separate Vercel project; baked in at build time.
const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "https://chadfurman-chat.vercel.app/api/chat";

const SUGGESTIONS = [
  "What's Chad's biggest project?",
  "What's Chad's AI experience?",
  "Why should I hire Chad?",
];

function getOrCreateVisitorId(): string {
  try {
    const stored = localStorage.getItem("ask_visitor_id");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("ask_visitor_id", id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// ---- markdown rendering ----------------------------------------------------
// Answers are short Markdown: a sentence or two, maybe **bold**, and one link.
// Render prose in the body font (readable) with brand-coloured links; internal
// links navigate same-tab, external open in a new tab.

const markdownComponents = {
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-2 last:mb-0" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-text-vibrant" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-surface-container border border-border-subtle"
      {...props}
    />
  ),
  a: ({ href = "", ...rest }: ComponentPropsWithoutRef<"a">) => {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-brand underline underline-offset-2 decoration-brand/40 hover:decoration-brand transition-colors"
        {...rest}
      />
    );
  },
};

// ---- component ------------------------------------------------------------

export default function AskConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ErrorState>(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const charCount = input.length;
  const capped = error === "visitor_exhausted" || error === "global_exhausted";
  const sendDisabled = streaming || charCount === 0 || charCount > MAX_CHARS || capped;
  const expanded = messages.length > 0 || error !== null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || streaming || capped) return;

      const visitorId = getOrCreateVisitorId();
      const next: Message[] = [...messages, { role: "user", content: text }];
      setMessages([...next, { role: "assistant", content: "" }]);
      setInput("");
      setError(null);
      setStreaming(true);
      abortRef.current = new AbortController();

      try {
        const res = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, messages: next }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          let code: string | null = null;
          try {
            code = ((await res.json()) as { error?: string }).error ?? null;
          } catch {
            /* non-JSON body */
          }
          setMessages((prev) => prev.slice(0, -1)); // drop placeholder
          setError(
            code === "visitor_exhausted" ||
              code === "global_exhausted" ||
              code === "input_too_long"
              ? (code as ErrorState)
              : "network",
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") {
              copy[copy.length - 1] = { ...last, content: last.content + chunk };
            }
            return copy;
          });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) => prev.slice(0, -1));
          setError("network");
        }
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, capped],
  );

  return (
    <section
      id="ask"
      aria-label="Ask about Chad's work"
      className="py-20 px-6 max-w-screen-xl mx-auto border-t border-border-subtle"
    >
      <p
        className="text-center font-mono text-xs uppercase tracking-[0.4em] text-brand mb-5"
        data-reveal
      >
        <span aria-hidden="true">$ </span>ask my work
      </p>
      <h2
        className="text-center font-display text-4xl md:text-5xl font-extrabold tracking-tight text-text-vibrant mb-4"
        data-reveal
        style={{ ["--reveal-delay" as string]: "80ms" }}
      >
        Skip the résumé. Ask.
      </h2>
      <p
        className="text-center text-on-surface-variant max-w-xl mx-auto mb-10"
        data-reveal
        style={{ ["--reveal-delay" as string]: "160ms" }}
      >
        An AI assistant trained on Chad&apos;s real work. Ask anything — it&apos;ll
        point you to the receipts.
      </p>

      <div
        className="glass-card rounded-2xl border border-border-subtle overflow-hidden max-w-3xl mx-auto cursor-text"
        data-reveal
        style={{ ["--reveal-delay" as string]: "240ms" }}
        // Click anywhere on the card focuses the input — unless the click hit an
        // interactive element or the visitor is selecting transcript text.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button, a, input")) return;
          if (window.getSelection()?.toString()) return;
          inputRef.current?.focus();
        }}
      >
        {/* Prompt row — pinned at the top; answers flow below like a REPL */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!sendDisabled) send(input);
          }}
          // Mousedown (vs the card's click) focuses without first blurring the
          // input, so the placeholder doesn't flicker — skip the send button.
          onMouseDown={(e) => {
            if (
              e.target !== inputRef.current &&
              !(e.target as HTMLElement).closest("button")
            ) {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
          className="px-4 pt-4 sm:px-5 sm:pt-5 pb-4 sm:pb-5"
        >
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 sm:py-3.5 transition-colors duration-150 ${
              focused
                ? "border-brand/70 bg-surface-container ring-1 ring-brand/30"
                : "border-border-subtle bg-surface-container-low hover:border-brand/40"
            }`}
          >
          <span aria-hidden="true" className="font-mono text-xl text-brand select-none">
            ›
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!sendDisabled) send(input);
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={MAX_CHARS}
            disabled={capped}
            placeholder={focused ? "" : "Ask anything about Chad's work…"}
            aria-label="Ask a question about Chad's work"
            className="flex-1 min-w-0 font-mono text-base sm:text-lg text-on-surface placeholder:text-on-surface-variant/50 disabled:opacity-40"
            // The site's global input rule (white bg, dark text, border, margins)
            // outranks utility classes by selector specificity — neutralise it
            // inline, including the text colour (on-surface = #dce1fb).
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              width: "100%",
              color: "#dce1fb",
              fontFamily: "var(--font-mono), monospace",
            }}
          />
          <span
            aria-live="polite"
            aria-label={`${charCount} of ${MAX_CHARS} characters`}
            className={`font-mono text-xs shrink-0 tabular-nums ${
              charCount >= MAX_CHARS ? "text-brand" : "text-on-surface-variant/40"
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
          <button
            type="button"
            onClick={() => !sendDisabled && send(input)}
            disabled={sendDisabled}
            aria-label="Send question"
            className={`shrink-0 font-mono text-sm px-3 py-1.5 rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              sendDisabled
                ? "border-border-subtle text-on-surface-variant/40 cursor-not-allowed"
                : "border-brand/40 text-brand hover:bg-brand/10 hover:border-brand/70"
            }`}
          >
            ↵
          </button>
          </div>
        </form>

        {/* Suggestion chips — only before the first question */}
        {!expanded && (
          <div className="flex flex-wrap gap-2 px-4 sm:px-5 pb-5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-border-subtle text-on-surface-variant hover:text-brand hover:border-brand/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Transcript — unfolds in place once a conversation starts */}
        {expanded && (
          <div className="border-t border-border-subtle">
            <div
              ref={scrollRef}
              aria-live="polite"
              aria-label="Conversation"
              className="max-h-[26rem] overflow-y-auto px-5 py-6 sm:px-6 space-y-5"
            >
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div
                    key={i}
                    className="flex gap-2 font-mono text-sm text-brand/90 break-words"
                  >
                    <span aria-hidden="true" className="text-brand select-none">
                      ›
                    </span>
                    <span className="min-w-0">{msg.content}</span>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="pl-4 border-l-2 border-brand/20 text-[0.95rem] leading-relaxed text-on-surface"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                    {streaming && i === messages.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-1.5 h-4 ml-0.5 bg-brand align-middle motion-safe:animate-pulse"
                      />
                    )}
                  </div>
                ),
              )}

              {error === "visitor_exhausted" && (
                <div className="text-sm text-on-surface-variant space-y-2">
                  <p>That&apos;s the message limit for now — but Chad would love to hear from you directly:</p>
                  <p className="font-mono">
                    <a
                      href="mailto:chad@chadfurman.com"
                      className="text-brand underline underline-offset-2 hover:brightness-110"
                    >
                      chad@chadfurman.com
                    </a>
                    {"  ·  "}
                    <a
                      href="https://linkedin.com/in/chadfurman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline underline-offset-2 hover:brightness-110"
                    >
                      LinkedIn
                    </a>
                  </p>
                </div>
              )}
              {error === "global_exhausted" && (
                <p className="text-sm text-on-surface-variant">
                  The assistant is fully booked for today — please come back tomorrow.
                </p>
              )}
              {error === "network" && (
                <p className="text-sm text-on-surface-variant">
                  Something went wrong reaching the assistant. Give it another try.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Always visible — polite to disclose logging before the user types. */}
        <p className="font-mono text-[10px] text-on-surface-variant/50 px-5 sm:px-6 py-2.5 border-t border-border-subtle">
          Conversations are logged for review by Chad.
        </p>
      </div>
    </section>
  );
}
