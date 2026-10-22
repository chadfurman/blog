import assert from "node:assert/strict";
import {test} from "node:test";
import {SECRETS, SECRET_IDS, nextHint, parseFound} from "./secrets.ts";

test("every secret has a label and a hint", () => {
  SECRET_IDS.forEach((id) => {
    assert.ok(SECRETS[id].label.length > 0);
    assert.ok(SECRETS[id].hint.length > 0);
  });
});

test("parseFound keeps known ids and drops everything else", () => {
  assert.deepEqual(parseFound('["vim","bogus",3,"walk"]'), ["vim", "walk"]);
});

test("parseFound tolerates missing or broken storage", () => {
  assert.deepEqual(parseFound(null), []);
  assert.deepEqual(parseFound("{nope"), []);
  assert.deepEqual(parseFound('{"a":1}'), []);
});

test("nextHint points at the first undiscovered secret", () => {
  const hint = nextHint(new Set(["konami"]));
  assert.equal(hint, SECRETS[SECRET_IDS.find((id) => id !== "konami")!].hint);
});

test("nextHint is null once everything is found", () => {
  assert.equal(nextHint(new Set(SECRET_IDS)), null);
});
