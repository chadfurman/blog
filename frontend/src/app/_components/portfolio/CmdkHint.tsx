"use client";

import {useEffect, useState} from "react";
import {OPEN_CMDK_EVENT} from "./constants";

// Small client affordance that opens the command palette (server-rendered Hero
// can't carry an onClick itself). Shows the right modifier per platform.
export default function CmdkHint() {
  const [mod, setMod] = useState("⌘K");
  useEffect(() => {
    const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    setMod(isMac ? "⌘K" : "Ctrl K");
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CMDK_EVENT))}
      className="hero-rise mt-8 inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant/70 hover:text-brand transition-colors"
      style={{["--rise-delay" as string]: "360ms"}}
    >
      <span className="text-brand">$</span> search
      <kbd className="border border-border-subtle rounded px-1.5 py-0.5 text-on-surface">{mod}</kbd>
      <span className="cursor-blink text-brand">▋</span>
    </button>
  );
}
