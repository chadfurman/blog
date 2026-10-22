import assert from "node:assert/strict";
import {test} from "node:test";
import {SECRETS, type SecretId} from "./secrets.ts";
import {completions, initialState, promptFor, runLine, type ShellData} from "./shellCommands.ts";

const data: ShellData = {
  files: {
    "creed.txt": "Ships. Scales.",
    "work/fossa.txt": "Engineering Lead",
    "work/klaviyo.txt": "Senior Engineer",
  },
  dirs: ["work"],
  title: "Engineering Lead",
  log: ["a1f3c09 FOSSA"],
};

const run = (line: string, state = initialState, found: SecretId[] = []) =>
  runLine(state, line, {data, found: new Set(found)});
const text = (r: ReturnType<typeof run>) => r.lines.map((l) => l.text).join("\n");

test("ls lists directories and root files", () => {
  assert.match(text(run("ls")), /work\/\s+creed\.txt/);
});

test("cd then ls lists that directory and changes the prompt", () => {
  const cd = run("cd work");
  assert.equal(cd.state.cwd, "work");
  assert.equal(promptFor(cd.state), "chad@website:~/work$");
  assert.match(text(run("ls", cd.state)), /fossa\.txt\s+klaviyo\.txt/);
});

test("cat prints a file, resolving against the cwd", () => {
  assert.equal(text(run("cat creed.txt")), "Ships. Scales.");
  const cd = run("cd work");
  assert.equal(text(run("cat fossa.txt", cd.state)), "Engineering Lead");
});

test("cat of a missing file is an error", () => {
  const r = run("cat nope.txt");
  assert.equal(r.lines[0].tone, "err");
});

test("unknown commands are errors", () => {
  const r = run("frobnicate");
  assert.equal(r.lines[0].tone, "err");
  assert.match(text(r), /command not found/);
});

test("history records commands in order", () => {
  const a = run("ls");
  const b = run("pwd", a.state);
  assert.deepEqual(b.state.history, ["ls", "pwd"]);
});

test("sudo hire chad asks for a password, then unlocks without any email", () => {
  const ask = run("sudo hire chad");
  assert.equal(ask.state.mode, "password");
  assert.deepEqual(ask.effects, []);
  const done = run("hunter2", ask.state);
  assert.equal(done.state.mode, "cmd");
  assert.deepEqual(done.effects, [{unlock: "hire"}]);
  assert.doesNotMatch(text(done), /mail/i);
  assert.deepEqual(done.state.history, ["sudo hire chad"]);
});

test("vim traps the user until :q and unlocks its secret", () => {
  const v = run("vim");
  assert.equal(v.state.mode, "vim");
  assert.deepEqual(v.effects, [{unlock: "vim"}]);
  const stuck = run("exit", v.state);
  assert.equal(stuck.state.mode, "vim");
  assert.equal(stuck.lines[0].tone, "err");
  assert.equal(run(":q", v.state).state.mode, "cmd");
});

test("effect commands", () => {
  assert.deepEqual(run("rm -rf /").effects, ["wipe"]);
  assert.deepEqual(run("overclock").effects, ["overclock"]);
  assert.deepEqual(run("walk").effects, ["walk"]);
  assert.deepEqual(run("exit").effects, ["close"]);
  assert.deepEqual(run("clear").effects, ["clear"]);
});

test("rm without the magic arguments does nothing", () => {
  assert.deepEqual(run("rm file").effects, []);
});

test("hint points at the first undiscovered secret", () => {
  assert.equal(text(run("hint", initialState, ["konami"])), SECRETS.hire.hint);
});

test("hint says so when everything is found", () => {
  const all = Object.keys(SECRETS) as SecretId[];
  assert.match(text(run("hint", initialState, all)), /all/i);
});

test("secrets shows found labels and hints for the rest, never the label", () => {
  const out = text(run("secrets", initialState, ["konami"]));
  assert.match(out, new RegExp(SECRETS.konami.label));
  assert.match(out, new RegExp(SECRETS.vim.hint));
  assert.doesNotMatch(out, new RegExp(`\\[ \\].*${SECRETS.vim.label.replace(/[/]/g, "\\/")}`));
});

test("completions never reveal secret commands", () => {
  ["ov", "wa", "vi", "su", "rm"].forEach((p) => assert.deepEqual(completions(initialState, p, data), []));
});

test("completions for commands, directories and files", () => {
  assert.deepEqual(completions(initialState, "he", data), ["help"]);
  assert.deepEqual(completions(initialState, "cd w", data), ["work"]);
  assert.deepEqual(completions(initialState, "cat cr", data), ["creed.txt"]);
});
