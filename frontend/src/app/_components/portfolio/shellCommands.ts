import {SECRETS, SECRET_IDS, nextHint, type SecretId} from "./secrets.ts";

export type Tone = "cmd" | "dim" | "ok" | "err";
export type Line = {text: string; tone?: Tone};
export type Effect = "overclock" | "wipe" | "walk" | "close" | "clear" | {unlock: SecretId};
export type ShellMode = "cmd" | "password" | "vim";
export type ShellState = {cwd: string; mode: ShellMode; history: string[]};
export type ShellData = {files: Record<string, string>; dirs: string[]; title: string; log: string[]};
export type Context = {data: ShellData; found: ReadonlySet<SecretId>};
export type Result = {state: ShellState; lines: Line[]; effects: Effect[]};

type Handler = (args: string[], state: ShellState, ctx: Context) => Partial<Result>;

export const initialState: ShellState = {cwd: "", mode: "cmd", history: []};

export function promptFor(state: ShellState): string {
  if (state.mode === "password") return "[sudo] password for chad:";
  if (state.mode === "vim") return ":";
  return `chad@website:${state.cwd ? `~/${state.cwd}` : "~"}$`;
}

const say = (text: string, tone?: Tone): Line[] => [{text, tone}];
const clean = (arg = "") => arg.replace(/^\.\//, "").replace(/^~\/?/, "").replace(/\/$/, "");

function listDir(dir: string, data: ShellData): string[] {
  const prefix = dir ? `${dir}/` : "";
  const names = Object.keys(data.files)
    .filter((f) => f.startsWith(prefix) && !f.slice(prefix.length).includes("/"))
    .map((f) => f.slice(prefix.length));
  return dir ? names : [...data.dirs.map((d) => `${d}/`), ...names];
}

function findFile(state: ShellState, arg: string | undefined, data: ShellData): string | undefined {
  const name = clean(arg);
  return [state.cwd ? `${state.cwd}/${name}` : name, name].find((f) => f in data.files);
}

const HELP =
  "commands: help ls cd cat pwd whoami neofetch git contact history secrets hint clear exit\n" +
  "stuck? 'hint' nudges you toward something you haven't found yet.";

const COMMANDS: Record<string, Handler> = {
  help: () => ({lines: say(HELP, "dim")}),
  ls: (args, s, {data}) => {
    const dir = args[0] ? clean(args[0]) : s.cwd;
    const known = dir === "" || data.dirs.includes(dir);
    return {lines: known ? say(listDir(dir, data).join("   ")) : say(`ls: ${args[0]}: No such directory`, "err")};
  },
  cd: (args, s, {data}) => {
    const dir = clean(args[0]);
    if (!args[0] || dir === "..") return {state: {...s, cwd: ""}};
    if (data.dirs.includes(dir)) return {state: {...s, cwd: dir}};
    return {lines: say(`cd: ${args[0]}: No such directory`, "err")};
  },
  pwd: (_a, s) => ({lines: say(s.cwd ? `/home/chad/${s.cwd}` : "/home/chad")}),
  cat: (args, s, {data}) => {
    const file = findFile(s, args[0], data);
    return {lines: file ? say(data.files[file]) : say(`cat: ${args[0] ?? ""}: No such file`, "err")};
  },
  contact: (_a, s, {data}) => ({lines: say(data.files["contact.txt"] ?? "", "ok")}),
  whoami: () => ({lines: say("chad. engineering lead, applied ai & sre. also, apparently, root.")}),
  neofetch: (_a, _s, {data, found}) => ({
    lines: say(
      [
        "   ┌─────┐    chad@website",
        "   │ ◉ ◉ │    ───────────────",
        "   │  ▽  │    role     " + data.title,
        "   └─┬─┬─┘",
        "     │ │      secrets  " + `${found.size}/${SECRET_IDS.length}`,
        ...(found.size === SECRET_IDS.length ? ["            access   root ★"] : []),
      ].join("\n"),
      "ok",
    ),
  }),
  git: (args, _s, {data}) => ({
    lines: args[0] === "log" ? say(data.log.join("\n"), "dim") : say("usage: git log", "err"),
  }),
  history: (_a, s) => ({
    lines: say(s.history.length ? s.history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n") : "empty", "dim"),
  }),
  secrets: (_a, _s, {found}) => ({
    lines: say(
      SECRET_IDS.map((id) =>
        found.has(id) ? `[x] ${SECRETS[id].label}` : `[ ] ??? — ${SECRETS[id].hint}`,
      ).join("\n"),
    ),
  }),
  hint: (_a, _s, {found}) => ({lines: say(nextHint(found) ?? "you found all of them. nicely done.", "ok")}),
  man: (args) => ({lines: say(args[0] ? `${args[0]}(1): you're on your own, but try it and see.` : "usage: man <command>", "dim")}),
  ping: (args) => ({
    lines:
      args[0] === "chad"
        ? say("64 bytes from chad: icmp_seq=1 ttl=64 time=0.042 ms\n64 bytes from chad: icmp_seq=2 ttl=64 time=0.040 ms (replies faster over coffee)", "ok")
        : say(`ping: ${args[0] ?? ""}: unknown host`, "err"),
  }),
  clear: () => ({effects: ["clear"]}),
  exit: () => ({effects: ["close"]}),
  overclock: () => ({lines: say("spinning up…", "ok"), effects: ["overclock"]}),
  walk: () => ({lines: say("somebody is out for a stroll.", "ok"), effects: ["walk"]}),
  vim: (_a, s) => ({
    state: {...s, mode: "vim"},
    lines: say("-- INSERT --  (this is vim. you cannot leave. maybe try :q)", "dim"),
    effects: [{unlock: "vim"}],
  }),
  sudo: (args, s) =>
    args.join(" ") === "hire chad"
      ? {state: {...s, mode: "password"}}
      : {lines: say(`sudo: ${args.join(" ") || "?"}: command not found`, "err")},
  rm: (args) =>
    args.join(" ") === "-rf /"
      ? {lines: say("removing /… (this is fine)", "err"), effects: ["wipe"]}
      : {lines: say("rm: nothing to remove", "err")},
};

const PUBLIC_COMMANDS = Object.keys(COMMANDS).filter(
  (c) => !["sudo", "rm", "vim", "overclock", "walk"].includes(c),
);

function finish(state: ShellState, part: Partial<Result>): Result {
  return {state: part.state ?? state, lines: part.lines ?? [], effects: part.effects ?? []};
}

function runPassword(state: ShellState): Result {
  return finish(state, {
    state: {...state, mode: "cmd"},
    lines: say("accepted. any password works for the right employer.", "ok"),
    effects: [{unlock: "hire"}],
  });
}

function runVim(state: ShellState, line: string): Result {
  if (/^:(q|q!|wq|x)$/.test(line.trim())) {
    return finish(state, {state: {...state, mode: "cmd"}, lines: say("ok, you may go.", "dim")});
  }
  return finish(state, {lines: say("E37: no write since last change. nobody leaves vim that easily.", "err")});
}

export function runLine(state: ShellState, line: string, ctx: Context): Result {
  if (state.mode === "password") return runPassword(state);
  if (state.mode === "vim") return runVim(state, line);
  const [name, ...args] = line.trim().split(/\s+/);
  if (!name) return finish(state, {});
  const next = {...state, history: [...state.history, line.trim()]};
  const handler = COMMANDS[name];
  if (!handler) return finish(next, {lines: say(`${name}: command not found. try 'help'`, "err")});
  return finish(next, handler(args, next, ctx));
}

export function completions(state: ShellState, input: string, data: ShellData): string[] {
  const parts = input.split(/\s+/);
  const last = parts.pop() ?? "";
  if (!parts.length) return PUBLIC_COMMANDS.filter((c) => c.startsWith(last));
  const pool = parts[0] === "cd" ? data.dirs : listDir(state.cwd, data).map((n) => n.replace(/\/$/, ""));
  return pool.filter((p) => p.startsWith(last));
}
