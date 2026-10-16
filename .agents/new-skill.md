# Adding a skill

## Where it goes

| The skill is about...                                               | Bucket          |
| ------------------------------------------------------------------- | --------------- |
| One Overextended resource (ox_lib, ox_core, ox_inventory, ...)      | `skills/ox/`    |
| FiveM resource development in general, independent of the ox stack | `skills/fivem/` |
| A general workflow tool, not specific to FiveM or the ox stack      | `skills/productivity/` |

A skill lands when it's been used in real sessions and its APIs are checked. Adding one is a `minor` changeset.

## Naming

The directory name is the skill name, and `name:` in the frontmatter must match it exactly. Lowercase letters, digits and hyphens only, so resource names swap `_` for `-`: `ox_lib` becomes `ox-lib`, `ox_inventory` becomes `ox-inventory`. `oxmysql` stays `oxmysql`.

## Layout

```
skills/<bucket>/<name>/
├── SKILL.md            # required: frontmatter + instructions
├── agents/openai.yaml  # required: Codex picker metadata
└── <TOPIC>.md          # optional: reference files SKILL.md points at
```

Keep `SKILL.md` short and load-bearing. Push long API tables, export lists and examples into sibling reference files, and have `SKILL.md` say when to read each one, so the agent only pays for them when the task needs them.

For how to word the description and the body, read [writing-for-agents](../skills/productivity/writing-for-agents/SKILL.md).

## `SKILL.md` template

```markdown
---
name: <name>
description: <What it covers, then when to use it. Model-invoked: name the triggers, e.g. "Use when the code calls exports.ox_inventory, or the user asks about item metadata, stashes or shops.">
---

<One paragraph: what the agent should know or do, and the one fact that makes this different from what it would guess.>

## <Section>

<Instructions, in the imperative. Prefer "Do X" over "You might consider X".>
```

A model-invoked skill tied to file types can add `paths` (a YAML list of globs, e.g. `"**/*.ts"`) so Claude Code loads it on its own only while working on matching files.

For a user-invoked skill, add `disable-model-invocation: true` to the frontmatter and write the `description` for a human browsing slash-commands. See [invocation.md](./invocation.md).

## `agents/openai.yaml` template

```yaml
interface:
  display_name: "<Display Name>"
  short_description: "<Under ~60 chars>"
```

For a user-invoked skill, append:

```yaml
policy:
  allow_implicit_invocation: false
```

## Project config

If the skill's output depends on the user's project (framework, an ox resource's version, Lua or TypeScript), read `.ox/config.md`, walking up from the current directory. Spell it out in `SKILL.md`, e.g.:

> Read the `framework` and `ox resources` lines of `.ox/config.md` (walk up from the current directory to find it). If the file or a line is missing, detect it from the server's `fxmanifest.lua` files instead, say so, and suggest the user run `/setup-ox`.

Never require the file: a skill still works without it, just with an extra detection step.

## Subagents

A skill that starts a subagent names its role and takes the model from `~/.config/ox/models.md`. Spell it out, e.g.:

> Start one `review` subagent per changed resource. Use the `review` line of `~/.config/ox/models.md`: pass its model and effort to your subagent tool. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the subagent runs on your model; if the file is missing, also suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so.

Use only the roles `setup-ox` defines. A new role is added to `setup-ox` first (its table, its file shape, and the default model rule) in the same change.

## Accuracy

Every API a skill teaches (export names, function signatures, callback shapes, convars) is checked against the resource's current source, not recalled from memory. An agent trusts the skill over its own guess, so a wrong signature in a skill is worse than no skill. Where behaviour differs between resource versions, say which version the skill describes.

## Done when

- `SKILL.md` and `agents/openai.yaml` exist, and their invocation settings agree.
- The skill is listed in its bucket `README.md` and the top-level `README.md`.
- It's in `.claude-plugin/plugin.json`'s `skills` array.
- It has a docs page at `docs/<bucket>/<name>.md` (see [writing-docs.md](./writing-docs.md)).
- `claude plugin validate .` passes.
- A changeset describes the change (`npx changeset`).
