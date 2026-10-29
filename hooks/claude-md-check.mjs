// SessionStart: remind the user to create CLAUDE.md when the project has none.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

let cwd = process.cwd();
try {
  const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
  if (input.cwd) cwd = input.cwd;
} catch {}

const home = resolve(homedir());
let dir = resolve(cwd);
if (dir.toLowerCase() === home.toLowerCase()) process.exit(0); // home is not a project

// Files that mark a folder as a project. Plain chat in a non-project folder gets no reminder.
const MARKERS = [".git", "go.mod", "package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "pom.xml", "build.gradle", "composer.json", "Gemfile"];
const isProjectDir = (d) => MARKERS.some((m) => existsSync(join(d, m))) || safeList(d).some((f) => f.endsWith(".sln") || f.endsWith(".csproj"));
function safeList(d) {
  try { return readdirSync(d); } catch { return []; }
}

// CLAUDE.md in cwd or any parent counts, same as Claude Code's own loading.
let project = false;
for (;;) {
  if (existsSync(join(dir, "CLAUDE.md")) || existsSync(join(dir, ".claude", "CLAUDE.md"))) process.exit(0);
  project ||= isProjectDir(dir);
  const up = dirname(dir);
  if (up === dir || up.toLowerCase() === home.toLowerCase()) break;
  dir = up;
}
if (!project) process.exit(0);

console.log(JSON.stringify({
  systemMessage: "This project has no CLAUDE.md. Create one so Claude does not have to re-read the code every session.",
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext:
      "This project has no CLAUDE.md (checked " + cwd + " and its parents). " +
      "In your first reply, tell the user in their language, in one or two sentences, that this project has no CLAUDE.md, " +
      "and offer to create one with: a one-line project summary, build/test commands, conventions, " +
      "a short code map (where each major feature lives), and which docs to read only when needed. " +
      "Then continue with the user's request. Do not repeat this reminder later in the session.",
  },
}));
