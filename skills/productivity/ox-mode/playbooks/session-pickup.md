### Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail: a `show-me-your-work` decision log or a resume note (Pause safely writes one), the prior session's transcript (Claude Code keeps it under `~/.claude/projects/`, Codex under `~/.codex/sessions/`, and in T3 Code find the thread with `t3_thread_search` and read it with `t3_thread_read`), or a pushed branch. Stay in this project: other projects' sessions hold unrelated private chats. Read the last messages first, then scan back for the decision points. Parse a long transcript in a subagent on the `explore` role and keep the reduced timeline in the main thread, per **Guard the Context Window**.
2. Reconstruct operational state: the branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative.
4. Route the remaining work to the matching playbook and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact, per **Prove It Works**. A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, and the outcome.
