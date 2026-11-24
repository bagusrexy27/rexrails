# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

rexrails is a Claude Code plugin: user-level guardrails (ask before acting, decisions as options, feature gate, token-habit warnings), a CLAUDE.md reminder, `/plan-me` and `/save-decisions` skills, and an optional statusline segment. No build step, no dependencies, no test suite. Node >= 18, plain ESM `.mjs`.

## Commands

- Validate the plugin: `claude plugin validate .` (must pass before release)
- Try a hook by hand: `echo '{"cwd":"D:/some/project"}' | node hooks/claude-md-check.mjs`
- Try the statusline: `echo '{"context_window":{"used_percentage":12,"total_input_tokens":120000}}' | node hooks/context-status.mjs`

## How it fits together

- `rules.md` is the product. `hooks/activate.mjs` reads it and injects it as SessionStart `additionalContext` on startup, resume, clear, and compact (wired in `hooks/hooks.json`), so the rules survive context resets. Changing a rule = edit `rules.md` only. It also appends the "Open" section of the project's `docs/PLAN.md` or `docs/DECISIONS.md`, plus a pointer to the full file.
- `hooks/claude-md-check.mjs` (startup only) walks from cwd up to, not including, home. Exits silently if any `CLAUDE.md` or `.claude/CLAUDE.md` exists, or if the folder has no project marker (`.git`, `package.json`, `go.mod`, ...).
- `hooks/context-status.mjs` is not a hook: plugins cannot set the statusline, so users copy it to `~/.claude/` by hand (see README). Thresholds (100k / 200k tokens, 80% quota) sit at the top of the file.
- `skills/plan-me/SKILL.md` holds the plan format and the staged-work flow (cheapest model first, verify in the main session, redo with Opus on fail). `rules.md` only triggers it, to keep the per-message rules short.
- `skills/save-decisions/SKILL.md` writes decisions, progress, open work, and parked ideas to `docs/PLAN.md` or `docs/DECISIONS.md`. Never commits.
- `.claude-plugin/plugin.json` (version lives here) and `marketplace.json`: users install from the GitHub marketplace `bagusrexy27/rexrails`.

## Conventions

- Every rule should trace back to a real incident (README "The problems it solves" documents them). Keep the injected rules short: they cost ~1k tokens on every message.
- All user-facing text is in English (public plugin).
- Hooks: read stdin JSON defensively (strip BOM, `try/catch`, fall back to `{}`), never throw, exit 0 when there is nothing to say.
- `main` is the release branch and is public. Parked ideas live only on the local `parked` branch, which is never pushed.

## Docs (read only when needed)

- `docs/DECISIONS.md`: decision log with reasons, progress, open work. Check before re-deciding anything.
- `promo/motion.html`: promo video animation, not part of the plugin.
