#!/usr/bin/env node
// Installs ai-guardrails into the user-level Claude Code config (~/.claude, or $CLAUDE_CONFIG_DIR).
// Usage: npx @bagusrexy27/ai-guardrails [--dir <claude config dir>]
// Safe to run again: scripts and skills are refreshed, everything else is skipped when already installed.
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dirArg = process.argv.indexOf("--dir");
const claudeDir = resolve(dirArg > -1 ? process.argv[dirArg + 1] : process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude"));
const fwd = (p) => p.replace(/\\/g, "/");
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8").replace(/^﻿/, "") : "");

// 1. Scripts and skills (always refreshed)
const hooksDir = join(claudeDir, "hooks");
mkdirSync(hooksDir, { recursive: true });
for (const f of ["claude-md-check.mjs", "context-status.mjs"]) {
  copyFileSync(join(pkg, "hooks", f), join(hooksDir, f));
  console.log(`script   -> ${join(hooksDir, f)}`);
}
cpSync(join(pkg, "skills"), join(claudeDir, "skills"), { recursive: true });
console.log(`skills   -> ${join(claudeDir, "skills")}`);

// 2. Rules appended to the global CLAUDE.md once (detected by their first heading)
const claudeMd = join(claudeDir, "CLAUDE.md");
const current = read(claudeMd);
if (current.includes("# Efficient work habits")) {
  console.log(`rules    already in ${claudeMd}, skipped`);
} else {
  writeFileSync(claudeMd, current.trimEnd() + "\n" + read(join(pkg, "rules.md")));
  console.log(`rules    -> ${claudeMd}`);
}

// 3. settings.json: SessionStart hook and statusline segment, merged with what is there
const settingsPath = join(claudeDir, "settings.json");
const settings = JSON.parse(read(settingsPath).trim() || "{}");
let changed = false;

settings.hooks ??= {};
settings.hooks.SessionStart ??= [];
const hookCmd = `node "${fwd(join(hooksDir, "claude-md-check.mjs"))}"`;
if (settings.hooks.SessionStart.some((e) => (e.hooks || []).some((h) => (h.command || "").includes("claude-md-check.mjs")))) {
  console.log("hook     already in settings.json, skipped");
} else {
  settings.hooks.SessionStart.push({ hooks: [{ type: "command", command: hookCmd, timeout: 10 }] });
  changed = true;
  console.log("hook     -> settings.json");
}

const statusCmd = `node "${fwd(join(hooksDir, "context-status.mjs"))}"`;
const oldStatus = settings.statusLine?.command || "";
if (oldStatus.includes("context-status.mjs")) {
  console.log("status   already in settings.json, skipped");
} else {
  // Put the context segment in front of any existing statusline command.
  settings.statusLine = { ...(settings.statusLine || {}), type: "command", command: oldStatus ? `${statusCmd}; ${oldStatus}` : statusCmd };
  changed = true;
  console.log("status   -> settings.json");
}

if (changed) {
  if (existsSync(settingsPath)) {
    copyFileSync(settingsPath, settingsPath + ".bak");
    console.log(`backup   -> ${settingsPath}.bak`);
  }
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
}

console.log("\nDone. Start a new Claude Code session to use ai-guardrails.");
