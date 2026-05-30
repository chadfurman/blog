"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {navLinks, projects, profile} from "@/data/portfolio";
import {OPEN_CMDK_EVENT} from "./constants";

type Command = {label: string; hint: string; href: string; external?: boolean};

const COMMANDS: Command[] = [
  ...navLinks.map((l) => ({label: l.label, hint: "section", href: `/${l.href}`})),
  ...projects.map((p) => ({
    label: `${p.title} — case study`,
    hint: "case study",
    href: `/case-studies/${p.slug}`,
  })),
  {label: "GitHub", hint: "external", href: profile.github, external: true},
  {label: "LinkedIn", hint: "external", href: profile.linkedin, external: true},
  {label: "Email", hint: profile.email, href: `mailto:${profile.email}`, external: true},
];

// Pure + exported so it can be unit-tested without React/DOM.
export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter(
    (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
  );
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => filterCommands(COMMANDS, query), [query]);

  function execute(cmd: Command) {
    setOpen(false);
    if (cmd.external) {
      window.open(cmd.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(cmd.href); // client-side nav — no full reload, hero stays alive
    }
  }

  // Global open triggers: Cmd/Ctrl+K, and a custom event from the nav/hero buttons.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_CMDK_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_CMDK_EVENT, onOpen);
    };
  }, []);

  // On open: remember the opener, reset, focus input, lock scroll; restore on close.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      execute(results[active]);
    } else if (e.key === "Tab") {
      // Trap focus inside the dialog.
      const f = dialogRef.current?.querySelectorAll<HTMLElement>("input, button");
      if (!f || f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4 bg-surface-deep/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg glass-card rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
          <span className="font-mono text-sm text-brand" aria-hidden="true">{"›"}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to… (try 'fossabot')"
            className="flex-1 bg-transparent outline-none font-mono text-sm text-on-surface placeholder:text-on-surface-variant/60"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-listbox"
            aria-activedescendant={results[active] ? `cmdk-opt-${active}` : undefined}
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="font-mono text-[10px] text-on-surface-variant border border-border-subtle rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>
        <ul id="cmdk-listbox" className="max-h-72 overflow-y-auto py-2" role="listbox" aria-label="Commands">
          {results.map((cmd, i) => (
            <li key={cmd.label} id={`cmdk-opt-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActive(i)}
                onClick={() => execute(cmd)}
                className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-brand/10 text-text-vibrant" : "text-on-surface"
                }`}
              >
                <span className="font-mono text-sm truncate">{cmd.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant shrink-0">
                  {cmd.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {results.length === 0 ? "No matches." : `${results.length} result${results.length === 1 ? "" : "s"}.`}
        </p>
        {results.length === 0 && (
          <p className="px-4 py-3 font-mono text-sm text-on-surface-variant">No matches.</p>
        )}
      </div>
    </div>
  );
}
