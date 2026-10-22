import assert from "node:assert/strict";
import {test} from "node:test";
import {STORM_MS, WIPE_MS, advanceFx, makeFx, stormLevelAt, wipeAmountAt} from "./graphFx.ts";

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
