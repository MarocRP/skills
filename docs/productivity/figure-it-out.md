## What it does

`figure-it-out` designs a workflow for a task no narrower skill covers, then runs it. Before writing code it states what "done" means as something it can check, sizes the work, picks how much rigor the task needs, and writes the phase list down. Then it works unit by unit: one change, check it against the goal, keep it or revert it, log the decision.

The result is a diff plus a decision trail, so you can come back after stepping away and see what it tried, what it kept, and why.

## When to reach for it

Type `/figure-it-out`, or the agent reaches for it for a large task no other workflow covers: moving every resource off an old export, restructuring a resource, a change that spans several resources. For a single bug or feature, the agent doesn't need it.

## How it scales rigor

| The work is | It adds |
| --- | --- |
| Reversible and low-stakes | A checkable goal and a log |
| A one-way door (a schema change, renamed items or events) | A design bakeoff through [architect](./architect.md) before code |
| Wide but mechanical | A script that does the edits, and parallel workers through [swarm](./swarm.md) |
| Long or unattended | A committed decision trail through [show-me-your-work](./show-me-your-work.md) |

It never stops to ask before starting: the framing goes into the log, and reversible work proceeds.

## It's working if

- The reply names the designed playbook, the rigor level and why, and the decision-trail path.
- Each unit was checked before the next one started.
- Anything not verified is marked open or inconclusive, never passed.

## Where it fits

The **catch-all for big work**. It applies [principles](./principles.md) throughout and pulls in [architect](./architect.md), [swarm](./swarm.md) and [show-me-your-work](./show-me-your-work.md) as the task needs them.
