// SessionStart: inject the guardrails rules into the session context.
// Runs on startup, resume, /clear and /compact, so the rules survive context resets.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rules = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "rules.md"), "utf8");

let cwd = process.cwd();
try {
  const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
  if (input.cwd) cwd = input.cwd;
} catch {}

// Project notes written by /save-decisions: point to the file and carry its Open list into the session.
// ponytail: whole Open section, no size cap; trim it if Open lists grow long
let notes = "";
const file = ["docs/PLAN.md", "docs/DECISIONS.md"].find((f) => existsSync(join(cwd, f)));
if (file) {
  const lines = readFileSync(join(cwd, file), "utf8").split(/\r?\n/);
  const start = lines.findIndex((l) => /^#+\s+Open\b/i.test(l));
  let open = [];
  if (start >= 0) {
    const level = lines[start].match(/^#+/)[0].length;
    for (const l of lines.slice(start + 1)) {
      const h = l.match(/^#+(?=\s)/);
      if (h && h[0].length <= level) break;
      if (l.trim()) open.push(l);
    }
  }
  notes = `\n\n# Project notes\nThis project keeps decisions and open work in ${file}. Read the full file before revisiting a past decision or starting work it covers.` +
    (open.length ? `\nOpen:\n${open.join("\n")}` : "");
}

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "REXRAILS ACTIVE. Follow these rules in every reply.\n" + rules + notes,
  },
}));
