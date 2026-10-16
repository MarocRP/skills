## What it does

`typescript-best-practices` makes the agent write TypeScript where the compiler rejects impossible states: discriminated unions instead of optional-field bags, branded ids, `unknown` instead of `any`, exhaustive switches, and no `as` casts that haven't been earned.

In a FiveM resource the type safety leaks out at the runtime's edges. `onNet` takes a plain `Function`, every export returns `any`, and state bags are indexed as `any`, so writing `(item: string, count: number) =>` on a net event handler compiles while checking nothing. The skill has the agent parse data at those edges and trust the types everywhere else.

## When to reach for it

Type `/typescript-best-practices`, or the agent reaches for it automatically. In Claude Code it loads on its own whenever the agent reads or edits a `.ts`, `.tsx` or `.svelte` file, which covers client and server scripts as well as a NUI written in React or Svelte.

For cleaning up code an agent already wrote, use [deslop](./deslop.md) instead.

## The boundaries it watches

| Boundary | What the agent does |
| --- | --- |
| Server `onNet` handlers | Takes arguments as `unknown` and runs them through a parse function that returns the typed value or `null` |
| `onClientCallback` (ox_lib) | Same: the arguments come from a client |
| Optional arguments | Checks them with `!= null`, since MessagePack can turn an omitted value into `null` |
| `RegisterNuiCallback` | Parses the data, and keeps the server re-checking anything forwarded to it |
| `exports.<resource>` | Wraps each export it uses in one typed function |
| State bags | Parses values where they're read |
| `triggerServerCallback<T>` (ox_lib) | Treats `T` as unchecked, and handles the call resolving to nothing when its rate limit drops it |
| KVP, convars, `JSON.parse`, database rows | Parses them into a named type, with a version field on persisted JSON |

It also copies `source` into a local before any `await`, since the next event overwrites the global.

## Common questions

**Do I need zod or another schema library?**
No. FiveM resources validate with plain TypeScript: small functions that take `unknown` and return the typed value or `null`. The skill reuses the ones your resource already has and never adds a dependency.

**Does it apply to Lua resources?**
No. It only covers TypeScript, including a TypeScript NUI in an otherwise Lua resource.

## It's working if

- Net event and callback handlers on the server take `unknown` arguments and pass them through a parse function.
- `as` appears only right after a check that proves it.
- Optional network values are checked with `!= null`, not `!== undefined`.
- Adding a variant to a union breaks the build at every `switch` that doesn't handle it.
- The client script and the NUI import one shared message type instead of declaring it twice.

## Where it fits

A **reach-for-it-anytime** set of habits for any TypeScript resource. It pairs with [deslop](./deslop.md): this skill shapes the code as it's written, and `deslop` tidies what's left before you commit.
