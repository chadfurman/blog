"use client";

import {useSyncExternalStore} from "react";
import {SECRET_FOUND_EVENT} from "./constants";
import {parseFound, type SecretId} from "./secrets";

const STORAGE_KEY = "site-secrets";
const EMPTY: ReadonlySet<SecretId> = new Set();

let found: ReadonlySet<SecretId> = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    found = new Set(parseFound(localStorage.getItem(STORAGE_KEY)));
  } catch {
    found = EMPTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
  } catch {}
}

export function getFound(): ReadonlySet<SecretId> {
  load();
  return found;
}

export function unlockSecret(id: SecretId): boolean {
  if (getFound().has(id)) return false;
  found = new Set([...found, id]);
  persist();
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent(SECRET_FOUND_EVENT, {detail: id}));
  return true;
}

export function useSecrets(): ReadonlySet<SecretId> {
  return useSyncExternalStore(subscribe, getFound, () => EMPTY);
}
