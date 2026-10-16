## What it does

`deslop` cleans up the code an agent just wrote: narrating comments, leftover `print`s, needless `pcall`s and nil checks, globals that should be `local`, `any` casts, deep nesting. It only touches lines your branch introduced, and it leaves behaviour unchanged.

It knows that server code receiving client data is not a trusted path. A generic cleanup strips "redundant" checks on net event arguments, `source` lookups and distance or permission checks. Those checks are what stop exploits, so `deslop` keeps every one, and flags a check that looks redundant instead of removing it.

## When to reach for it

Type `/deslop`, or the agent reaches for it automatically after finishing a change to a resource, or when you ask it to clean up or tidy code. It works from your git diff; on a server folder with no git, it cleans the files changed in the session or asks which resource to clean.

## What it looks for

| Where | Slop |
| --- | --- |
| Everywhere | Narrating comments, debug output, commented-out code, deep nesting, unused locals, names out of step with the file |
| Lua | `pcall` and nil checks on trusted values, `== true`, stray globals, mixed `Citizen.Wait` / `Wait`, hand-rolled helpers ox_lib already provides |
| TypeScript / JavaScript | `any` and `as unknown as` casts, `@ts-ignore`, `try` / `catch` that only logs |

Every candidate is judged against the file and resource it sits in: what's slop in one resource is house style in another.

## It's working if

- The diff gets shorter and reads like the code around it.
- Server-side handlers for client events keep every check they had.
- Its summary is one to three sentences, and names any bug it fixed.

## Where it fits

A **reach-for-it-anytime** cleanup, best run at the end of a change and before committing. It changes style only; a change that needs a different design is a refactor, not a deslop.
