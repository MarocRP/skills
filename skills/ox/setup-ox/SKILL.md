---
name: setup-ox
description: Configure the Overextended skills. Picks which model and reasoning level each subagent role uses within a budget you choose, then detects your FiveM server, its ox resources and framework. Writes `~/.config/ox/models.md` and `.ox/config.md`, which the other ox skills read.
argument-hint: "[models | project]"
disable-model-invocation: true
---

# Setup ox

Write the two files the ox skills read when they run:

- **`~/.config/ox/models.md`** (Part A): which model and reasoning level each subagent role uses. It belongs to the user and their harness, so it lives in their home directory and is never committed.
- **`.ox/config.md`** (Part B): what this server runs: where it is, which ox resources and versions, which framework, which language. It belongs to the project, at the server root.

Run Part A, then Part B. If the user passed `models` or `project` as an argument, run only that part.

## Part A: models and budget

### A1. Detect available models

Read the parameters of the tool your harness uses to start a subagent. The models and the reasoning-effort levels it enumerates are the only valid entries. In Claude Code that is the Agent tool's `model` and `effort` parameters. Never write a model or effort the tool does not list. An entry is `<model>`, plus `(<effort>)` when the tool takes an effort.

If the harness has no subagent tool, or the tool takes no model, say so and write `inherit` for every role. `inherit` is always valid: the role runs on the parent session's model and reasoning level.

In T3 Code the subagent tool is `delegate_task`, and `orchestrator_capabilities` lists the models of every provider whose `canRunChildTask` is true. An entry there is `<providerInstanceId>/<model> (<effort>)`, with the effort option that tool lists for the model, so a panel can span providers.

Record the harness by name (`claude-code`, `codex`, `t3-code`, `cursor`, ...): entries are only valid in the harness that listed them.

### A2. Load current state

If `~/.config/ox/models.md` already exists, read it. Treat its `# budget` line and its role values as the current choices. If its `# harness` line names a different harness from this one, its entries don't apply here: start from the defaults and say so. Drop any line whose role isn't in A5.

### A3. Budget, map, and confirm

**(a) Ask for a budget.** Ask plainly in the thread. Offer these four options with these exact labels, and name the current budget when the file records one.

- `unlimited - max reasoning`
- `large - xhigh reasoning`
- `medium - high reasoning`
- `small - medium reasoning`

**(b) Apply it.** Build the working table from the defaults, and on a re-run keep any role the user changed by hand. The defaults:

| Role | What runs in it | Default model |
| --- | --- | --- |
| `explore` | Read-only searches across resources and ox source: finding exports, events, callers, convars | The fastest model detected |
| `verify api` | Checking an export, function signature or callback shape against the resource's current source before code uses it | The fastest strong coding model detected |
| `implement` | Writing or changing resource code: client, server, shared, NUI | The fastest strong coding model detected |
| `review` | Reviewing a change for bugs, ox API misuse, and server trust (client-triggered events, unvalidated input, exploits) | The most capable model detected |
| `hardest tasks` | Designing a resource, debugging problems that cross resources or the client/server boundary, explaining a subsystem from several explorers' findings | The most capable model detected |
| `panel` | Running one task on several models side by side: arena candidates, architect sketches, interrogate reviewers. A list, one seat per entry | The most capable model of each provider detected, up to three. With one provider, its most capable models, up to three |

`unlimited`, `large`, `medium` and `small` set the effort of every entry to `max`, `xhigh`, `high` or `medium`, on the ladder `max` > `xhigh` > `high` > `medium` > `low`. If a model doesn't list the target, use the highest ladder option below it that the model lists, else mark the role as needing a choice. Never pick an option off the ladder. A model with no effort option gets no `(<effort>)`. `inherit` doesn't change. In `panel`, the effort applies to every entry.

**(c) Show the roles and confirm.** Show every role with its entry, marking any entry not in the detected set as needing a choice. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit` as the options. For `panel`, the user picks a list: its length sets how many seats run. Ask plainly in the thread.

### A4. Validate

Every entry written, including each `panel` entry, is in the A1 result: the model is one the subagent tool lists, and its effort, when it has one, is one the tool lists. `inherit` always passes. If a chosen entry isn't available, stop and ask again.

### A5. Write the file

Write `~/.config/ox/models.md` (create `~/.config/ox/` if it is missing). Overwrite the whole file so re-runs stay idempotent. Shape:

```
# ox skills model configuration. Written by /setup-ox. One line per role.
# Delete a line, or write `inherit`, to run that role on the parent session's model and reasoning level.
# harness: <harness>
# budget: <label> (<effort>)
explore: <model> (<effort>)
verify api: <entry>
implement: <entry>
review: <entry>
hardest tasks: <entry>
panel: <entry>, <entry>, <entry>
```

## Part B: project

### B1. Find the server root

Start from the current directory and walk up until you find a `server.cfg`, or a directory holding both `resources/` and a `server.cfg`. That directory is the **server root**. If the current directory is a single resource (it has an `fxmanifest.lua`), keep walking up past it.

- **One server root found**: use it.
- **Several found** (e.g. a repo holding more than one server): list them and ask which one.
- **None found**: this is a standalone resource repo. Ask for the path to the server it runs on. If the user has none, use the current directory as the root and record `server root: none`.

### B2. Detect

Read the server; don't assume. Every value below comes from a file you read, never from memory. Hand this to an `explore` subagent when the server is large, using its line from `~/.config/ox/models.md`.

- **Resources.** Find every `fxmanifest.lua` under the server root's `resources/`, including bracket folders like `[ox]`. The resource name is its folder name. Read the `version` field of each.
- **ox resources.** From that list, keep every resource whose name starts with `ox_`, plus `oxmysql`. Record each name with its version.
- **Framework.** Look for `ox_core`, `qbx_core`, `es_extended`, `qb-core` and `ND_Core` in the resource list. Record each one present with its version.
- **Started resources.** Read the `ensure` / `start` lines in `server.cfg`, following any `exec` into other `.cfg` files. A resource that exists but is never started is listed as present but not started.
- **Locale.** Read the `ox:locale` convar from the cfg files if it is set.
- **Language.** For each resource the user owns (outside the ox resources and the framework), note whether it is Lua (`.lua` scripts in its manifest) or TypeScript/JavaScript (a `package.json`, a build step, scripts pointing into `dist/`).
- **Resources dir.** Find the folder the user's own resources live in, usually `resources/[local]` or similar. Pick the bracket folder holding the most user-owned resources.

The cfg files hold secrets (`mysql_connection_string`, `sv_licenseKey`, `steam_webApiKey`, `set` lines with tokens). Never copy a secret into the config file or into your reply, and never echo a whole cfg line that holds one.

Never read files such as `secrets.cfg` or `tokens.cfg` that are meant to be private.

### B3. Load current state

If `.ox/config.md` already exists at the server root, read it. Treat its values as the current choices, and mark every line where detection now disagrees with it (a resource updated, removed, or added since the last run). Drop any line whose key isn't in B6.

### B4. Show and confirm

Show the user one table: every setting from B6 with its detected value, marking anything that disagrees with the current file and anything detection couldn't settle as **needs a choice**. Then ask, in one message, whether to accept it as-is or change specific lines.

Where a line needs a choice, offer these options with these exact labels:

- **framework**: `ox_core`, `qbx_core`, `es_extended`, `qb-core`, `ND_Core`, `standalone`. If more than one framework is started, ask which one new code targets.
- **language**: `lua`, `typescript`, `javascript`. Default to the language most of the user's resources use, else `lua`.
- **resources dir**: the detected folder, or a path the user gives.

Skip any question detection already settled unambiguously; the table already shows the answer.

### B5. Validate

- `framework` is either `standalone` or a resource present in the server. If it is present but not started, say so.
- `resources dir` exists under the server root.
- If `ox_lib` isn't present, warn that most ox skills assume it and ask whether to continue.
- Every version written is the one read from that resource's `fxmanifest.lua`.

If a value fails, stop and ask again.

### B6. Write the file

Write `.ox/config.md` at the server root (create `.ox/` if it is missing). Overwrite the whole file so re-runs stay idempotent. Shape:

```
# ox setup. Written by /setup-ox. Re-run it after adding, removing or updating resources.
# Delete a line to make skills detect that value themselves.
server root: <path from this file to the server root, "." when they are the same, or "none">
resources dir: <path relative to the server root>
framework: <name> <version>, or standalone
language: lua | typescript | javascript
locale: <value of ox:locale>, or en (ox_lib's default when it is unset)
ox resources: <name> <version>, <name> <version>, ...
not started: <name>, <name>, ... or none
```

If the project is a git repository, ask whether `.ox/` should be committed (so everyone on the project shares it) or added to `.gitignore`. Recommend committing it.

## Confirm

Tell the user which files were written. The ox skills read them the next time they run. Re-running `/setup-ox` updates them: `/setup-ox models` after changing plan or harness, `/setup-ox project` after any resource update, since skills teach the API of the version recorded in `.ox/config.md`.
