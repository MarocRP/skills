## What it does

`arena` gives the same task to several candidates on different models at once, picks the strongest result as the base, and grafts the best one or two ideas from each of the others into it. A read-only judge on another model scores the candidates against the same rubric, so the pick isn't one model's taste.

One attempt at a non-trivial design locks in whatever shape that model reached for first. Several independent attempts show which parts every model agrees on and which were one model's guess.

## When to reach for it

Type `/arena`, or the agent reaches for it when you ask for one or when [architect](./architect.md) sketches a design. Each candidate costs a full attempt, so it's for artifacts where the wrong shape is expensive: a module's design, an API, a tricky algorithm. For splitting one task into parallel slices instead, use [swarm](./swarm.md).

## The phases

| Phase | What happens |
| --- | --- |
| Frame | One prompt for every candidate, and a rubric only the agent and judge see |
| Fan out | One candidate per `panel` model, each writing to its own worktree or folder |
| Cross-judge | A `review` model on another family scores every candidate |
| Pick | The agent reads every candidate and picks the base the next maintainer can extend most easily |
| Graft | One or two ideas from each other candidate, folded in by hand |
| Verify | The result is checked like any other output |

## Common questions

**Do I need several model providers?**
No. The candidates come from the `panel` line that [setup-ox](../ox/setup-ox.md) writes. In a harness with one provider, that's its strongest models. Without the file, every candidate runs on your session's model, so they differ only by sampling.

## It's working if

- The synthesis note names the base, why it won, and the source of each graft.
- Candidates that converge get shipped as the consensus, with no grafts.
- Candidates that wildly diverge send the agent back to reframe the task rather than average them.

## Where it fits

The **design bakeoff** behind [architect](./architect.md), and a building block for [figure-it-out](./figure-it-out.md). Its judging reuses the same idea as [interrogate](./interrogate.md): model diversity catches what one model misses.
