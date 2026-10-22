"use client";

import {useRef} from "react";
import {OPEN_SHELL_EVENT} from "./constants";
import {SECRET_IDS} from "./secrets";
import {useSecrets} from "./secretsStore";

const TAPS_TO_OPEN = 5;
const TAP_WINDOW_MS = 3000;

export default function SecretsBadge() {
  const found = useSecrets();
  const taps = useRef<number[]>([]);
  const complete = found.size === SECRET_IDS.length;

  const onClick = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < TAP_WINDOW_MS), now];
    if (taps.current.length < TAPS_TO_OPEN) return;
    taps.current = [];
    window.dispatchEvent(new Event(OPEN_SHELL_EVENT));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Secrets found: ${found.size} of ${SECRET_IDS.length}`}
      className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
        complete
          ? "border-brand bg-brand text-text-vibrant"
          : "border-border-subtle text-on-surface-variant hover:border-brand hover:text-secondary"
      }`}
    >
      secrets {found.size}/{SECRET_IDS.length}
    </button>
  );
}
