## What it does

`lua-best-practices` makes the agent write resource Lua the way Overextended writes ox_inventory, ox_target and ox_fuel: one entry script per side, every other file a module, data in `data/`, settings in convars, and ox_lib's `cache` and `lib.*` modules instead of hand-rolled loops.

Its core is knowing which loader to use. Including `@ox_lib/init.lua` replaces Lua's `require` with ox_lib's, which caches each module and resolves paths from the resource root. `lib.load` runs a file fresh on every call. An agent that mixes them up shares one mutable data table across every module, or re-reads a file on every event.

## When to reach for it

Type `/lua-best-practices`, or the agent reaches for it automatically. In Claude Code it loads on its own whenever the agent reads or edits a `.lua` file, including `fxmanifest.lua`.

For TypeScript resources, use [typescript-best-practices](./typescript-best-practices.md) instead.

## Which loader

| Call | For | Cached |
| --- | --- | --- |
| `require 'client.utils'` | Code modules that `return` a table | Yes: every caller gets the same table |
| `lib.load 'data.shops'` | Data files, and files run for their side effects | No: a fresh value on every call |
| `lib.loadJson 'data.prices'` | JSON files | No |
| `require '@ox_core.lib.init'` | Another resource's Lua library | Yes, as your own copy, not that resource's live state |

A file the client loads has to be listed in the manifest's `files`. A file listed as a `client_script` and also required runs twice.

## Common questions

**Do I still need `lib.require`?**
No. It's the same function: including `@ox_lib/init.lua` makes the global `require` point at it.

**Where should config go?**
Settings a server owner tunes go in convars named `<resource>:<setting>`, set in `server.cfg`, so an update never overwrites them. Structured data such as locations, items and shops goes in `data/*.lua`. A small resource can keep a `config.lua` that returns a table. The skill follows whichever approach your resource already uses.

**Can I require another resource's module to read its data?**
You can load its code, but you get your own copy running in your resource. To read another resource's live state, call its exports.

## It's working if

- The manifest lists one `client_script` and one `server_script`, and `files` lists the rest of the client's modules.
- Data files are loaded with `lib.load`, once, at the top of the file that uses them.
- Client code reads `cache.ped` and reacts with `lib.onCache` instead of polling natives in a loop.
- Server callbacks check every argument before acting on it.

## Where it fits

A **reach-for-it-anytime** set of habits for any Lua resource on ox_lib. It pairs with [deslop](./deslop.md): this skill shapes the code as it's written, and `deslop` tidies what's left before you commit.
