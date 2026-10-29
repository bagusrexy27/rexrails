// SessionStart: inject the guardrails rules into the session context.
// Runs on startup, resume, /clear and /compact, so the rules survive context resets.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rules = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "rules.md"), "utf8");

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "REXRAILS ACTIVE. Follow these rules in every reply.\n" + rules,
  },
}));
