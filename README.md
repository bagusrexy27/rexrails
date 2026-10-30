<div align="center">

![rexrails: keep your AI agent on a leash, not on a rampage](assets/banner.jpg)

# 🛡️ rexrails

**Keep Claude Code on a leash, not on a rampage.**

User-level guardrails that stop the AI from doing more than you asked,
make it ask with options instead of guessing, and warn you before a session burns your tokens.

[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](#-install)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![platform](https://img.shields.io/badge/platform-windows%20%7C%20macos%20%7C%20linux-lightgrey)](#-install)

```text
/plugin install rexrails --marketplace bagusrexy27/rexrails
```

</div>

---

## 📖 Background

AI coding agents changed what is expensive. Writing code used to be the slow part, so teams naturally built only what mattered. Now an agent can write a feature in minutes, and three new costs take its place:

- **Control.** An agent that is eager to help does more than you asked. Every extra action is something you have to notice, review, or undo.
- **Focus.** When building is cheap, there is always one more feature to add. The code is cheap to write, but every line still has to be maintained.
- **Tokens.** Every message re-sends the whole conversation. A long session makes even a one-line question expensive, and on a subscription it eats your usage limit.

rexrails was born from one real working day on a Go backend refactor with Claude Code. Every rule in it answers something that actually went wrong that day. It turns those lessons into a few rules, two hooks, one skill, and an optional statusline segment.

## 🎯 The problems it solves

### 1. 🚀 The agent does more than you asked

**What happens.** You ask for one thing, and the agent "helpfully" goes further: edits extra files, commits, pushes, creates repos, publishes.

**Real case.** The request was *"put it in git so I can install it on my other laptop."* The agent created a GitHub repository, committed, and pushed, all without being asked. Pushing and creating a repo are hard to undo and visible to others.

**What rexrails does.** *Ask before acting.* Reading and searching are free. Anything that changes something needs an explicit request for that exact action. "Put it in git" is not permission to push. Permission does not carry over to the next action. Real bugs are the one exception: they get fixed right away.

### 2. 🎲 The agent decides things that are yours to decide

**What happens.** In the middle of an approved task, the agent quietly makes choices that belong to you: a license, a name, a visibility setting, a design.

**Real case.** While packaging this very plugin for publishing, the agent picked the MIT license on its own. It was a reasonable choice, but it was not the agent's choice to make.

**What rexrails does.** *Decisions as options.* Every decision comes as a question with 2-4 concrete options, the recommended one first. You click instead of typing, and you can still write your own answer. Each question stands on its own, so you never have to explain which question your answer belongs to.

### 3. 🧱 Scope creep, because building is cheap

**What happens.** A list of changes grows into a big batch. Nobody checks whether each item solves a real problem, so the codebase grows with features nobody needed, and each one has to be maintained forever.

**Real case.** A single request in a project management app bundled nine UI changes at once: cards, filters, popups, and more. None had been checked for real impact.

**What rexrails does.** *Feature gate.* Before writing code for a new feature, the agent answers four questions (real problem, significance, urgency, total complexity including maintenance) and places each item in a tier from A (do now) to D (park or drop). It shows the result and waits for your call. Big lists get split into small batches. New ideas mid-work go to a park list instead of into the code.

### 4. 🔥 Long sessions burn tokens

**What happens.** Every message re-sends the entire conversation. After a few hours, even "ok, thanks" costs as much as the whole history. You do not notice until you hit your limit.

**Real case.** The session that produced this plugin grew past 230,000 tokens. Almost all of it was chat history, not code.

**What rexrails does.** The optional statusline shows the context size and your 5-hour quota, and turns yellow, then red, with concrete advice. The agent also warns you once about habits that waste tokens, like pasting whole logs or switching topics in a long session. `/save-decisions` writes what was decided to your docs, so `/clear` is safe.

### 5. 🔁 The agent re-reads your code every session

**What happens.** Without a `CLAUDE.md`, every new session starts blind. The agent searches and reads the same files again to find where things live, and you pay for it every time.

**Real case.** In a backend with about seventy source files, every task started with the agent re-mapping the codebase. A short code map in `CLAUDE.md` removed that search.

**What rexrails does.** When you open a project that has no `CLAUDE.md`, the agent tells you once and offers to create one with a code map. It stays silent outside projects, so plain chat is not interrupted.

## 💼 Use cases

| Who | Situation | What helps |
|---|---|---|
| 👩‍💻 **Solo developer on a long refactor** | Multi-day work across many files and sessions. | Code map in `CLAUDE.md`, `/save-decisions` before `/clear`, and the context warning keep each session small and focused. |
| 👥 **Team lead with a shared repo** | Several people use AI agents on the same codebase and want predictable behavior. | Install with project scope so the whole team gets *ask before acting*: no surprise commits, pushes, or config changes. |
| 📋 **Product owner or analyst with a feature list** | A stakeholder sends ten changes at once. | The feature gate scores each item, puts them in tiers, and parks the ones without a real problem, so you build the two that matter. |
| 💳 **Subscription user hitting limits** | The 5-hour quota runs out by early afternoon. | The statusline shows context and quota live, and tells you when to `/clear` or `/compact` before the session gets expensive. |
| 💬 **Someone who just wants to chat** | Asking questions in a folder that is not a project. | Nothing gets in the way: no CLAUDE.md reminder, no feature gate, and questions get answers, not actions. |

## ✨ Features

| | Feature | What it does |
|---|---|---|
| ✋ | **Ask before acting** | Claude does only what you explicitly asked. Reading is free, changing anything needs your request. Real bugs are the exception and get fixed right away. |
| 🔘 | **Decisions as options** | Every decision comes as a question with 2-4 options, the recommended one first. You can always type your own answer. |
| 🚦 | **Feature gate** | New features must pass four questions (real problem, significance, urgency, total complexity) and land in a tier before any code is written. |
| 🧮 | **Token estimate** | Before big work, Claude shows a staged plan with a rough token estimate and a model and effort per part. After you approve, each part runs in a subagent on that model, tests checked between parts, so easy parts run on cheaper models. |
| 💸 | **Token habits** | Claude warns you once per habit when you do something that wastes tokens, in your language. |
| 📊 | **Context warning** (optional) | The statusline shows context size and your 5-hour quota, and tells you when to `/clear` or `/compact`. |
| 📝 | **`/save-decisions`** | Writes the session's decisions, progress, and open work to your docs, so `/clear` never loses anything. |
| 📍 | **CLAUDE.md reminder** | Reminds you to create a `CLAUDE.md` in projects that have none, so Claude stops re-reading your code every session. Silent outside projects. |

## 👀 Before and after

**You:** "Put this in git so I can install it on my other laptop."

<table>
<tr><th>❌ Without</th><th>✅ With rexrails</th></tr>
<tr>
<td>

```text
Created repo github.com/you/thing
Committed 5 files
Pushed to origin/main
Done!
```

</td>
<td>

```text
Ready to save. How far should I go?
 ❯ 1. Commit locally (Recommended)
   2. Commit and create a private repo
   3. Commit, create repo, and push
   4. Type something else
```

</td>
</tr>
</table>

## 📊 Statusline preview

The segment sits in front of your existing statusline and changes color as the context grows:

```text
ctx 48k (5%) · 5h quota 12%                                          🟢 all good
ctx 150k (15%) · 5h quota 40% · topic done? /clear · continuing? /compact   🟡
ctx 230k (23%) · 5h quota 85% · heavy: /save-decisions, then /clear         🔴
```

Thresholds live at the top of `hooks/context-status.mjs` (100k for yellow, 200k for red, 80% quota).

## 🚦 The feature gate

When you ask for a new feature, Claude scores it before writing code:

1. **Real problem?** Evidence from users, data, or an incident. "Looks cool" does not count.
2. **Significance.** The value of doing it, or the loss of leaving it.
3. **Urgency.** What is lost if it waits a month?
4. **Total complexity.** Coding, plus the ripple to other modules, plus maintenance.

|  | 🔥 High urgency | 🧊 Low urgency |
|---|---|---|
| **⭐ High significance** | **A** · do now | **B** · schedule |
| **· Low significance** | **C** · recheck, may be fake urgency | **D** · park or drop |

Complexity never changes the tier. It only orders items inside one tier, smallest first. Each item ends as **Build**, **Test first**, or **Park**, and Claude waits for your call.

## 📦 Install

Needs **Node.js 18+** on your PATH, because the hooks are small Node scripts. Works on Windows, macOS, and Linux.

In Claude Code (2.1.275 or later):

```text
/plugin install rexrails --marketplace bagusrexy27/rexrails
```

On older versions, send these as two separate prompts:

```text
/plugin marketplace add bagusrexy27/rexrails
```
```text
/plugin install rexrails@rexrails
```

Then start a new session. You will see `REXRAILS ACTIVE` in the session context. The plugin installs for your user, so it works in every project. Pick the project scope during install if you want it only for one repo and your team.

<details>
<summary><b>📊 Optional: context warning in the statusline</b></summary>

Plugins cannot change your statusline, so this part is a manual step. Download the script once:

```sh
curl -o ~/.claude/context-status.mjs https://raw.githubusercontent.com/bagusrexy27/rexrails/main/hooks/context-status.mjs
```

Then set the statusline in `~/.claude/settings.json`. If you have no statusline yet:

```json
"statusLine": { "type": "command", "command": "node ~/.claude/context-status.mjs" }
```

If you already have one, put the segment in front of it: `node ~/.claude/context-status.mjs; <your existing command>`.

</details>

## 🔄 Update

From your terminal:

```sh
claude plugin update rexrails@rexrails
```

Rules, hooks, and the skill update with the plugin. If you use the statusline segment, run the `curl` command again.

<details>
<summary><b>🗑️ Uninstall</b></summary>

```text
/plugin uninstall rexrails@rexrails
```

If you set up the statusline segment, also remove `node ~/.claude/context-status.mjs` from `statusLine.command` and delete `~/.claude/context-status.mjs`.

</details>

## ❓ FAQ

<details>
<summary><b>Does it cost tokens?</b></summary>

The rules add roughly a thousand tokens to the context of every message. The statusline and the hooks run outside the model, so they cost nothing. The context warning usually saves far more than the rules cost.

</details>

<details>
<summary><b>Will it bother me when I just want to chat?</b></summary>

No. The CLAUDE.md reminder only fires in folders that look like a project (`.git`, `go.mod`, `package.json`, and similar). The feature gate only runs for new features. Questions just get answers.

</details>

<details>
<summary><b>Why is the quota shown instead of a dollar amount?</b></summary>

On a Claude subscription you do not pay per token, so a dollar figure would be an API-price estimate, not your bill. The 5-hour quota is what you actually spend.

</details>

## 📄 License

[MIT](LICENSE) © Bagus Rexy
