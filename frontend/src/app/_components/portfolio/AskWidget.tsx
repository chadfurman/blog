"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";

// ---- types ----------------------------------------------------------------

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

type ErrorState =
  | { type: "visitor_exhausted" }
  | { type: "global_exhausted" }
  | { type: "input_too_long" }
  | { type: "network" }
  | null;

// ---- visitorId ------------------------------------------------------------

function getOrCreateVisitorId(): string {
  try {
    const stored = localStorage.getItem("ask_visitor_id");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("ask_visitor_id", id);
    return id;
  } catch {
    // localStorage blocked (SSR path hit at runtime — shouldn't happen, but safe)
    return crypto.randomUUID();
  }
}

// ---- chat endpoint --------------------------------------------------------
// The chat function ships as a separate Vercel project; the widget calls it
// cross-origin. NEXT_PUBLIC_CHAT_API_URL is the full endpoint URL, baked in at
// build time. Falls back to a same-origin path for local dev.
const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "https://chadfurman-chat.vercel.app/api/chat";

// ---- component ------------------------------------------------------------

export default function AskWidget(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ErrorState>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = useId();

  const MAX_CHARS = 99;
  const charCount = input.length;
  const sendDisabled = streaming || charCount === 0 || charCount > MAX_CHARS;

  // Scroll to bottom whenever messages change or streaming appends text
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus the input when panel opens; return focus to trigger on close
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Trap focus inside the panel
  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button, input, a[href]",
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const visitorId = getOrCreateVisitorId();
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setStreaming(true);

    // Append a placeholder for the assistant reply
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, messages: nextMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let errorCode: string | null = null;
        try {
          const json = (await res.json()) as { error?: string };
          errorCode = json.error ?? null;
        } catch {
          // non-JSON body; fall through
        }
        // Remove the empty placeholder
        setMessages((prev) => prev.slice(0, -1));
        if (errorCode === "visitor_exhausted") {
          setError({ type: "visitor_exhausted" });
        } else if (errorCode === "global_exhausted") {
          setError({ type: "global_exhausted" });
        } else if (errorCode === "input_too_long") {
          setError({ type: "input_too_long" });
        } else {
          setError({ type: "network" });
        }
        setStreaming(false);
        return;
      }

      if (!res.body) {
        setMessages((prev) => prev.slice(0, -1));
        setError({ type: "network" });
        setStreaming(false);
        return;
      }

      // Stream plain-text deltas straight into the assistant message
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
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
        setError({ type: "network" });
      }
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendDisabled) sendMessage();
      }
    },
    [sendDisabled, sendMessage],
  );

  return (
    <>
      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Ask about Chad's work"
        aria-expanded={open}
        aria-controls="ask-widget-panel"
        onClick={() => setOpen((v) => !v)}
        className={`
          fixed bottom-6 right-6 z-[90]
          w-12 h-12 rounded-full
          glass-card border border-brand/40
          flex items-center justify-center
          text-brand text-lg font-mono
          shadow-lg hover:border-brand/70
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface
          motion-safe:hover:scale-105
        `}
      >
        {open ? (
          <span aria-hidden="true">✕</span>
        ) : (
          <span aria-hidden="true">?</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          id="ask-widget-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={handlePanelKeyDown}
          className={`
            fixed bottom-20 right-6 z-[90]
            w-80 sm:w-96
            glass-card border border-border-subtle
            rounded-xl shadow-2xl
            flex flex-col overflow-hidden
            motion-safe:animate-[hero-rise_0.2s_ease-out_forwards]
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span
              id={titleId}
              className="font-mono text-sm text-on-surface font-medium"
            >
              Ask about Chad&apos;s work
            </span>
            <button
              type="button"
              aria-label="Close chat panel"
              onClick={() => setOpen(false)}
              className="text-on-surface-variant hover:text-on-surface text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded"
            >
              ESC
            </button>
          </div>

          {/* Message list */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-72 min-h-[6rem]"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.length === 0 && !error && (
              <p className="font-mono text-xs text-on-surface-variant text-center pt-4">
                Ask me anything about Chad&apos;s projects, experience, or skills.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`font-mono text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "text-brand text-right"
                    : "text-on-surface"
                }`}
              >
                <span
                  className={`inline-block px-2.5 py-1.5 rounded-lg max-w-[90%] text-left ${
                    msg.role === "user"
                      ? "bg-brand/10 border border-brand/20"
                      : "bg-surface-container border border-border-subtle"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" &&
                    streaming &&
                    i === messages.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-1.5 h-3 ml-0.5 bg-brand motion-safe:animate-pulse align-middle"
                      />
                    )}
                </span>
              </div>
            ))}

            {/* Error states */}
            {error?.type === "visitor_exhausted" && (
              <div className="font-mono text-xs text-on-surface-variant space-y-2">
                <p>
                  You&apos;ve reached the 5-message limit for this session.
                  Reach Chad directly:
                </p>
                <p>
                  <a
                    href="mailto:chad@chadfurman.com"
                    className="text-brand underline underline-offset-2 hover:brightness-110"
                  >
                    chad@chadfurman.com
                  </a>{" "}
                  &middot;{" "}
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

            {error?.type === "global_exhausted" && (
              <p className="font-mono text-xs text-on-surface-variant">
                Chat&apos;s exhausted for today — come back tomorrow.
              </p>
            )}

            {error?.type === "input_too_long" && (
              <p className="font-mono text-xs text-on-surface-variant">
                Message too long (max 99 characters).
              </p>
            )}

            {error?.type === "network" && (
              <p className="font-mono text-xs text-on-surface-variant">
                Something went wrong. Try again.
              </p>
            )}
          </div>

          {/* Input row */}
          <div className="px-4 py-3 border-t border-border-subtle space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                maxLength={MAX_CHARS}
                placeholder="Ask a question…"
                aria-label="Your question"
                disabled={
                  streaming ||
                  error?.type === "visitor_exhausted" ||
                  error?.type === "global_exhausted"
                }
                className={`
                  flex-1 bg-transparent border-none outline-none
                  font-mono text-xs text-on-surface
                  placeholder:text-on-surface-variant/50
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus:ring-0
                `}
                style={{ boxShadow: "none", background: "transparent", border: "none", marginTop: 0, marginBottom: 0 }}
              />
              <span
                aria-live="polite"
                aria-label={`${charCount} of ${MAX_CHARS} characters`}
                className={`font-mono text-[10px] shrink-0 tabular-nums ${
                  charCount >= MAX_CHARS
                    ? "text-on-surface"
                    : "text-on-surface-variant/50"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
              <button
                type="button"
                onClick={sendMessage}
                disabled={sendDisabled}
                aria-label="Send message"
                className={`
                  shrink-0 font-mono text-xs px-2.5 py-1 rounded-md
                  border border-brand/40
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand
                  ${
                    sendDisabled
                      ? "text-on-surface-variant/40 cursor-not-allowed"
                      : "text-brand hover:bg-brand/10 hover:border-brand/70"
                  }
                `}
              >
                ↵
              </button>
            </div>
            {/* Privacy notice */}
            <p className="font-mono text-[10px] text-on-surface-variant/50 leading-none">
              Conversations are logged for review by Chad.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
