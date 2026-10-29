// Statusline segment: context size, subscription quota used, and what to do about it.
// Reads the statusline JSON from stdin. Prints one short colored segment.
import { readFileSync } from "node:fs";

// ponytail: fixed thresholds, tune here if they fire too early or too late
const WARN = 100_000; // tokens in context: suggest /clear or /compact
const HIGH = 200_000; // tokens in context: strongly suggest saving notes and /clear
const QUOTA_WARN = 80; // % of 5-hour subscription quota

let d = {};
try {
  d = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
} catch {}

const cw = d.context_window || {};
const pct = cw.used_percentage;
if (pct == null) process.exit(0); // no messages yet

const tokens = cw.total_input_tokens || Math.round((pct / 100) * (cw.context_window_size || 0));
const k = (n) => (n >= 1000 ? Math.round(n / 1000) + "k" : String(n));
const esc = (c, s) => `\x1b[${c}m${s}\x1b[0m`;

let color = "32"; // green
let advice = "";
if (tokens >= HIGH) {
  color = "31";
  advice = "heavy: /save-decisions, then /clear";
} else if (tokens >= WARN) {
  color = "33";
  advice = "topic done? /clear · continuing? /compact";
}

let out = esc(color, `ctx ${k(tokens)} (${Math.round(pct)}%)`);
const q = d.rate_limits?.five_hour?.used_percentage;
if (q != null) out += " · " + esc(q >= QUOTA_WARN ? "31" : "90", `5h quota ${Math.round(q)}%`);
if (advice) out += " · " + esc(color, advice);
process.stdout.write(out + " ");
