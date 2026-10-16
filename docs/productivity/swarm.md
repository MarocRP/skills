## What it does

`swarm` splits a task across parallel subagents, or races several of them on the same brief, waits for all of them, and returns one report. Each worker reports `PASS`, `ISSUES` or `BLOCKED` with evidence, and the agent drops and reruns any result that doesn't show the evidence its brief asked for.

## When to reach for it

Type `/swarm`, or the agent reaches for it when you ask for one or when another skill needs parallel coverage: checking every resource that calls a changed export, verifying several commits at once, or trying a few approaches to see which works. For picking the best of several designs, use [arena](./arena.md) instead.

## Shapes

| Shape | Use it for | Result |
| --- | --- | --- |
| Partition | Covering many slices (resources, files, commits) | One result per slice, and a gap for any slice without one |
| Race | Several workers on one brief | The winner by a rule declared up front: first pass, rank all, or best-of |
| Mixed | Racing within each slice | Both |

Workers that write code run on the `implement` model, read-only workers on `explore`, and verifiers on `review`, from [setup-ox](../ox/setup-ox.md). Parallel writers either own separate files or each get their own git worktree.

## It's working if

- The report is one table, not pasted worker output.
- Every slice has a result or an explicit gap, and a gap never counts as a pass.
- Writers never edit the same file at the same time.

## Where it fits

The **parallel fan-out** other skills reach for: [figure-it-out](./figure-it-out.md) uses it for independent units of work, and it pairs with [show-me-your-work](./show-me-your-work.md) when the run is long.
