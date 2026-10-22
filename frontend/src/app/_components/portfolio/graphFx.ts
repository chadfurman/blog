export const STORM_MS = 5000;
export const STORM_FADE_MS = 1000;
export const WIPE_MS = 2400;

export type Ring = {x: number; y: number; t0: number};

export type Fx = {
  pendingStorm: boolean;
  pendingWipe: boolean;
  stormAt: number | null;
  wipeAt: number | null;
  rings: Ring[];
};

export const makeFx = (): Fx => ({pendingStorm: false, pendingWipe: false, stormAt: null, wipeAt: null, rings: []});

const smooth = (t: number) => t * t * (3 - 2 * t);

export function stormLevelAt(fx: Fx, now: number): number {
  if (fx.stormAt === null) return 0;
  const left = STORM_MS - (now - fx.stormAt);
  return Math.max(0, Math.min(1, left / STORM_FADE_MS));
}

export function wipeAmountAt(fx: Fx, now: number): number {
  if (fx.wipeAt === null) return 0;
  const t = Math.min(1, (now - fx.wipeAt) / WIPE_MS);
  return t < 0.5 ? smooth(t * 2) : 1 - smooth((t - 0.5) * 2);
}

export function advanceFx(fx: Fx, now: number): {stormDone: boolean} {
  if (fx.pendingStorm) {
    fx.stormAt = now;
    fx.pendingStorm = false;
  }
  if (fx.pendingWipe) {
    fx.wipeAt = now;
    fx.pendingWipe = false;
  }
  const stormDone = fx.stormAt !== null && now - fx.stormAt > STORM_MS;
  if (stormDone) fx.stormAt = null;
  if (fx.wipeAt !== null && now - fx.wipeAt > WIPE_MS) fx.wipeAt = null;
  return {stormDone};
}

const FADE_CENTER = [0.5, 0.38] as const;
const FADE_RADII = [0.85, 0.75] as const;
const FADE_SOLID = 0.58;
const FADE_GONE = 0.82;

export function heroVisibility(x: number, y: number, w: number, h: number): number {
  const dx = (x - FADE_CENTER[0] * w) / (FADE_RADII[0] * w);
  const dy = (y - FADE_CENTER[1] * h) / (FADE_RADII[1] * h);
  const d = Math.hypot(dx, dy);
  return Math.max(0, Math.min(1, (FADE_GONE - d) / (FADE_GONE - FADE_SOLID)));
}

export function pickWeighted<T>(items: T[], weight: (item: T) => number, rand: () => number): T {
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  if (total <= 0) return items[Math.floor(rand() * items.length)];
  let r = rand() * total;
  return items.find((item) => (r -= weight(item)) < 0) ?? items[items.length - 1];
}
