---
name: figure-it-out
description: Design and run a bespoke, auditable workflow for a task no narrower skill fits, such as a large migration, an ambitious multi-part change, or work the user reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, and logs decisions. Use when the user asks you to figure it out, or for a large task no other workflow covers.
---

# Figure it out

When the task matches no playbook, design one. The deliverable before any code is the workflow itself: a sequence of phases that scales rigor to the task, runs the scientific method, and leaves a decision trail a human can audit after stepping away.

Principles named in bold are in the `principles` skill. Call the Skill tool with `principles` as the first item of the task list, and read each named principle's file when you apply it.

## Start

Open a task list (your harness's task tool, or a checklist file at `~/.local/state/ox/checklists/<repo>-<branch>.md` when it has none) whose first item is reading the `principles` index. Then add the phases below as todos.

## Phase A: Frame

Ground first, then commit. Don't start the run until you can state:

- The definition of done as a falsifiable predicate, per **Prove It Works**.
- Scope, quantified: rough units and effort, plus the blockers grounding surfaced.
- The rigor level, biased high. One-way doors and high blast radius get more. Reversible low-stakes steps get less. Rigor is gates and artifacts, not "try harder".

Write the framing and its tradeoffs as the first rows of the decision log (Phase D), then start. Reversible work proceeds without waiting, per **Never Block on the Human**.

## Phase B: Design the workflow

Decompose into atomic, independently-landable units. Sequence riskiest-unknown-first. Scaffold and verification come before features, per **Foundational Thinking**.

- Build the verification check before the work, outside the repo per **Prove It Works**, with the baseline captured from the pre-change state, so the check reads as "old value vs new value".
- For one-way-door design decisions, call the Skill tool with `architect` (it runs `arena`). Skip it for mechanical work whose shape is already concrete. A second arena over a settled design is over-engineering, per the **Laziness Protocol**.
- Decide what fans out. Parallelize only across seams, and give each worker its own git worktree, per **Separate Before Serializing Shared State**: commit any preparation first, then `git worktree add <path> -b <branch> <that commit>` per worker. For several workers at once, call the Skill tool with `swarm`. Don't over-fan.
- Write the designed phase list down. That list is what the human reviews.

Then execute the design. Add its steps to the task list as concrete items between the Phase C and Phase D entries. Run each under the Phase C loop discipline, and weave the Phase D log through them, a row as each step lands, rather than saving the whole trail for the end.

## Phase C: Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, measure against the predicate on the real artifact, keep it if it advanced, revert it if it didn't. Apply **Sequence Work into Verifiable Units**, verifying each unit before starting the next instead of batching checks at the end.

- Verify by inspecting the artifact, never a self-report. When something passes too easily, suspect the observation method before the system.
- Pair delegated work with a judge. If a worker games the gate, reset and harden the contract. If the gate itself is wrong, fix the gate in its own change rather than routing around it.
- A verdict is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Inconclusive is not a pass. Don't hide a negative.

## Phase D: Keep the audit trail

Log the run through the `show-me-your-work` skill (call the Skill tool with it). figure-it-out's work is usually ambitious enough to commit the trail so the reviewer can read it in the PR. The trail plus the diff is what lets the human come back and trust the work.

## Phase E: Verify and hand back

Check the whole against the Phase A predicate on the real artifact, not just the harness. Encode any recurring correction as a gate, a lint rule, a check, or a script, per **Encode Lessons in Structure**.

**Reply:** the playbook you designed, the rigor level and why, the decision-trail path, what's verified against the predicate, and what's still open.
