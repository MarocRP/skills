## What it does

`how` answers "how does X work?" about a resource or subsystem with the explanation a senior engineer would give someone joining the project: what it is, the concepts you need, the flow step by step with the file for each step, where things live, and the gotchas. It also answers "where should this live" and "is this the right layer".

It reads before it explains. A narrow question gets one read-only subagent that explores and writes in one pass. A subsystem that spans files, resources, or the client/server boundary gets two to four explorers, each tracing one slice in parallel, and one explainer that reconciles their findings against the code.

## When to reach for it

Type `/how` followed by the question, or the agent reaches for it automatically when you ask how something works or where code belongs, and when [architect](./architect.md) grounds a design. Reach for it before changing code you don't know or when onboarding onto a resource.

## How it splits a big question

| Slice | What the explorer traces |
| --- | --- |
| Client | Entry script, threads, points, target options |
| Server | Event and callback handlers, validation, persistence |
| NUI | Components, NUI messages and callbacks |
| Boundary | Net events, `lib.callback`, exports and state bags between them |
| Data | Database tables, `data/` files, convars |

When the question is about a resource you don't own, such as ox_inventory, it reads the copy in your server's resources folder, the version you actually run, not whatever the agent remembers.

## Common questions

**Which models do the subagents use?**
Explorers use the `explore` line of `~/.config/ox/models.md`, and the explainer that combines their findings uses the `hardest tasks` line. Run [`/setup-ox models`](../ox/setup-ox.md) to set them. Without the file, every subagent runs on your session's model.

## It's working if

- The explanation names files and functions for each step instead of describing them abstractly.
- A flow that crosses client, server and NUI comes with a diagram.
- Gaps the explorers couldn't trace are listed, not papered over.

## Where it fits

The **before you change it** step. Use `how` to learn the code, then write with [lua-best-practices](../fivem/lua-best-practices.md) or [typescript-best-practices](../fivem/typescript-best-practices.md), and open the PR with [pr](./pr.md).
