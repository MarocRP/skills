## What it does

`writing-for-agents` is a reference for writing anything an agent reads: a skill, an `AGENTS.md` or `CLAUDE.md`, or a doc an agent reaches through a link. It names the levers that make an agent take the same path through a document every run: how a pointer is worded, what stays in the main file and what moves behind a link, how each step says when it's done, and which lines to cut.

Most agent docs fail by growing, not by being wrong. Each added line feels safe, and the instructions that matter end up buried. The skill gives the agent a way to judge every line by whether it changes what the agent does.

## When to reach for it

Type `/writing-for-agents`, or the agent reaches for it automatically when it creates or edits a skill, or changes an `AGENTS.md` or `CLAUDE.md`. For prose people read, such as a README or release notes, use [unslop](./unslop.md) instead.

## The levers

| Lever | The question it answers |
| --- | --- |
| Context pointers | Does this description or `AGENTS.md` line name each case that should load the material, once? |
| Information hierarchy | Does every path through the document need this inline, or only some, so it belongs in a linked file? |
| Completion criteria | Can the agent tell when a step is done, and does the bar force thorough work? |
| Leading words | Can one familiar word replace a phrase repeated at several sites? |
| Pruning | Does the line change behaviour, and is it the only place this meaning lives? |

When the document is a skill, it also covers choosing between model-invoked and user-invoked, and when to split one skill into two.

## Common questions

**Should my skill be model-invoked or user-invoked?**
Model-invoked only if the agent, or another skill, has to reach it on its own. Its description then sits in the agent's context on every turn. Otherwise make it user-invoked, which costs nothing until you type it.

**Should I copy my convars and manifest layout into `AGENTS.md`?**
Only what the agent can't find by reading `fxmanifest.lua` or `server.cfg`: the reason behind a choice, an unwritten convention, a gotcha. A copied lookup goes stale.

## It's working if

- A skill's description names each distinct case it handles once, with no synonyms for the same case.
- Steps end on a condition the agent can check.
- Instructions say what to do rather than what to avoid.
- Edits to an agent doc remove lines as often as they add them.

## Where it fits

A **reach-for-it-anytime** reference for anyone writing their own skills or an `AGENTS.md` for a server or resource. It pairs with [unslop](./unslop.md), which does the same job for prose people read.
