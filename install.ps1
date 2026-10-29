# Installs the CLAUDE.md reminder hook and the efficient-work rules into user-level Claude Code config.
# Usage: powershell -ExecutionPolicy Bypass -File install.ps1
# Safe to run again: each step is skipped when already installed. Requires node on PATH.
param([string]$ClaudeDir = (Join-Path $HOME ".claude"))
$ErrorActionPreference = "Stop"
$src = $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "node is not on PATH. Install Node.js first." }

# 1. Hook script
$hooksDir = Join-Path $ClaudeDir "hooks"
New-Item -ItemType Directory -Force $hooksDir | Out-Null
$hookFile = Join-Path $hooksDir "claude-md-check.mjs"
Copy-Item (Join-Path $src "claude-md-check.mjs") $hookFile -Force
Write-Host "hook script -> $hookFile"

# 2. Rules in global CLAUDE.md (appended once, detected by its heading)
$claudeMd = Join-Path $ClaudeDir "CLAUDE.md"
$rules = [IO.File]::ReadAllText((Join-Path $src "rules.md"))
$current = if (Test-Path $claudeMd) { [IO.File]::ReadAllText($claudeMd) } else { "" }
if ($current -match "# Efficient work habits") {
  Write-Host "rules already in $claudeMd, skipped"
} else {
  [IO.File]::WriteAllText($claudeMd, $current.TrimEnd() + "`n" + $rules, (New-Object Text.UTF8Encoding $false))
  Write-Host "rules -> $claudeMd"
}

# 3. SessionStart hook entry in settings.json (merged, existing settings kept)
$settings = Join-Path $ClaudeDir "settings.json"
$cmd = 'node "' + ($hookFile -replace '\\', '/') + '"'
# ponytail: env var avoids PowerShell 5.1 stripping the quotes inside $cmd
$env:CH_CMD = $cmd
node (Join-Path $src "merge-settings.mjs") $settings
if ($LASTEXITCODE -ne 0) { throw "failed to update $settings" }
Write-Host "Done. Start a new Claude Code session to use it."
