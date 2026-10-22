"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {
  OPEN_SHELL_EVENT,
  OVERCLOCK_DONE_EVENT,
  OVERCLOCK_EVENT,
  SECRET_FOUND_EVENT,
  WALK_EVENT,
  WIPE_EVENT,
} from "./constants";
import {KONAMI, advanceKonami} from "./konami";
import {SECRETS, SECRET_IDS, type SecretId} from "./secrets";
import {getFound, unlockSecret} from "./secretsStore";
import {
  completions,
  initialState,
  promptFor,
  runLine,
  type Effect,
  type Line,
  type ShellState,
  type Tone,
} from "./shellCommands";
import {shellData} from "./shellData";
import {triggerOverclock, triggerWalk, triggerWipe} from "./siteFx";

const TONES: Record<Tone, string> = {
  cmd: "text-text-vibrant",
  dim: "text-on-surface-variant",
  ok: "text-secondary",
  err: "text-red-400",
};

const TOAST_MS = 2600;

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));

const greeting = (): Line => ({
  text: `root shell. type 'help'. ${getFound().size}/${SECRET_IDS.length} secrets found.`,
  tone: "dim",
});

function runEffect(effect: Effect, close: () => void, clear: () => void): string | null {
  if (effect === "close") close();
  else if (effect === "clear") clear();
  else if (effect === "overclock") return triggerOverclock() ? null : "(nothing to overclock on this page)";
  else if (effect === "wipe") return triggerWipe() ? null : "(nothing to wipe on this page)";
  else if (effect === "walk") return triggerWalk() ? null : "(no room to walk here)";
  else unlockSecret(effect.unlock);
  return null;
}

export default function RootShell() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [shell, setShell] = useState<ShellState>(initialState);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const recall = useRef(0);
  const konami = useRef(0);

  const close = useCallback(() => setOpen(false), []);
  const openShell = useCallback(() => {
    setOpen(true);
    setLines((prev) => (prev.length ? prev : [greeting()]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (isTyping(e.target)) return;
      konami.current = advanceKonami(konami.current, e.key);
      if (konami.current < KONAMI.length) return;
      konami.current = 0;
      unlockSecret("konami");
      if (!triggerOverclock()) return openShell();
      window.addEventListener(OVERCLOCK_DONE_EVENT, openShell, {once: true});
    };
    const closing = [OVERCLOCK_EVENT, WIPE_EVENT, WALK_EVENT];
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SHELL_EVENT, openShell);
    closing.forEach((name) => window.addEventListener(name, close));
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SHELL_EVENT, openShell);
      window.removeEventListener(OVERCLOCK_DONE_EVENT, openShell);
      closing.forEach((name) => window.removeEventListener(name, close));
    };
  }, [close, openShell]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onFound = (e: Event) => {
      const id = (e as CustomEvent<SecretId>).detail;
      setToast(`secret found: ${SECRETS[id].label} (${getFound().size}/${SECRET_IDS.length})`);
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), TOAST_MS);
    };
    window.addEventListener(SECRET_FOUND_EVENT, onFound);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(SECRET_FOUND_EVENT, onFound);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    outRef.current?.scrollTo({top: outRef.current.scrollHeight});
  }, [lines]);

  const submit = () => {
    const echo: Line = {text: `${promptFor(shell)} ${shell.mode === "password" ? "" : input}`, tone: "cmd"};
    const result = runLine(shell, input, {data: shellData, found: getFound()});
    const notes: Line[] = [];
    let cleared = false;
    result.effects.forEach((effect) => {
      const note = runEffect(effect, close, () => (cleared = true));
      if (note) notes.push({text: note, tone: "dim"});
    });
    setLines((prev) => (cleared ? [] : [...prev, echo, ...result.lines, ...notes]));
    setShell(result.state);
    recall.current = result.state.history.length;
    setInput("");
  };

  const tab = () => {
    const hits = completions(shell, input, shellData);
    if (hits.length === 1) setInput(`${input.slice(0, input.length - (input.split(/\s+/).pop()?.length ?? 0))}${hits[0]} `);
    else if (hits.length > 1) setLines((prev) => [...prev, {text: hits.join("   "), tone: "dim"}]);
  };

  const step = (dir: -1 | 1) => {
    if (shell.mode !== "cmd") return;
    recall.current = Math.max(0, Math.min(shell.history.length, recall.current + dir));
    setInput(shell.history[recall.current] ?? "");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") submit();
    else if (e.key === "Tab") {
      e.preventDefault();
      tab();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      step(e.key === "ArrowUp" ? -1 : 1);
    }
  };

  return (
    <>
      <div
        role="status"
        className={`fixed left-1/2 top-4 z-[120] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-brand bg-surface-deep px-4 py-2 font-mono text-xs text-text-vibrant transition-transform duration-300 motion-reduce:transition-none ${
          toast ? "translate-y-0" : "-translate-y-20"
        }`}
      >
        {toast}
      </div>
      <div
        role="dialog"
        aria-label="Root shell"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-[110] flex h-[min(62vh,560px)] flex-col border-t border-border-subtle bg-surface-deep font-mono text-[13.5px] leading-relaxed text-on-surface shadow-2xl transition-[transform,visibility] duration-300 motion-reduce:transition-none ${
          open ? "translate-y-0" : "invisible translate-y-full"
        }`}
      >
        <div className="flex justify-between border-b border-border-subtle px-4 py-2 text-xs text-on-surface-variant">
          <span>chad@website: ~ (root shell)</span>
          <button type="button" onClick={close} aria-label="Close shell" className="hover:text-text-vibrant">
            esc ✕
          </button>
        </div>
        <div ref={outRef} className="flex-1 overflow-y-auto whitespace-pre-wrap break-words px-4 py-3">
          {lines.map((l, i) => (
            <div key={i} className={TONES[l.tone ?? "cmd"]}>
              {l.text}
            </div>
          ))}
        </div>
        <label className="flex gap-2 border-t border-border-subtle px-4 pb-3.5 pt-2.5">
          <span className="whitespace-nowrap text-brand">{promptFor(shell)}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            type={shell.mode === "password" ? "password" : "text"}
            tabIndex={open ? 0 : -1}
            aria-label="Shell input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 !rounded-none !border-0 !bg-transparent !p-0 !font-mono !text-[13.5px] !shadow-none text-text-vibrant caret-secondary outline-none"
          />
        </label>
      </div>
    </>
  );
}
