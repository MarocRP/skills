## What it does

`principles` is a set of 23 engineering principles the agent applies while it works: delete before adding, make the smallest change, model the domain in a data structure, guard at boundaries and trust internal types, fix root causes, verify against the real thing, and sequence work into units that each end in a check. Each principle names when it applies and what it changes.

The skill's index is short and every principle lives in its own file, so the agent reads only the ones the task calls for.

## When to reach for it

Type `/principles`, or the agent reaches for it automatically when it sizes or sequences a change, designs data or types, debugs, decides whether work is verified, or splits work across subagents. Other skills, such as [no-comments](./no-comments.md), load it to apply one principle by name.

## The groups

| Group | Principles |
| --- | --- |
| Core | Laziness Protocol, Foundational Thinking, Redesign from First Principles, Attack the Premise, Subtract Before You Add, Minimize Reader Load, Outcome-Oriented Execution, Experience First, Exhaust the Design Space, Build the Lever |
| Architecture | Model the Domain, Boundary Discipline, Type System Discipline, Make Operations Idempotent, Migrate Callers Then Delete Legacy APIs, Separate Before Serializing Shared State |
| Verification | Prove It Works, Fix Root Causes, Sequence Work into Verifiable Units, Test Behavior, Not Implementation |
| Delegation | Guard the Context Window, Never Block on the Human |
| Meta | Encode Lessons in Structure |

The FiveM-specific parts: net events, NUI callbacks, exports, state bags, KVP and convars count as boundaries, LuaLS annotations are Lua's type system, and a resource restart while the server keeps running is one of the crashes an operation has to survive.

## It's working if

- Diffs get smaller, and dead code goes before new code lands.
- Validation sits where data enters the resource, not scattered through it.
- "Done" comes with a check the agent ran, not "it compiles".

## Where it fits

The **reach-for-it-anytime** reference under everything else. It pairs with [lua-best-practices](../fivem/lua-best-practices.md) and [typescript-best-practices](../fivem/typescript-best-practices.md), which apply the same ideas to a language's syntax.
