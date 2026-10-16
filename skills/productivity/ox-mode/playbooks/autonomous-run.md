### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, zero calls left to the old export).
2. Pick the wake mechanism for waiting on an event (CI, a merge, a ref advancing). In T3 Code, `watch_pull_request` for a PR, or a `schedule_task` interval heartbeat sized to when the result is worth re-checking, then end the turn. Elsewhere, wait in the shell with a bound: `gh pr checks <pr> --watch`, or a loop that re-checks and sleeps with a cap. When the run stops, clear what you armed: `delete_scheduled_task` each heartbeat and `unwatch_pull_request` each PR in T3 Code.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride. Sequence the work per **Sequence Work into Verifiable Units**, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours. Address broken skills, related bugs, flaky verifiers, review noise, tooling failures, orphaned follow-ups, and fixable drift yourself under ox-mode. Put out-of-band fixes in their own PR. Do not park reversible work for the human or stop to ask about it. Surface only irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration via `show-me-your-work`, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
