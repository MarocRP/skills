## What it does

`setup-ox` writes the two files the other ox skills read before they act:

| File | Holds | Belongs to |
| --- | --- | --- |
| `~/.config/ox/models.md` | Which model and reasoning level each subagent role uses | You and your harness. Never committed |
| `.ox/config.md` | Server root, ox resources and versions, framework, language, locale | The project. Committed by default |

It never offers a model your agent can't run. The model list comes from the parameters of your harness's own subagent tool, and the server facts come from your `fxmanifest.lua` and `server.cfg` files. You only answer what detection couldn't settle on its own.

## When to reach for it

You invoke this by typing `/setup-ox`; the agent won't reach for it on its own. Run it once before using the other ox skills. Run `/setup-ox models` again after you switch plan or harness, and `/setup-ox project` after you add, remove or update a resource.

## Budgets and roles

The **budget** sets how hard every subagent thinks:

| Budget | Reasoning effort |
| --- | --- |
| `unlimited` | `max` |
| `large` | `xhigh` |
| `medium` | `high` |
| `small` | `medium` |

The **role** sets which model it runs on:

| Role | Default model |
| --- | --- |
| `explore`: searching resources and ox source | Fastest |
| `verify api`: checking a signature against the resource's source | Fastest strong coding model |
| `implement`: writing resource code | Fastest strong coding model |
| `review`: bugs, ox API misuse, client-trusting server code | Most capable |
| `hardest tasks`: designing a resource, cross-resource debugging, explaining a large subsystem | Most capable |
| `panel`: several models on one task (arena, architect, interrogate) | Most capable of each provider, up to three |

You can override any single role, or set it to `inherit` to run on whatever your main session uses.

## Common questions

**Does it read my database password?**
It reads the cfg files to find `ensure` lines and convars, which means it sees `mysql_connection_string` and your license key. It never copies a secret into either file or into its reply, and it skips files like `secrets.cfg` entirely.

**Why two files?**
Models depend on you: your plan, your harness. Server facts depend on the project. Committing `.ox/config.md` shares the server facts with everyone without pushing your model choices onto them.

**I use Claude Code and Codex. Do I run it twice?**
The models file records which harness listed its models. A skill running in a different harness ignores the entries and runs every subagent on the session's own model, until you run `/setup-ox models` there.

**Do I need it for the other skills to work?**
No. Without the files, subagents run on your session's model and skills detect what they need themselves. Each one suggests `/setup-ox` when it notices.

## It's working if

- `.ox/config.md` lists the versions you see in your resources' `fxmanifest.lua` files.
- Every model in `~/.config/ox/models.md` is one your agent offers when it starts a subagent.
- Re-running it shows only the lines that changed.

## Where it fits

A **run-once setup**, repeated after resource updates or a harness change. Every other skill in [ox](../../skills/ox/README.md) reads what it writes.
