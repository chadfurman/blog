"use client";

import {OVERCLOCK_EVENT, WALK_EVENT, WIPE_EVENT} from "./constants";
import {unlockSecret} from "./secretsStore";
import type {SecretId} from "./secrets";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fire(name: string): boolean {
  const detail = {handled: false};
  window.dispatchEvent(new CustomEvent(name, {detail}));
  return detail.handled;
}

function fromTop(name: string, id: SecretId): boolean {
  unlockSecret(id);
  if (reduced() || !fire(name)) return false;
  window.scrollTo({top: 0, behavior: "smooth"});
  return true;
}

export const triggerOverclock = () => fromTop(OVERCLOCK_EVENT, "overclock");
export const triggerWipe = () => fromTop(WIPE_EVENT, "rmrf");

export function triggerWalk(): boolean {
  unlockSecret("walk");
  return !reduced() && fire(WALK_EVENT);
}
