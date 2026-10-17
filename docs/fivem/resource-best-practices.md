## What it does

`resource-best-practices` gives the agent the defaults every FiveM resource should follow, on any framework, when it writes, edits or reviews code. It covers the standard habits that aren't security: where entities spawn, when to take network control, cleaning up after players and restarts, events over loops, keeping network traffic small, and database calls.

The default it changes most: entities are spawned on the client and non-networked unless players truly have to share one, and then the server spawns them. Network control is only requested when an action needs it, and the server whitelists that entity for that action.

## When to reach for it

- Type `/resource-best-practices`, or the agent reaches for it automatically. In Claude Code it loads on its own while the agent works on `.lua`, `.ts` or `.js` files.
- Reach for this when writing, changing or reviewing a resource, or when one doubles up after a restart, hitches, or floods the network.
- For how to structure the files themselves, use [lua-best-practices](./lua-best-practices.md) or [typescript-best-practices](./typescript-best-practices.md). It doesn't cover security or NUI.

## What it covers

| Area | The rule |
| --- | --- |
| Entities | Client and non-networked by default; networked ones spawned and deleted by the server. No network control unless the server whitelists it. Works with networked sounds, ragdoll requests and script entity states blocked. Models released after use. |
| Lifecycle | Everything created is cleaned up on player drop, logout and `onResourceStop`. Handlers registered once. |
| Events and network | Events and state-bag handlers before loops. `source` copied before the first yield. Targeted sends, deltas, small state bags written only by the server. |
| Data | SQL in one module, parameterised and limited, conditional writes instead of read-then-write. Secrets in `set` convars. |

## It's working if

- Props and peds that don't need to be shared are created on the client and non-networked, with `lib.prop.create` or `lib.ped.create`.
- `NetworkRequestControlOfEntity` appears only behind a server-side `SetEntityIgnoreRequestControlFilter` for that entity.
- `DeleteEntity` on a networked entity appears only in server code.
- Restarting the resource twice leaves nothing doubled.
- Server handlers copy `source` on their first line.
- Replicated state-bag writes (`setr`) appear only in server code.

## Where it fits

A **reach-for-it-anytime** standard for any resource. It pairs with [lua-best-practices](./lua-best-practices.md) and [typescript-best-practices](./typescript-best-practices.md), which shape the code's structure, and [deslop](./deslop.md), which tidies what's left before you commit.
