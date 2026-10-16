---
name: lua-best-practices
description: Lua best practices for FiveM resources built on ox_lib, the way Overextended structures its own resources. Use when reading or editing any .lua file or fxmanifest.lua, or when the user asks when to use require, lib.load or lib.loadJson, how to split a resource into modules, where config goes, or how to use cache, lib.onCache, lib.points, lib.callback or locales.
paths:
  - "**/*.lua"
---

# Lua best practices

Write resource Lua the way Overextended writes ox_inventory, ox_target and ox_fuel: one entry script per side, every other file a module loaded with `require`, data loaded with `lib.load`, settings read from convars, and ox_lib's `cache` and `lib.*` modules instead of hand-rolled loops. Checked against ox_lib 3.40.3. Read the `ox resources` line of `.ox/config.md` (walk up from the current directory) for the server's ox_lib version; if it is older, check anything below against that version's source.

Including `@ox_lib/init.lua` replaces the global `require` with ox_lib's own loader. It resolves paths from the resource root, not the calling file, and it can load files from other resources. Everything below assumes it.

## Loading code and data

| Call | Use it for | How it behaves |
|------|------------|----------------|
| `require 'client.utils'` | Code modules: files that define functions or state and `return` a table | Runs the file once per resource and side, then returns the cached value to every later caller, so every module shares one instance. Errors on a circular require. A file that returns nothing gives `true`. |
| `lib.load 'data.stations'` | Data files (`data/*.lua` returning a table), and files run for their side effects | Runs the file on every call and returns a fresh value; nothing is cached. Takes an optional environment table as its second argument. |
| `lib.loadJson 'data.prices'` | JSON data files | Reads `data/prices.json` and returns the decoded table. |
| `require '@ox_core.lib.init'` | Another resource's Lua library | Runs that file inside your resource: you get your own copy, not shared state. Read another resource's live state through its exports. |

Path rules, shared by all three:

- Dots separate directories and there is no extension: `require 'modules.inventory.server'` loads `modules/inventory/server.lua`. File names can't contain dots.
- `require 'client'` tries `client.lua`, then `client/init.lua`.
- `@resource.path` loads from another resource; `@resource` alone loads its `init.lua`.
- A file loaded on the client must be listed in the manifest's `files`. Server-side files load from disk and need no listing.

Choosing:

- **Code goes through `require`.** Put `local utils = require 'client.utils'` at the top of the file that uses it, and end every module with `return` of its table.
- **Data goes through `lib.load`**, called once where the data is consumed (`for id, data in pairs(lib.load('data.crafting') or {}) do`). It isn't cached, so never call it inside a loop or an event handler.
- **Read-only config shared by several modules** can be a module: `config.lua` returns a table and every file does `local config = require 'config'`.
- **A file is a manifest script or a module, never both.** Listing a file in `client_scripts` and also requiring it runs it twice.
- **Load optional parts lazily**: `if config.ox_target then return require 'client.target' end`, or a framework bridge required only in the branch that detects that framework.
- Don't hand-roll `LoadResourceFile` plus `load`. ox_inventory's own `data()` loader is deprecated in favour of `lib.load`.

## Manifest

- `fx_version 'cerulean'`, `lua54 'yes'` and `use_experimental_fxv2_oal 'yes'`, as every ox resource has.
- `shared_script '@ox_lib/init.lua'` comes before any of the resource's own scripts, and `ox_lib` is in `dependencies`.
- One entry script per side (`client/init.lua`, `server/init.lua`, or a single `init.lua` that ends with `require 'server'` or `require 'client'` depending on `lib.context`). The entry script requires everything else.
- `files` lists every module, data file and locale the client loads (`'client/*.lua'`, `'data/*.lua'`, `'locales/*.json'`). Every client downloads everything in `files`, so don't list server-only code there.
- `ox_libs { 'locale', 'table' }` loads those `lib` modules when the resource starts. Listing `locale` there also loads the locale strings, which ox_lib prefers over calling `lib.locale()` yourself. Any other `lib.*` module loads on first use, so never `require` one.

## Config

- **Settings a server owner tunes** are convars named `<resource>:<setting>`, read once at the top of the file that uses them: `GetConvarInt('ox_target:debug', 0)`, `GetConvarBool('inventory:target', false)`, `GetConvar('ox_target:defaultHotkey', 'LMENU')`. Structured settings go through `json.decode(GetConvar(...))`. Owners set them in `server.cfg`, so an update never overwrites their changes.
- **Structured data** (locations, items, shops, recipes) lives in `data/*.lua` files returning tables, loaded with `lib.load`.
- **A small resource** can use a `config.lua` that returns a table, required as a module. Follow whichever approach the resource already uses.

## Scope

- Every variable, function and module table is `local`. A module is `local Utils = {}`, its functions `function Utils.raycast(...)`, and `return Utils` at the end.
- A global is a deliberate choice for state every file on that side reads, never a forgotten `local`. All of a resource's scripts and modules on one side share one global scope.
- In a hot loop, cache a native as a local upvalue: `local GetVehiclePedIsIn = GetVehiclePedIsIn`.

## Layout

Code reads top to bottom in short steps, with blank lines between them and few long lines.

- One statement per line. `count = 0 return false` is two lines.
- A blank line between steps: the guards, the lookups, the work, the reply.
- A guard stays on one line only when it's short and its body is a bare `return` or `return false`: `if not player or not player.shop then return false end`. A guard that returns a table or does more goes across lines.
- A condition too long for one line becomes several guards, never one `if` wrapped across lines.
- A call or table constructor that runs past about 120 characters goes one argument or field per line. Shorter ones stay on one line.
- Indent with whatever `.editorconfig` or the file uses.

## ox_lib at runtime

- **`cache`** holds the player's state on the client, refreshed every 100 ms: `cache.ped`, `cache.vehicle` (`false` on foot), `cache.seat`, `cache.weapon`, plus `cache.playerId` and `cache.serverId`. Both sides have `cache.resource` and `cache.game`. Read `cache.ped`, not `PlayerPedId()`.
- **`lib.onCache('vehicle', function(value, oldValue) end)`** runs when a cached value changes. Use it instead of a loop that polls for the change.
- **Threads:** `CreateThread` and `Wait`. For repeating work use ox_lib's `SetInterval(fn, ms)` and `ClearInterval(id)`. For "do something near a location" use `lib.points.new({ coords = ..., distance = ..., onEnter = ..., onExit = ..., nearby = ... })`, not a distance loop. To wait for a value, use `lib.waitFor(fn, errMessage, timeout)`, which errors after `timeout` ms (default 1000).
- **Callbacks:** the server registers `lib.callback.register(name, function(source, ...) end)` and the client calls `lib.callback.await(name, delay, ...)`. `delay` is a client-side rate limit in ms, or `false`; a throttled call returns nothing. The client chooses every argument, so the server callback checks each one (type, range, ownership, distance) before acting.
- **Locales:** `locales/en.json` is the fallback, merged under the language set by the `ox:locale` convar. `locale('key', ...)` formats with `string.format` and returns the key itself when it's missing.
- **Logging:** `lib.print.error`, `warn`, `info`, `verbose`, `debug`. Owners filter them with the `ox:printlevel` convar, or `ox:printlevel:<resource>` for one resource.
- **Dependencies:** check a minimum version at the top of the entry script with `if not lib.checkDependency('ox_lib', '3.30.0', true) then return end`. Guard an optional resource with `GetResourceState('ox_target') == 'started'`.

## CfxLua

FiveM's Lua 5.4 runtime adds syntax that ox resources use everywhere. Match it:

- Backtick hashes for constant names: `` `WEAPON_UNARMED` `` is hashed at compile time. Keep `joaat(name)` for names built at runtime.
- Safe navigation: `data.server?.export` instead of `data.server and data.server.export`.
- Compound assignment: `count += 1`.
- `table.create(arraySize, hashSize)` to preallocate, `table.wipe(t)` to clear in place.

## Annotations

Annotate module functions with LuaLS comments (`---@param`, `---@return`, `---@class`) and narrow with `--[[@as OxClient]]` where a value's type can't be inferred. ox_lib ships its own annotations, so `lib.*` calls type-check in the editor.

## Examples

Read [PATTERNS.md](./PATTERNS.md) for a full resource layout and an example of each section.
