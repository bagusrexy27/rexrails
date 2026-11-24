---
name: plan-me
description: Make a phased plan before building. Cheap subagents do the phases; the main session (Opus) plans, verifies with verify-me, and fixes failures itself. Use when the user runs /plan-me or asks for a plan first, or when a new feature (after the feature gate) or a task over about 50k tokens or 5 steps is about to start.
---

# Plan me

Running this skill is a request to plan. It is not permission to build: building starts only after the user approves the plan, and approval never covers commit or push.

Roles: the main session plans, verifies, and fixes, so it should be on the strongest model (Opus). Subagents on the cheapest model that fits do the work.

1. **Read** only what the task touches. Do not scan the whole codebase; if the target is unclear, ask which file, function, or feature.

2. **Write the plan** in the user's language, in this format and nothing more:

   ```markdown
   ## Plan: <feature name>
   **Goal:** <one sentence>. **Done when:** <checkable criteria>.
   **Out of scope:** <what this plan does not touch>.

   | # | Phase | Files | Model | Effort | Tokens | Verify |
   |---|---|---|---|---|---|---|
   | 1 | <phase> | <files> | Haiku | low | ~15k | <exact command or check> |
   | 2 | <phase> | <files> | main | - | ~5k | <exact command or check> |

   **Total:** ~<n>k. **Then:** verify-me in the main session; failures are fixed there once, then you are asked.
   **Risks:** <1-2 lines, e.g. a migration that cannot be rolled back>.
   ```

   Rules for the table:
   - Model, cheapest first: Haiku for mechanical edits, Sonnet for normal work, Opus only for hard design or tricky bugs.
   - A subagent costs about 25-40k tokens of fixed overhead, still cheaper than Opus for a cheap-model phase over about 10k tokens. Phases under about 10k run in the main session (write `main`); the rest run as subagents.
   - Verify is a concrete command or check (`go test ./api`, `npm run lint`, "migrate up then down"), never just "check it".
   - Warn with ⚠️ when the total is above 50k.
   - Leave out explanations per phase, rejected alternatives, and time estimates.

3. **Ask** with AskUserQuestion: approve, change, or cancel. Settle every decision the phases need in the same call, so execution never stops for a question that could be asked now. If this session is not on Opus, ask in the same call: switch with `/model opus` before starting (it drops the prompt cache; give the current context size), or continue on this model.

4. **On approval**, run the phases one at a time:
   - Before each phase, name its model and effort in one line.
   - Subagent phase: use the Agent tool with that model and effort, a description that starts with `[plan-me]` (the plan is approved, so the rexrails subagent guard lets it through), and give it the goal, files, limits, and done criteria.
   - After each phase, run its Verify check (a command, not a review). On failure, fix it here in the main session once; if it still fails, stop and ask.
   - If a phase needs a new decision, stop and ask.

5. **Verify** with the `rexrails:verify-me` skill: one review of the whole change against "Done when". Its fixes are covered by the plan's approval.

6. **Report** one line per phase: done or not, model used, anything left open, then the verify-me result. Do not commit.
