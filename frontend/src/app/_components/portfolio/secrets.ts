export type SecretId = "konami" | "hire" | "rmrf" | "vim" | "overclock" | "walk";

export const SECRETS: Record<SecretId, {label: string; hint: string}> = {
  konami: {label: "the Konami code", hint: "A classic cheat code. The arrow keys know it."},
  hire: {label: "sudo hire chad", hint: "Ask for the job politely, with elevated privileges."},
  rmrf: {label: "rm -rf /", hint: "The most dangerous command there is. Here it only makes a mess."},
  vim: {label: "vim", hint: "Some editors are easier to enter than to leave."},
  overclock: {label: "overclock", hint: "Push the network past its limits."},
  walk: {label: "walk", hint: "Even root needs a stretch."},
};

export const SECRET_IDS = Object.keys(SECRETS) as SecretId[];

export function parseFound(raw: string | null): SecretId[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is SecretId => typeof id === "string" && id in SECRETS);
  } catch {
    return [];
  }
}

export function nextHint(found: ReadonlySet<SecretId>): string | null {
  const id = SECRET_IDS.find((s) => !found.has(s));
  return id ? SECRETS[id].hint : null;
}
