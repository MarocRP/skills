### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead.

1. `how` over the affected subsystem.
2. `architect` for parallel design exploration.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, sides (client, server, NUI), or resources parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target, per **Separate Before Serializing Shared State**. Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Delegate code-writing to a subagent on the `implement` role with a specific scope: file paths, the named data shape and its organizing structure per **Model the Domain** (a state machine over scattered booleans, a table or registry over branching, a typed model over repeated shape assumptions, chosen before the delegate writes logic), and success criteria. When the implementation admits multiple valid shapes (error handling, module split, where validation lives), delegate through `arena` instead so the runners surface the alternatives and the cross-judge guards the pick. The delegation is mandatory: the gain is review separation, not lines saved, so the **Laziness Protocol** does not override it. A subagent forbidden to start subagents satisfies this by owning the diff directly with the same review separation. Comments per **Comments** in `SKILL.md`. Surgical edits. Port shared-primitive improvements to every consumer and verify each. Commit liberally.
5. Verify with what you can run (Non-negotiables). "Inconclusive" or a weaker check is not a pass. Flag it.
6. Rebase into small, ordered commits. Stack follow-ups. Per **Sequence Work into Verifiable Units**, build, verify, and commit each small unit before the next.
7. If the design is contested, `interrogate` before shipping.
8. Run **Opening a PR**.

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts (audits, cross-resource investigations, competing experiments). Rewrite the checkpoint at phase boundaries. Start a fresh owner rather than chaining interrupts.

**Reply:** what you built, what you chose and why, the throughput checkpoint, open decisions. Tables for design alternatives.
