---
name: token-audit
description: Find MCP servers and plugins that are unrelated to the current project, estimate the tokens they add to every session, and disable the ones the user picks. Use when the user runs /token-audit, asks why a session starts with so many tokens, or when MCP servers or plugins clearly unrelated to the project are loaded.
---

# Token audit

Running this skill is a request to audit. Disabling anything still needs the user's pick in step 4.

1. **Collect** (read-only):
   - Project: read the `CLAUDE.md`, the manifest files (`package.json`, `go.mod`, `pyproject.toml`, ...), and the top-level folder names. Do not read source files.
   - Plugins: `claude plugin list --json`, keep the enabled ones. For each, `claude plugin details <id>` gives its always-on tokens and its skills, agents, and MCP servers. It counts hooks as free, but a SessionStart hook that injects text ("SessionStart hook additional context" in your own context) costs that text on every message: estimate it (about 4 characters per token) and add it to the plugin's total.
   - MCP servers: `claude mcp list` (includes claude.ai connectors). It health-checks every server, so it can be slow and show auth errors; that is expected, the names are what matters. If it fails, use the MCP tool names in your own context instead. For the token weight of each server, use the tools and server instructions in your own context: count its tools, and note whether its instructions are loaded.

2. **Judge** each enabled plugin and MCP server against the project:
   - Unrelated: nothing in the project uses the service or domain it serves (for example a video generator in a backend repo, Jira tools where the project has no Jira link).
   - Keep: the project uses it, or it is general-purpose for this kind of work (git, the docs tool the user writes in).
   - Unsure: say so. Never mark something unrelated on a guess.
   Never suggest disabling rexrails itself.

3. **Report** in the user's language, unrelated items first:

   ```markdown
   | Item | Type | Tokens per session | Why unrelated |
   |---|---|---|---|
   | <name> | plugin / MCP | ~<n>k | <one line> |

   **Possible saving:** ~<n>k tokens per session and per subagent.
   ```

   Then one line for the items kept. Token numbers are estimates; say so once.

4. **Ask** with AskUserQuestion, `multiSelect: true`: which unrelated items to disable for this project. If the list is longer than 4, group the options (for example "All claude.ai connectors not used here").

5. **Disable** only what was picked:
   - Plugin: `claude plugin disable <id> --scope local` (this project, this user only). Run it, then report the result.
   - MCP server or claude.ai connector: it can only be turned off in the `/mcp` menu, so list the exact names for the user to toggle there.
   Finish with: start a new session (or `/reload-plugins`), then run `/context` to see the saving. Do not commit.
