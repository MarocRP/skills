### Bug fix

**You own this task. Plan, review, verify.** Delegate investigation and the fix to subagents, stay in the lead.

Be scientific. Every shipped line traces to evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself with what you can run: a failing test in a resource that has a test suite, a script that drives the broken path, the NUI's dev server through a browser tool, an error in a server log you can read, or a `lua-language-server --check` or `tsc` error. If it won't reproduce directly, synthesize the trigger, tighten conditions, or add logging until it fires. If the bug only shows in the game client, trace it from the code, the report and any logs, and carry it as unreproduced: the root cause is then inferred, not proven, and the reply says so.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and `why` for regression history. Each pass, take the split that cuts the most remaining problem space, get evidence, eliminate. When program state is unclear, add logging and read it as the code runs. Don't guess. Confirm the surviving *mechanism* with evidence before the step-3 architect fan-out.
3. Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent on the `implement` role (`hardest tasks` for a subtle or cross-cutting fix) with a specific scope.
4. Verify the same way you reproduced. The original repro now passes. "Inconclusive" or a different check is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. When the resource has a test suite, stage the commits so the failing test lands before the fix in git history. In a TypeScript resource with a cheap test path, `tdd` sets the failing-test-first cadence. Skip it when the test would be expensive, integration-heavy, or unclear. This is the canonical shape of **Sequence Work into Verifiable Units**: the failing test first and the fix on top. Without a suite, the repro script stays out of the repo per **Prove It Works**, and the PR shows its output before and after the fix.
6. Run **Opening a PR**.

**Reply:** what was broken, root cause (proven or inferred), fix, how you verified. Paste failing-then-passing output verbatim.
