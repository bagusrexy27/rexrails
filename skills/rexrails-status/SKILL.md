---
name: rexrails-status
description: Show which rexrails is active in this session (version, install source, branch for a local folder, skills, hooks) and whether the rules loaded in this session are current. Use when the user runs /rexrails-status, or asks which rexrails version or copy is active, or whether the rules are up to date.
---

# rexrails status

Read-only. Change nothing; if something is out of date, give the command and let the user run it.

1. **Collect**:
   - `claude plugin list --json`: the `rexrails@...` entry (version, scope, enabled, installPath).
   - `claude plugin marketplace list --json`: the `rexrails` entry. `source` is `github` (with the repo) or `directory` (with the path).
   - Local folder source: `git -C <path> branch --show-current` and `git -C <path> status --short`. The plugin is read from that folder, so its current branch and uncommitted edits are what runs.
   - GitHub source: compare the installed version with `version` in `<installLocation>/.claude-plugin/plugin.json`.
   - `claude plugin details rexrails@<marketplace>`: skills and hooks.
   - The rules in this session: the "REXRAILS ACTIVE" context in your own context. Compare its section headings with the `# ` headings of `<installPath>/rules.md`.

2. **Report** in the user's language, as one short table: version, source (repo or folder and branch), enabled, skills, hooks, rules in this session (current or outdated).

3. **Fix hints**, only for what is off:
   - Rules outdated in this session: `/reload-plugins` or a new session.
   - Newer version in the marketplace: `claude plugin marketplace update rexrails`, then `claude plugin update rexrails@rexrails`.
   - Local folder with uncommitted edits or on an unexpected branch: say so; those edits are live.
   - Not installed or disabled: `claude plugin install rexrails@rexrails` or `claude plugin enable rexrails@rexrails`.
