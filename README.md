# claude-hygiene

User-level Claude Code setup:
- SessionStart hook that reminds you to create `CLAUDE.md` when a project has none.
- Rules in the global `CLAUDE.md` so Claude warns about token-wasting habits.

## Install (Windows, needs git and Node.js)

```powershell
git clone https://github.com/bagusrexy27/claude-hygiene.git
powershell -ExecutionPolicy Bypass -File claude-hygiene\install.ps1
```

Then start a new Claude Code session. Running the installer again is safe: installed steps are skipped.

## Update

```powershell
git -C claude-hygiene pull
powershell -ExecutionPolicy Bypass -File claude-hygiene\install.ps1
```

The hook script is always overwritten. The rules block is not: to change it, delete the "Efficient work habits" section from `~/.claude/CLAUDE.md` first, then run the installer.
