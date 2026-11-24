// Tool guards. PreToolUse: push/publish needs the user's confirmation; a subagent makes the agent ask with options first.
// PostToolUse: warn once per session about big outputs.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
} catch {}
const event = input.hook_event_name;
const cwd = input.cwd || process.cwd();
const sid = String(input.session_id || "none").replace(/[^\w-]/g, "");

const ask = (reason) => {
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: reason },
  }));
  process.exit(0);
};

// ponytail: up to 5 git calls of at most 1.5s each, under the 15s hook timeout. A hook that times out lets the push through.
function git(args, dir) {
  try {
    return execFileSync("git", args, { cwd: dir, encoding: "utf8", timeout: 1500, stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

const firstLines = (text, n) => {
  const lines = text.split("\n");
  return lines.length > n ? [...lines.slice(0, n), `... ${lines.length - n} more`].join("\n") : text;
};

// Git Bash paths (/d/Code/x) and quoted paths, as Node on Windows expects them.
const toPath = (p) => p.replace(/^["']|["']$/g, "").replace(/^\/([a-zA-Z])(?=\/|$)/, "$1:");

// The repo and refs the push really uses: `cd <dir> && git push`, `git -C <dir> push`, `git push <remote> <src>[:<dst>]`.
// ponytail: reads remote-tracking refs as they are locally (no fetch), so a stale remote shows extra commits.
function pushSummary(cmd) {
  const at = cmd.search(/\bgit\s+(?:-C\s+\S+\s+)?push\b/);
  const cds = [...cmd.slice(0, at).matchAll(/\bcd\s+("[^"]+"|'[^']+'|[^\s;&|]+)/g)];
  let dir = cds.length ? resolve(cwd, toPath(cds.at(-1)[1])) : cwd;
  const c = cmd.slice(at).match(/^git\s+-C\s+("[^"]+"|'[^']+'|\S+)/);
  if (c) dir = resolve(dir, toPath(c[1]));

  const args = (cmd.slice(at).match(/\bpush\b([^;&|]*)/)?.[1] || "").trim().split(/\s+/).filter((a) => a && !a.startsWith("-"));
  const current = git(["rev-parse", "--abbrev-ref", "HEAD"], dir) || "?";
  let [src, dst] = (args[1] || "").replace(/^\+/, "").split(":");
  if (!src || src === "HEAD") src = current;
  if (!dst || dst === "HEAD") dst = src;
  const remoteRef = args[1] ? `${args[0]}/${dst}` : git(["rev-parse", "--abbrev-ref", "@{u}"], dir);
  const force = /\s(--force(-with-lease)?|-f)\b/.test(cmd) || (args[1] || "").startsWith("+") ? " FORCE push: it can overwrite remote history." : "";
  const where = `in ${dir}`;

  if (!remoteRef || !git(["rev-parse", "--verify", "--quiet", remoteRef], dir)) {
    const commits = firstLines(git(["log", "--oneline", "-10", src], dir), 10) || "(none)";
    return `rexrails: push "${src}" ${where}; it is new on the remote, so the whole branch goes there.${force}\nLatest commits:\n${commits}`;
  }
  const range = `${remoteRef}..${src}`;
  const commits = firstLines(git(["log", "--oneline", range], dir), 15) || "(none)";
  const files = firstLines(git(["diff", "--stat", range], dir), 20) || "(none)";
  return `rexrails: push "${src}" to "${remoteRef}" ${where}.${force}\nCommits:\n${commits}\nFiles:\n${files}`;
}

if (event === "PreToolUse" && input.tool_name === "Bash") {
  const cmd = String(input.tool_input?.command || "");
  // ponytail: plain regex, so the words inside an echo or a string also match; a needless prompt is cheap, a missed push is not.
  const m = cmd.match(/\b(git\s+(?:-C\s+\S+\s+)?push|gh\s+repo\s+create|gh\s+release\s+create|npm\s+publish)\b/);
  if (m) {
    if (m[1].startsWith("git")) ask(pushSummary(cmd));
    ask(`rexrails: "${m[1]}" publishes outside this machine and is hard to undo. Confirm it was asked for.`);
  }
}

// Big tool output: it stays in the context and is re-sent with every message. Remind the agent once per session.
const BIG_OUTPUT_TOKENS = 5000; // about 4 characters per token
if (event === "PostToolUse") {
  const tokens = Math.round(JSON.stringify(input.tool_response ?? "").length / 4);
  if (tokens > BIG_OUTPUT_TOKENS) {
    const marker = join(tmpdir(), `rexrails-bigout-${sid}`);
    if (!existsSync(marker)) {
      try { writeFileSync(marker, ""); } catch {}
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `rexrails: that ${input.tool_name || "tool"} output was about ${Math.round(tokens / 1000)}k tokens. It stays in the context and is re-sent with every message. From now on, read only the part you need (offset/limit, grep, head, one section).`,
        },
      }));
    }
  }
  process.exit(0);
}

// Subagent: fixed overhead before any work, so the user picks from options (tool is "Agent", "Task" in older versions).
// First call is denied with an instruction to ask; the same input again means the user picked "subagent".
// ponytail: matched on the exact input; if the agent rewrites the prompt, the user is asked again.
if (event === "PreToolUse" && (input.tool_name === "Agent" || input.tool_name === "Task")) {
  const t = input.tool_input || {};
  if (String(t.description || "").startsWith("[plan-me]")) process.exit(0); // phase of a plan the user approved
  const key = createHash("sha1").update(JSON.stringify([t.description, t.prompt, t.model])).digest("hex").slice(0, 12);
  const marker = join(tmpdir(), `rexrails-agent-${sid}-${key}`);
  if (existsSync(marker)) process.exit(0);
  try { writeFileSync(marker, ""); } catch {}
  const what = [t.description, t.model && `model ${t.model}`].filter(Boolean).join(", ");
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        `rexrails: do not start this subagent yet. Ask the user with AskUserQuestion, in their language, that the subagent${what ? ` (${what})` : ""} costs about 25-40k tokens of overhead before it starts. ` +
        `Options: run it as a subagent (recommend this only if the task is over about 10k tokens or fits a much cheaper model), do it in the main session, or cancel. ` +
        `If they pick the subagent, call the Agent tool again with exactly the same input.`,
    },
  }));
  process.exit(0);
}

process.exit(0);
