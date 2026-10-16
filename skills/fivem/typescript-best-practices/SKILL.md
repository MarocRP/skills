---
name: typescript-best-practices
description: TypeScript best practices for FiveM resources and their NUI. Use when reading or editing any .ts or .tsx file or a .svelte file with <script lang="ts">, or when the user asks how to type net events, callbacks, exports, NUI messages or state bags.
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.svelte"
---

# TypeScript best practices

Make the compiler reject impossible states, mixed-up ids and unhandled variants. In a FiveM resource most of the type safety leaks out at the runtime's edges: `onNet`, `exports`, state bags and NUI callbacks are typed `any` or `Function`, so a type annotation there is a cast that nothing checks. Parse at those edges and trust the types everywhere else.

## Principles

- **Make illegal states unrepresentable.** If you can write a comment explaining when a combination of fields is valid, split it into a discriminated union.
- **Build types, don't restrict them.** Choose the shape that can't hold the illegal value (a head plus a rest, a start plus a duration) instead of a loose type plus runtime checks.
- **Don't lie to the compiler.** If it can't prove a fact, prove it (validate, narrow, remodel). Trace every `any`, `as` and `!` to the boundary and validate there.
- **Strengthen a type only where partiality appears.** A `!`, a cast or a "should never happen" throw marks a type that is too weak. Push that check into the type, then stop.
- **Validate at boundaries, trust inside.** Business logic lives in plain functions that take typed data. The event handler around it is thin: parse, call, reply.

## Rules

| Rule | Summary |
|------|---------|
| Discriminated unions | Model variants with a `kind` literal discriminant so impossible states can't be represented. No optional-field bags. |
| Branded types | Brand primitives with `& { readonly __brand: "X" }` so a server id, a character id and an item name can't be mixed up. Validate once at the boundary. |
| Constructive modeling | Build the shape so the illegal value can't be constructed. `[T, ...T[]]` for non-empty, `[T, T][]` for even length, `start` plus `duration` for a range. |
| Simplest total type | Keep `T[]` while every operation on it stays total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | Data from outside the resource is `unknown`, including the arguments of net event handlers. |
| Parse functions | Turn client data into a typed value with a function that takes `unknown` and returns the value or `null` (`toCoords(value: unknown): Vec3 \| null`). Reuse the resource's existing parsers and guards before writing a new one. Don't add a schema library: FiveM resources don't use one. |
| `null` means omitted | FiveM serializes event arguments with MessagePack, which can turn an omitted or `undefined` value into `null`. Check optional values with `!= null`, never `!== undefined` alone, and require values by type and range, not truthiness: `0` and `false` are valid. |
| No `as` casts | Every `as` is a runtime crash waiting. Cast only after validation. A type argument such as `triggerServerCallback<T>` is a cast too. |
| Narrowing hierarchy | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > `as`. |
| Type guards | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`. |
| Exhaustiveness | Inline `const _exhaustive: never = x;` in default arms so the compiler errors when a new variant is added. |
| `satisfies` over `as` | Validates the value without widening literal types. |
| Boundary validation | Parse where data crosses in, into a named domain type. Trust types inside. See FiveM boundaries below. |
| Derived types | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface. Share one type between the client script and the NUI instead of declaring it twice. |
| Object args | Pass objects, not positional, so argument order is self-documenting. Skip on hot paths (`setTick` callbacks, anything running every frame) and don't wrap natives just to get object args. |
| Real tests | Don't mock what you can run. Plain logic gets real unit tests when the resource has a runner; natives, events and NUI are verified on a running server. |
| Useful logs | Log with enough context to debug from an id: player id, event name, resource. No debug `console.log` left in shipped code. |

## FiveM boundaries

Every one of these is data the compiler knows nothing about. Parse it where it arrives:

| Boundary | Why it's untyped |
|----------|------------------|
| `onNet` handler arguments on the server | Any client can trigger the event with any arguments. `onNet` takes a `Function`, so parameter annotations go unchecked. |
| `onClientCallback` arguments (`@overextended/ox_lib/server`) | Typed `...args: any[]`, and they come from a client. |
| `RegisterNuiCallback` data | Comes from the browser, which the player can drive with devtools. The server re-checks anything the client forwards to it. |
| `exports.<resource>.<name>()` results | Every export is typed `Function`, so its result is `any`. Wrap it once in a typed function. |
| State bags (`GlobalState`, `Player(id).state`, `Entity(id).state`) | Indexed as `any`. Treat a key a client can write as client data. |
| `triggerServerCallback<T>` replies (`@overextended/ox_lib/client`) | `T` is not checked, and the return type is `Promise<T> \| void`: it resolves to nothing when its `delay` rate limit drops the call. |
| `JSON.parse`, KVP strings, convars, database rows, item metadata | Strings or untyped rows. Persisted JSON gets a version field and a `try` / `catch` around the parse. |

On the server, copy `source` into a local at the top of every handler, before any `await`: it is a global that the next event overwrites.

When the resource uses ox_lib from TypeScript, import `@overextended/ox_lib` instead of calling `exports.ox_lib` directly: the package wraps the exports with types.

## Examples

Read [PATTERNS.md](./PATTERNS.md) for a code example of each rule.
