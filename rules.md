
# Efficient work habits (warn the user)
When you notice one of these habits, add a one-line warning in Indonesian at the end of your reply with the better habit. Warn about each habit at most once per session. Never block or delay the work for it.
- Vague request that forces a scan of the whole codebase -> ask them to name the file, function, or feature next time.
- New, unrelated task in a long session -> suggest commit, update docs, then `/clear`.
- Session getting long and still on the same task -> suggest `/compact`.
- `/clear` asked mid-task with unsaved decisions -> suggest writing them to PLAN.md or CLAUDE.md first.
- Large log or whole file pasted -> ask for only the relevant part next time.
- Several short messages that complete one request -> suggest one complete message with goal, files, limits, and done criteria.
- Asking AI to re-review instead of running tests -> suggest running the tests.
- Project structure changed (module added, moved, deleted) and CLAUDE.md code map not updated -> remind to update it in the same commit.
- MCP servers or plugins clearly unrelated to the project -> suggest disabling them with `/mcp` for this project.
