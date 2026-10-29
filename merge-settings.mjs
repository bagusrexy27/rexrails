// Adds the claude-md-check SessionStart hook to settings.json, keeping everything else.
// Usage: CH_CMD=<hook command> node merge-settings.mjs <settings.json>
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const p = process.argv[2];
const cmd = process.env.CH_CMD;
const raw = existsSync(p) ? readFileSync(p, "utf8").replace(/^﻿/, "") : "";
const s = JSON.parse(raw.trim() || "{}");
s.hooks ??= {};
s.hooks.SessionStart ??= [];
const has = s.hooks.SessionStart.some((e) => (e.hooks || []).some((h) => (h.command || "").includes("claude-md-check.mjs")));
if (has) {
  console.log("hook already in " + p + ", skipped");
} else {
  const backup = existsSync(p);
  if (backup) copyFileSync(p, p + ".bak");
  s.hooks.SessionStart.push({ hooks: [{ type: "command", command: cmd, timeout: 10 }] });
  writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
  console.log("hook entry -> " + p + (backup ? " (backup: settings.json.bak)" : ""));
}
