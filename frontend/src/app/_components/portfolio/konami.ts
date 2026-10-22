export const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

export function advanceKonami(pos: number, key: string): number {
  const k = key.length === 1 ? key.toLowerCase() : key;
  if (k === KONAMI[pos]) return pos + 1;
  return k === KONAMI[0] ? 1 : 0;
}
