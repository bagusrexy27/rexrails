---
name: save-decisions
description: Save the decisions, progress, and open work from the current session into the project's docs, so the session can be cleared without losing anything. Use when the user runs /save-decisions, or says "save decisions", "write down what we decided", or "before I clear".
---

# Save decisions

Running this skill is the user's explicit request to write the project's decision docs. It is not permission to commit or push.

1. **Collect** from this conversation only:
   - Decisions: what was decided and why.
   - Progress: what was finished.
   - Open: unfinished work and next steps.
   - Parked: ideas that were parked, with the reason.
   Skip anything already written in the target file. Do not invent items.

2. **Pick the target file** in the project root:
   - `docs/PLAN.md` exists: append decisions to its "Decision log" section and progress and open items to its "Progress log" section. Follow the format already used there.
   - Otherwise: append to `docs/DECISIONS.md`, creating it with a `# Decisions` heading if it does not exist.

3. **Write** with today's date, one line per item:
   ```markdown
   - YYYY-MM-DD: <decision>. Why: <reason>.
   ```
   Put open items under an "Open" list and parked ideas under a "Parked" list, each with the date.

4. **Report** in the user's language: which file changed and how many items were added per kind. Then say the session can be cleared with `/clear`, and that the next session should start by asking Claude to read that file. Do not commit.
