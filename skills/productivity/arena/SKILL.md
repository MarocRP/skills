---
name: arena
description: Run several candidates at the same task on different models, pick the strongest as the base, and graft the best parts of the others into it. Use when the user asks to arena something, or when a skill such as architect calls for it.
---

# Arena

Principles named in bold are in the `principles` skill: call the Skill tool with `principles` once, then read each named principle's file.

Open a task list (your harness's task tool, or a checklist file at `~/.local/state/ox/checklists/<repo>-<branch>.md` when it has none) with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric, 3-6 concrete gradeable criteria for what success looks like on *this* task. It is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners from the `panel` line of `~/.config/ox/models.md`, one candidate per entry, passing each entry's model and effort to your subagent tool. If the file or the line is missing, or the file's `# harness` line names a different harness, run three candidates on your own model, say so, and suggest the user run `/setup-ox models`: the candidates then differ by sampling, not by model. If the tool rejects an entry, run that seat on the closest model it lists and say so. Add candidates when the arena covers several design directions. Use the same model several times when the work is generation-bound rather than judgment-sensitive.
4. Give each candidate its own output location, per **Separate Before Serializing Shared State**. A candidate that writes code gets its own git worktree: commit the base first, because uncommitted edits do not reach a new worktree, then run `git worktree add <path> -b arena-<slug>-<n> <base commit>`. Any other candidate writes to its own directory, `arena-<slug>/candidate-<n>/` under the system temp directory.

## Phase B: Fan out

Start all N candidates at once. Each brief carries the task, the absolute path to the shared grounding, the candidate's own output path as the only place it may write, and instructions to produce the artifact and a short rationale naming the alternatives it considered and what it rejected. Wait for every candidate to finish.

In T3 Code, a code-writing candidate can instead be a `t3_thread_launch` thread with a worktree `workspaceStrategy` from the base commit, which binds the thread to its worktree.

If a candidate produces no output, proceed with N-1 and note the dropout.

## Phase C: Cross-judge

After all candidates complete, start one judge on the `review` line of `~/.config/ox/models.md`. If that line names the model you are running on, use a `panel` entry from a different model family, so the judge doesn't share your blind spots. If the line is `inherit` or missing, run it on your own model and say so. Its brief says read-only: inspect only, no writes, no git commands. It sees the rubric and the candidates by path label, scores each criterion, and recommends a base with rationale. It runs in parallel with your reading in Phase D.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the **Laziness Protocol**.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per **Redesign from First Principles**, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per **Prove It Works**. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

Remove each candidate worktree (`git worktree remove <path>`) and branch once the synthesis has landed.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
