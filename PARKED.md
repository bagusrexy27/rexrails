# Parked ideas

Ideas that went through the feature gate and were parked. This file lives only on the `parked` branch and is never merged into `main` (the release branch).

Review this list regularly. An idea leaves the list when a real problem shows up (move it to Build or Test first) or when it is clearly not needed anymore (drop it, with the date).

| Date | Idea | Tier | Why parked | Revisit when |
|---|---|---|---|---|
| 2026-10-29 | **Support for other AIs.** One `AGENTS.md` with the same rules, decisions as numbered options in text. Later maybe a condensed version for ChatGPT Custom Instructions, or many formats like ponytail. | Test first | No user of another AI has asked for it yet. Many formats means many copies to maintain. | Someone asks for it, or the author starts using another agent. |
| 2026-10-29 | **Uninstall command.** One command that removes the statusline segment and the downloaded script. | B | Plugin uninstall already covers rules, hooks, and the skill. Only the optional statusline step stays manual. | Users report trouble removing the statusline segment. |
| 2026-10-29 | **`/park` skill.** Add an idea to the park list in the middle of work. | D | `/save-decisions` already records parked ideas at the end of a session. | Parked ideas get lost between sessions. |
| 2026-10-29 | **`/gate` skill.** Run the feature gate manually on any list. | D | The gate already runs automatically when a feature is requested. | People want to gate lists that are not requests to Claude, such as a backlog export. |
| 2026-10-29 | **Configurable statusline thresholds.** Set the yellow, red, and quota limits through settings instead of editing the script. | D | The context warning is still a trial with fixed thresholds. | The trial ends with the warning kept, and users ask for different limits. |
