---
name: verify-me
description: Verify finished work in the main session, on a model at least as strong as the one that did the work. It runs the checks, review the diff like a code review, fix failures once, then ask. Use when the user runs /verify-me, at the end of a plan-me run, or when the user asks to check or review work that was just done.
---

# Verify me

The workers are cheap models; the verifier is this session. It should be the strongest model in play (Opus).

1. **Model check.** If this session is not on Opus, say so in one line and ask with AskUserQuestion: switch with `/model opus` first (it drops the prompt cache; give the current context size), or verify on this model. Wait for the answer.

2. **What to verify against.** After plan-me: the plan's "Done when" and each phase's Verify check. Otherwise: the user's request in this conversation. If neither is clear, ask what "done" means.

3. **Check**, in this order:
   - Run every Verify command and the project's tests that touch the change. A check you could not run is reported as not run, never as passed.
   - Read the diff (`git diff`, plus new untracked files). Read changed hunks, not whole files.
   - Review like a code review: does it meet "Done when", edge cases (empty, null, error paths), error handling that could lose data, security at trust boundaries, and scope (nothing beyond the plan or the request).

4. **Verdict.** Pass, or a list of failures: `file:line`, what is wrong, why it matters.

5. **On failure:**
   - Inside a plan-me run, the plan's approval covers the fix: fix the failures here in the main session, only those, then run step 3 once more.
   - Run by hand: ask with AskUserQuestion before fixing: fix all, fix some, or report only.
   - Still failing after one fix: stop and ask with options. Do not loop.

6. **Report** in the user's language, one line per check: passed, failed, fixed, or not run, plus the model that verified. Do not commit.
