import assert from "node:assert/strict";
import {test} from "node:test";
import {STORM_MS, WIPE_MS, advanceFx, heroVisibility, makeFx, pickWeighted, stormLevelAt, wipeAmountAt} from "./graphFx.ts";

test("a storm queued before the hero is visible starts at the first frame", () => {
  const fx = makeFx();
  fx.pendingStorm = true;
  assert.equal(stormLevelAt(fx, 100), 0);
  advanceFx(fx, 5000);
  assert.equal(fx.pendingStorm, false);
  assert.equal(stormLevelAt(fx, 5000), 1);
});

test("the storm holds, fades out, then reports it is done once", () => {
  const fx = makeFx();
  fx.pendingStorm = true;
  advanceFx(fx, 0);
  assert.equal(stormLevelAt(fx, 3900), 1);
  const fading = stormLevelAt(fx, 4500);
  assert.ok(fading > 0 && fading < 1);
  assert.equal(advanceFx(fx, STORM_MS - 1).stormDone, false);
  assert.equal(advanceFx(fx, STORM_MS + 1).stormDone, true);
  assert.equal(advanceFx(fx, STORM_MS + 2).stormDone, false);
  assert.equal(stormLevelAt(fx, STORM_MS + 2), 0);
});

test("the wipe collapses to full then restores to nothing", () => {
  const fx = makeFx();
  fx.pendingWipe = true;
  advanceFx(fx, 0);
  assert.equal(wipeAmountAt(fx, 0), 0);
  assert.ok(Math.abs(wipeAmountAt(fx, WIPE_MS / 2) - 1) < 1e-9);
  advanceFx(fx, WIPE_MS + 1);
  assert.equal(wipeAmountAt(fx, WIPE_MS + 1), 0);
});

test("heroVisibility is full in the core and zero past the fade", () => {
  assert.equal(heroVisibility(500, 380, 1000, 1000), 1);
  assert.equal(heroVisibility(0, 1000, 1000, 1000), 0);
  assert.equal(heroVisibility(1000, 1000, 1000, 1000), 0);
});

test("heroVisibility falls off smoothly between the core and the edge", () => {
  const mid = heroVisibility(500 + 0.58 * 850 + 0.12 * 850, 380, 1000, 1000);
  assert.ok(mid > 0.2 && mid < 0.8, String(mid));
});

test("pickWeighted follows the weights", () => {
  assert.equal(pickWeighted(["a", "b"], (x) => (x === "b" ? 1 : 0), () => 0), "b");
  assert.equal(pickWeighted(["a", "b"], () => 1, () => 0.99), "b");
  assert.equal(pickWeighted(["a", "b"], () => 1, () => 0), "a");
});

test("pickWeighted falls back to a uniform pick when every weight is zero", () => {
  assert.equal(pickWeighted(["a", "b"], () => 0, () => 0.9), "b");
});
