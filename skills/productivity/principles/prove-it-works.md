# Prove It Works

Verify every task output by checking the real thing directly. Do not infer from proxies, self-reports, or "it compiles."

**Why:** Unverified work has unknown correctness. Indirect verification (file mtimes, output freshness, agent self-reports, cached screenshots) feels cheaper than direct observation. Acting on a wrong inference costs far more than checking the source.

Check the real thing, not a proxy:
- Check process liveness directly, not indirectly through derived state
- Read the actual value, not a cached or derived representation
- When verification fails, suspect the observation method before suspecting the system

## Script the check when you can

The strongest proof is a deterministic script that re-runs the same comparison, not a one-time eyeball. Write the script, run it, and show its output so a reviewer can re-run it instead of trusting your word.

The script checks the work. It isn't part of the work. Keep it outside the repository, in a scratch or temp directory, and give its path and output in the reply. It joins the repo only when the user asks for tests, or when the repo already has a test suite for that code, written in that suite's style. Never add a test runner, test dependencies, fixtures or mocks to a repo that has none: that is scope nobody asked for. Most FiveM resources, ox resources included, have no tests.
