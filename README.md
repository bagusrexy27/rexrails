# ai-guardrails

User-level guardrails for [Claude Code](https://claude.com/claude-code). They keep the AI from doing more than you asked and help you spend fewer tokens.

- **Ask before acting.** Claude does only what you explicitly asked. Real bugs are the exception and get fixed right away. Commit and push always need an explicit request.
- **Decisions as options.** Every decision comes as a question with options, and you can still type your own answer.
- **Feature gate.** New features go through a gate (real problem, significance, urgency, total complexity) and a tier A-D before any code is written.
- **Efficient work habits.** Claude warns once per habit about token-wasting habits, in your language.
- **Context warning (trial).** The statusline shows context size, the 5-hour subscription quota used, and advice: yellow from 100k tokens (`/clear` or `/compact`), red from 200k (`/save-decisions`, then `/clear`). Thresholds live at the top of `hooks/context-status.mjs`.
- **`/save-decisions` skill.** Writes the session's decisions, progress, open work, and parked ideas to `docs/PLAN.md` (Decision log and Progress log), or to `docs/DECISIONS.md` when there is no plan. Never commits.
- **CLAUDE.md reminder.** A SessionStart hook reminds you to create `CLAUDE.md` when a project has none. It stays silent in folders that are not projects (no `.git`, `go.mod`, `package.json`, and similar), so plain chat is not interrupted.

## Install

Needs Node.js 18 or newer. Works on Windows, macOS, and Linux.

```sh
npx @bagusrexy27/ai-guardrails
```

Then start a new Claude Code session. It installs into `~/.claude`, or into `$CLAUDE_CONFIG_DIR` when that is set. Use `--dir <path>` to install somewhere else.

What it changes:
- Copies two scripts to `~/.claude/hooks/` and the skill to `~/.claude/skills/save-decisions/`.
- Appends the rules to `~/.claude/CLAUDE.md`, keeping what is already there.
- Adds one SessionStart hook to `~/.claude/settings.json` and puts the context segment in front of your existing statusline. The old file is kept as `settings.json.bak`.

## Update

Run the same command again. Scripts and skills are refreshed, and steps that are already installed are skipped.

The rules block is not overwritten. To get new rules, delete everything from the "Efficient work habits" heading to the end of the guardrails rules in `~/.claude/CLAUDE.md`, then run the installer.

## License

MIT
