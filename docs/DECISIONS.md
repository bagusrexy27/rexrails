# Decisions

## Decision log

- 2026-10-29: Ship as a Claude Code plugin installed from the GitHub marketplace, not an npm installer and not edits to the user's CLAUDE.md. Why: same install, update, and uninstall behavior as other plugins (ponytail, caveman), and rules update with the plugin.
- 2026-10-29: Inject the rules with a SessionStart hook on startup, resume, clear, and compact. Why: the rules survive context resets.
- 2026-10-29: Name the plugin rexrails. Why: ai-guardrails is generic, taken on npm, and could be held in directory review; rexrails is free on npm and GitHub.
- 2026-10-29: Do not submit to Anthropic's plugin directory for now. Why: installing from GitHub is enough.
- 2026-10-29: License MIT. Why: the most common license for npm and GitHub tools.
- 2026-10-29: Rule "ask before acting": any state-changing action needs an explicit request; real bugs are the exception. Why: the agent created a repo, committed, and pushed when only asked to "put it in git".
- 2026-10-29: Rule "decisions as options" with AskUserQuestion. Why: the user should pick instead of typing which question an answer belongs to.
- 2026-10-29: Feature gate for new features only, tiers A-D, complexity orders items only inside a tier. Why: stop scope creep; the (significance + urgency) / complexity formula could invert priorities.
- 2026-10-29: Significance is the value of doing it; the ripple of a change (other modules, migrations, tests) counts as complexity. Why: "blast radius" was ambiguous.
- 2026-10-29: Context warning in the statusline as a trial, triggered by tokens (yellow 100k, red 200k) and showing the 5-hour quota instead of dollars; an optional manual step. Why: a 1M window makes percentages look safe, dollars mislead on a subscription, and plugins cannot set the statusline.
- 2026-10-29: /save-decisions skill writes to docs/PLAN.md or docs/DECISIONS.md. Why: makes /clear safe.
- 2026-10-29: CLAUDE.md reminder only fires in project folders. Why: plain chat should not be interrupted.
- 2026-10-29: All user-facing text in English. Why: the plugin is public.
- 2026-10-29: main is the release branch; parked ideas live only on the local parked branch, which is not pushed. Why: the release must not contain the park list, and the repo is public.
- 2026-10-29: README banner uses Markdown image syntax and .gitattributes was removed. Why: Anthropic's pre-submission checklist.
- 2026-10-29: Promo video for Instagram Reels and YouTube Shorts, 9:16, the author's face on camera with plugin animations on top, voice recorded by the author. Why: a personal recommendation is more convincing.
- 2026-10-29: Video script v2 (about 40 seconds): AI behavior "acts without asking" (example: one question, half the code rewritten) and "says yes to everything" (nine features), solved by Ask before acting, Decisions as options, and Feature gate; token warning and /save-decisions named in the CTA. Why: the user picked use cases 1 and 3 with a new example for 1, and asked that the features be named.
- 2026-10-30: Add CLAUDE.md for repo development (summary, validate command, how the hooks fit, conventions). Why: future sessions stop re-reading the code to find their way.
- 2026-10-30: Token estimate passed the feature gate as tier B, Test first, as a rule in rules.md only. Why: tokens are a core problem, but estimate accuracy is unproven; a rule costs no code.
- 2026-10-30: Staged work: new features and tasks over about 50k tokens or 5 steps get a plan table (part, token range, model, effort), an approve/change/cancel question, then the parts run one by one with tests between them; a failing part retries one model up. Why: the user wants easy parts on cheap models and hard parts on smart ones, switched automatically.
- 2026-10-30: "Automatic model switch" is done through subagents with a model and effort, not /model. Why: Claude cannot switch the main session's model itself, and switching mid-session loses the prompt cache.
- 2026-10-30: Subagents only for parts above about 30k tokens or parts that fit a much cheaper model; smaller parts run in the main session. Why: in testing, one subagent cost about 40k tokens, mostly fixed overhead (system prompt, tools, MCP).
- 2026-10-30: Plan and ask first only for new features and big work; questions and small fixes are answered or done directly. Why: planning every prompt costs tokens and an extra round trip.
- 2026-10-30: Development continues on the local parked branch, rebased on main. Releases cherry-pick feature commits to main, without the park list commit; parked is never pushed. Why: user's choice; PARKED.md must not reach the public repo.

## Progress log

- 2026-10-29: rexrails is public at github.com/bagusrexy27/rexrails (main at 6de2848), passes `claude plugin validate`, and is installed on this laptop.
- 2026-10-29: Old manual install (global CLAUDE.md rules, settings hook, copied skill) and the ai-guardrails plugin were removed from this laptop; backups are `*.pre-plugin.bak` in ~/.claude.
- 2026-10-29: Icon with transparent corners (.claude-plugin/icon.png) and the rexrails banner (assets/banner.jpg) are in place.
- 2026-10-29: README has background, five problems with real cases, use cases, install, update, uninstall, and FAQ.
- 2026-10-30: Token estimate and staged work rule pushed to main (04c4b88), README features table updated.
- 2026-10-30: parked rebased on main (park list now on top, 80e854e).
- 2026-10-30: Promo animation (promo/motion.html) exists; local folder renamed to D:\Code\rexrails.
- 2026-10-30: rules.md on parked updated: subagents only for big parts (not yet committed).

### Open

- 2026-10-29: On other laptops with ai-guardrails installed: uninstall it, remove its marketplace, and install rexrails.
- 2026-10-29: The old private repo bagusrexy27/claude-hygiene still exists on GitHub; deleting it needs the delete_repo scope and the user's go-ahead.
- 2026-10-29: Review the context warning trial around 2026-11-12: keep it only if it made clearing or compacting happen earlier.
- 2026-10-29: In D:\Code\PMIS\core-project-management-ultimate, the CLAUDE.md code map change is not committed yet.
- 2026-10-30: Test staged work in a real project with `claude --plugin-dir D:\Code\rexrails` (installed rexrails disabled): check gate, plan table, approval question, subagent model per part, tests between parts, final report; compare the estimate with /context.
- 2026-10-30: Commit the rules.md subagent-threshold change on parked, then cherry-pick to main when tested.
- 2026-10-30: Bump .claude-plugin/plugin.json from 0.1.0 to 0.2.0 so installed copies pick up the new rule.
- 2026-10-30: Decide whether CLAUDE.md, docs/, and promo/ are committed; CLAUDE.md at the plugin root triggers a validate warning and would ship to users (option: move to .claude/CLAUDE.md).
- 2026-10-30: Disable MCP servers unrelated to this project (Higgsfield, datadog, slack, ...) to cut the fixed token overhead of every session and subagent.

### Parked

- 2026-10-29: Parked ideas are kept on the local `parked` branch in PARKED.md, not on main.

## Video script v2 (Reels/Shorts, 9:16, about 40 seconds)

Layout: the author's face in the bottom half, animation in the top half. Each AI behavior appears as a red "AI behavior" label, each fix as a green label. Narration is about 115 words.

| # | Time | Spoken line | Animation on top |
|---|---|---|---|
| Hook | 0-4s | "You ask your AI agent one simple question… and it rewrites half your code." | Chat bubble "Why is this function slow?", then a list of files falls fast: **12 files changed**. |
| Common problem | 4-8s | "AI coding agents are fast. But they love doing more than you asked." | The cream dot rides the S-road, then flies off the track. |
| Behavior 1 | 8-15s | "It acts without asking. You wanted an answer, and you got a refactor, new files, sometimes even a commit." | Red label **AI behavior: acts without asking**. The expected "answer" box is buried under "refactor", "new files", and "commit" boxes. |
| Behavior 3 | 15-21s | "And it says yes to everything. Nine features in one request? Sure. Now you maintain all nine." | Red label **AI behavior: says yes to everything**. Nine feature cards pile up until the screen is full. |
| Solution | 21-24s | "So I built a plugin to fix this. It's called rexrails." | The S-road draws in full, the dot rides calmly on track. Title **rexrails** appears. |
| Feature 1 | 24-29s | "Ask before acting: questions get answers, and nothing changes unless you say so." | Green label **Ask before acting**. Same bubble, now answered with an explanation, and **0 files changed**. |
| Feature 2 | 29-33s | "Decisions as options: when it needs your call, you just tap." | Green label **Decisions as options**. An option card appears, the cursor picks "1. (Recommended)". |
| Feature 3 | 33-38s | "And a feature gate: every idea is checked for real impact first. Nine in, two worth building." | Green label **Feature gate**. Nine cards pass through a gate, two reach "Build", seven go to "Park". |
| CTA | 38-43s | "Plus token warnings and session notes. Free and open source, link in bio." | rexrails icon in the center, two small chips "Token warning" and "/save-decisions", then `github.com/bagusrexy27/rexrails` and **Link in bio**. |

Notes:
- Behavior 1 is answered by Ask before acting and Decisions as options. Behavior 3 is answered by the Feature gate.
- "12 files" in the hook is an illustration. Replace it with a real number if there is one.
- Next: once the script is approved, build the 9:16 HTML animation for the top half, timed to the recorded voice.
