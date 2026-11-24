---
name: plan-me
description: Make a phased plan before building, with the cheapest fitting model per phase, verify each phase in the main session, and redo failed phases with Opus. Use when the user runs /plan-me or asks for a plan first, or when a new feature (after the feature gate) or a task over about 50k tokens or 5 steps is about to start.
---

# Plan me

Running this skill is a request to plan. It is not permission to build: building starts only after the user approves the plan, and approval never covers commit or push.

1. **Read** only what the task touches. Do not scan the whole codebase; if the target is unclear, ask which file, function, or feature.

2. **Write the plan** in the user's language, in this format and nothing more:

   ```markdown
   ## Plan: <feature name>
   **Goal:** <one sentence>. **Done when:** <checkable criteria>.
   **Out of scope:** <what this plan does not touch>.

   | # | Phase | Files | Model | Effort | Tokens | Verify |
   |---|---|---|---|---|---|---|
   | 1 | <phase> | <files> | Haiku | low | ~5k | <exact command or check> |
   | 2 | <phase> | <files> | Sonnet | medium | ~40k | <exact command or check> |

   **Total:** ~<n>k. **On failed verify:** the phase is redone with Opus.
   **Risks:** <1-2 lines, e.g. a migration that cannot be rolled back>.
   ```

   Rules for the table:
   - Model, cheapest first: Haiku for mechanical edits, Sonnet for normal work, Opus only for hard design or tricky bugs.
   - A subagent costs about 25-40k tokens of fixed overhead. Phases under about 30k run in the main session (write the model as `main (<level>)`, for example `main (Haiku-level)`); use a subagent only for big phases or phases that fit a much cheaper model.
   - Verify is a concrete command or check (`go test ./api`, `npm run lint`, "migrate up then down"), never just "check it".
   - Warn with ⚠️ when the total is above 50k.
   - Leave out explanations per phase, rejected alternatives, and time estimates.

3. **Ask** with AskUserQuestion: approve, change, or cancel. Settle every decision the phases need in the same call, so execution never stops for a question that could be asked now. If the main-session phases fit a cheaper level than the session model, ask in the same call: switch with `/model` before starting (it drops the prompt cache; give the current context size), or stay on this model.

4. **On approval**, run the phases one at a time:
   - Before each phase, name its model and effort in one line. Stop to ask only when the next main-session phase needs a different level than the one agreed in step 3: switch with `/model`, or continue on this model. Do not start that phase until answered.
   - Subagent phase: use the Agent tool with that model and effort, and give it the goal, files, limits, and done criteria.
   - After each phase, verify it in the main session: read the diff and run the Verify check.
   - On failure, redo that phase with Opus. If it fails again, stop and ask.
   - If a phase needs a new decision, stop and ask.

5. **Report** one line per phase: done or not, model used, anything left open. Do not commit.
