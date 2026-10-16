---
name: swarm
description: Fan out parallel subagents over slices of a task, or race them on the same brief, then aggregate one report. Use when the user asks to swarm something, or when a skill calls for parallel coverage, races, gauntlets or exploration.
---

# Swarm

Fan out N parallel workers. They may cover separate slices, race the same brief, or mix both. You wait, aggregate, and return one report.

## Start

Open a task list (your harness's task tool, or a checklist file at `~/.local/state/ox/checklists/<repo>-<branch>.md` when it has none) with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers, not a concurrency limit.
4. Pick the workers' role from what they do: `implement` for workers that write code, `explore` for read-only search and coverage, `review` for workers that verify or review. Use that role's line of `~/.config/ox/models.md`: pass its model and effort to your subagent tool. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the workers run on your model; if the file is missing, also suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so. For a model race, take each arm's model from the `panel` line and name it up front.
5. Give each worker its own writable output when it writes. When workers verify commits, each brief names the exact SHAs and the method, and the worker records both in its result.

## Phase B: Fan out

Start all N workers at once, each named for its slice or race arm. Workers share your checkout, so parallel writers there own disjoint files and run no git commands. A worker that needs its own tree or branch gets a git worktree: commit first, because uncommitted edits do not reach a new worktree, then run `git worktree add <path> -b <new branch> <commit or branch>` and give the worker that absolute path as the only place it may write. One writer per worktree or branch. In T3 Code, a `t3_thread_launch` thread with a worktree `workspaceStrategy` does the same and binds the thread to it.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first.

Wait for every worker to finish. If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Do not paste raw worker dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts. Remove each worker's worktree (`git worktree remove <path>`) once its result is merged or discarded.

## Phase D: Report

Return one consolidated report with the table, issue one-liners, gaps or dropouts, and the race rule when used.
