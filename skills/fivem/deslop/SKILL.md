---
name: deslop
description: Remove AI-generated slop from FiveM resource code (Lua, TypeScript, JavaScript) without changing behaviour. Use when the user asks to deslop, clean up or tidy code an agent wrote, or after finishing a change to a resource and before it is committed.
---

# Remove AI code slop

Find the code changed on this branch and remove the AI-generated slop introduced in it. Behaviour stays the same: this is a cleanup, not a refactor.

## Scope

- **Git repository**: diff against the merge base with the default branch (`git merge-base HEAD origin/HEAD`, else `main` or `master`), plus uncommitted changes.
- **No git** (common for a server folder): use the files changed in this session. If there were none, ask which resource or files to clean.

Only touch lines the diff introduced. The code around them sets the style; it isn't the target.

## Focus areas

Judge each candidate against the file and the rest of its resource: what is slop in one resource is house style in another.

**Everywhere**

- Comments that narrate the code (`-- loop through players`), restate a function name, or don't match how the file comments.
- Leftover debugging: stray `print` or `console.log`, commented-out code.
- Deep nesting that an early `return` flattens.
- Packed code. See [Layout](#layout).
- Locals, imports or parameters the branch added and nothing uses.
- Names out of step with the file (camelCase in a snake_case file, or the reverse).

**Lua**

- `pcall` wrappers and nil checks around values that can't be nil on a trusted path: an export of a resource the manifest declares as a dependency, a value the same function just set.
- Comparisons to `true` or `false` (`if isOpen == true then`) when the file doesn't write them.
- New globals where the file declares `local`. Before making one local, search the whole resource for other uses: every Lua file of a resource shares one global scope per side, so another file may read it.
- `Citizen.CreateThread` / `Citizen.Wait` mixed with `CreateThread` / `Wait` in one file. They are the same functions: match the file.
- A hand-rolled helper the resource already gets from ox_lib, when ox_lib is a dependency of the resource: a `contains` loop beside code that uses `lib.table.contains`, a `RequestModel` / `HasModelLoaded` wait loop where the resource uses `lib.requestModel` elsewhere. Swap only when the ox_lib function does the same thing; read its source for differences (timeouts, return values, errors) first.

**TypeScript / JavaScript**

- Casts to `any`, `as unknown as`, and `@ts-ignore` / `@ts-expect-error` used only to silence a type error.
- `try` / `catch` around trusted calls that only logs and carries on.

## Layout

Agents pack code: several statements on a line, guard after guard with no blank line between, a condition wrapped across lines to stay in one `if`. Judge layout against the file on the default branch or files the branch didn't touch, never against the branch's own code: when the branch wrote most of a file, its layout is the slop.

- One statement per line.
- A blank line between steps: the guards, the lookups, the work, the reply.
- A guard stays on one line only when it's short and its body is a bare `return` or `return false`. A guard that returns a table or does more goes across lines.
- A condition too long for one line becomes several guards, never one `if` wrapped across lines.
- A call or table constructor that runs past about 120 characters goes one argument or field per line. Shorter ones stay on one line.

Before:

```lua
if type(data) ~= 'table' or type(data.slot) ~= 'number' or type(data.count) ~= 'number'
    or data.count < 1 then return false end
local player = GetPlayer(source)
if not player or not player.shop then return false end
local item = player.shop.items[data.slot]
if not item then return false end
if item.license and not HasLicense(player, item.license) then return false, { type = 'error', description = 'missing_license' } end
```

After:

```lua
if type(data) ~= 'table' then return false end

if type(data.slot) ~= 'number' or type(data.count) ~= 'number' or data.count < 1 then
    return false
end

local player = GetPlayer(source)

if not player or not player.shop then return false end

local item = player.shop.items[data.slot]

if not item then return false end

if item.license and not HasLicense(player, item.license) then
    return false, { type = 'error', description = 'missing_license' }
end
```

## Never remove

Server code that receives anything from a client is not a trusted path. Keep every check on:

- arguments of server-side net event handlers (`RegisterNetEvent`, `AddEventHandler` on a net event) and of server-side `lib.callback.register` callbacks;
- lookups derived from `source`: the player exists, owns the item, is near the target, has the job or group;
- rate limits, distance checks and permission checks (`IsPlayerAceAllowed`, framework job or group checks).

A generic cleanup reads these as defensive noise, and they are what stops exploits. If one really looks redundant, leave it and mention it in the summary. Splitting a check into its own guard or onto its own line is fine: every check stays.

Also keep checks on data from the database, from NUI callbacks (`RegisterNUICallback`), and guards around optional resources (`GetResourceState(name) == 'started'`).

## Guardrails

- Keep behaviour unchanged unless fixing a clear bug, and name any bug fix in the summary.
- Prefer minimal, focused edits over broad rewrites. Layout is the exception: fix every packed line the branch added, not a sample. Don't reformat code it didn't touch.
- Keep the final summary concise (1-3 sentences).
