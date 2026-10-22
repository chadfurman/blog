import {creed, experience, profile, techTicker} from "@/data/portfolio";
import type {ShellData} from "./shellCommands";

const slug = (company: string) => company.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const commitHash = (company: string) =>
  [...company].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16).padStart(7, "0").slice(0, 7);

export const shellData: ShellData = {
  title: profile.title,
  dirs: ["work", "skills"],
  files: {
    "creed.txt": creed.points.map((p) => `${p.word.padEnd(7)}${p.line}`).join("\n\n"),
    "contact.txt": [profile.email, profile.github, profile.linkedin].join("\n"),
    "skills/stack.txt": techTicker.join("  "),
    ...Object.fromEntries(
      experience.map((e) => [`work/${slug(e.company)}.txt`, `${e.role} · ${e.period}\n\n${e.detail}`]),
    ),
  },
  log: experience.map((e) => `${commitHash(e.company)} ${e.period.padEnd(20)} ${e.company} · ${e.role}`),
};
