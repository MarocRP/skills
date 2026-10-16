---
name: how
description: Explain how a resource or subsystem works, its runtime flow across client, server and NUI, and where things live, through read-only subagents. Use when the user asks how something works, where code should live or which layer owns it, or when a skill such as architect calls for it.
---

# How

Explore the codebase to answer "how does X work?" questions, including "where should this live" and "is this the right layer". Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

Every subagent below is read-only. Its brief carries the filled prompt template and says: inspect only, no writes, no git commands. Take each subagent's model from `~/.config/ox/models.md`, using the role its step names, and pass that line's model and effort to your subagent tool. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the subagent runs on your model; if the file is missing, also suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so. If the harness has no subagent tool, do each step yourself, in order.

When the question is about a resource the server runs but this repo doesn't own (ox_inventory, ox_core, a framework), read the copy in the server's resources folder, found from the `server root` and `resources dir` lines of `.ox/config.md` (walk up from the current directory). That copy is the version the server actually runs. If the file is missing, find the resource yourself, say so, and suggest the user run `/setup-ox`.

## 1. Assess complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple** (a single module, a small utility, a narrow question such as "how does this callback work"): no explorers. Start one `explore` subagent that explores and explains in one pass, built from [EXPLAINER-PROMPT.md](./EXPLAINER-PROMPT.md) without the parts marked *complex only*. Go to step 4.
- **Complex** (a subsystem spanning multiple files or resources, a flow that crosses the client/server boundary, a full architectural overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Decompose the question into 2 to 4 angles, each a distinct slice of the subsystem. In a FiveM resource the slices are usually the client, the server, the NUI, the boundary between them (net events, `lib.callback`, exports, state bags), and the data (database tables, `data/` files, convars). Start all explorers at once, each an `explore` subagent with [EXPLORER-PROMPT.md](./EXPLORER-PROMPT.md) and its angle filled in.

## 3. Synthesize (complex only)

Once all explorers have returned, start one `hardest tasks` subagent with [EXPLAINER-PROMPT.md](./EXPLAINER-PROMPT.md) and every explorer's findings filled in.

## 4. Present

Present the explainer's output. Light edits for clarity or context from the conversation are fine. Do not substantially rewrite it.

## Output format

The explanation uses the sections defined in [EXPLAINER-PROMPT.md](./EXPLAINER-PROMPT.md), dropping any that do not apply: Overview, Key concepts, How it works, Where things live, Gotchas.
