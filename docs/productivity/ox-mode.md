## What it does

`ox-mode` switches the agent into one way of working for the rest of the session. It matches each task to a playbook (Bug fix, Feature, Refactoring, Investigation and more), copies that playbook's steps into its task list, and runs them, routing to the other skills in this set as it goes: `how` before changing code, `architect` before code that crosses a function boundary, `deslop` before committing, `no-comments` before review, and `pr` for the description.

Its sharpest rule is about verification. Every claim carries its evidence, the agent runs every check it can itself, and anything it can't verify is reported as unverified rather than handed to you as a to-do. Replies are short declarative sentences that name the principle behind each decision.

## When to reach for it

You invoke this by typing `/ox-mode`; the agent won't reach for it on its own. Run it at the start of a session where you want the full process: delegated implementation, design bakeoffs, decision trails. For a quick one-off edit, the skills it routes to work on their own.

## Prerequisites

- Run [`/setup-ox models`](../ox/setup-ox.md) so subagents use the models you chose. Without it they run on your session's model.
- The Babysit, Shipping, Orchestrate and Autopilot playbooks need T3 Code, because they watch PRs and run agents across threads. In another harness the agent says so and uses the closest playbook that works there.

## The playbooks

| Task | Playbook |
| --- | --- |
| "How does X work", "why is Y like this", "should we do X or Y" | Investigation |
| A reported defect | Bug fix |
| New or changed behavior | Feature |
| A structure change that keeps behavior | Refactoring |
| A design choice best settled by trying it | Prototype |
| Writing or testing a skill | Authoring a skill, Eval |
| "Run until done" | Autonomous run |
| Work spanning several PRs, planned first | Multi-phase plan |
| Picking up or pausing in-flight work | Session pickup, Pause safely |
| Reclaiming disk from old worktrees | Worktree cleanup |
| Getting PRs green, landing a stack (T3 Code) | Babysit, Shipping |
| A queue or a whole project run by agents (T3 Code) | Autopilot-full, Autopilot-stack, Orchestrate |

Large or unusual work routes to [figure-it-out](./figure-it-out.md) instead.

## Common questions

**Will it stop and ask me things?**
Only for irreversible actions (force-pushing a shared branch, deploying to a live server, deleting data, messaging players) and for product calls no experiment can settle. For those it applies a default, says what it chose, and tells you what you could pick instead. Everything reversible proceeds.

**Can it test in game?**
No. It verifies with what it can run itself: TypeScript tests, `lua-language-server --check`, `tsc`, scripts, the NUI in a browser when the harness has one, and server logs it can read. A behavior only the game client shows is reported as unverified.

## It's working if

- Each reply names the playbook it ran and the principles that changed a decision.
- Code changes arrive as small ordered commits, cleaned by `deslop` and `no-comments`, with a PR body from `pr`.
- Long or unattended runs leave a decision trail from [show-me-your-work](./show-me-your-work.md).

## Where it fits

The **router over the whole set**. It reads [principles](./principles.md), applies [lua-best-practices](../fivem/lua-best-practices.md), [typescript-best-practices](../fivem/typescript-best-practices.md) and [resource-best-practices](../fivem/resource-best-practices.md) to code, and calls the workflow skills ([how](./how.md), [why](./why.md), [architect](./architect.md), [arena](./arena.md), [swarm](./swarm.md), [interrogate](./interrogate.md)) at the steps that need them.
