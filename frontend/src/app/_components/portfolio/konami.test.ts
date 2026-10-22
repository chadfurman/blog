import assert from "node:assert/strict";
import {test} from "node:test";
import {KONAMI, advanceKonami} from "./konami.ts";

function feed(keys: string[]): number[] {
  const trail: number[] = [];
  let pos = 0;
  keys.forEach((k) => {
    pos = advanceKonami(pos, k);
    trail.push(pos);
  });
  return trail;
}

test("the full sequence completes", () => {
  const trail = feed([...KONAMI]);
  assert.equal(trail[trail.length - 1], KONAMI.length);
});

test("a wrong key resets progress", () => {
  assert.deepEqual(feed(["ArrowUp", "ArrowUp", "x"]), [1, 2, 0]);
});

test("a wrong key that restarts the sequence counts as the first key", () => {
  assert.deepEqual(feed(["ArrowUp", "ArrowUp", "ArrowUp"]), [1, 2, 1]);
});

test("letters match regardless of case", () => {
  const keys = KONAMI.map((k) => (k.length === 1 ? k.toUpperCase() : k));
  assert.equal(feed(keys).pop(), KONAMI.length);
});
