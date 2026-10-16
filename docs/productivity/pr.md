## What it does

`pr` writes a pull request body in three sections: a **Summary** that shows the change as a diagram, call tree, file tree or small diff instead of prose, **Evidence** that it works (a before and after), and **Merge Danger**, which says whether the change can be rolled back and what it could break.

A reviewer reads a call tree across the client/server boundary faster than a paragraph describing it, so the Summary picks the smallest visual that makes the point and keeps prose to a line or two around it.

## When to reach for it

Type `/pr`, or the agent reaches for it automatically when it writes a PR body. If the repo has its own pull request template, the agent fills that in instead, using these sections wherever the template's headings fit.

## Merge Danger in a FiveM resource

| | Examples |
| --- | --- |
| One-way doors | Dropping or renaming a database column, renaming an item that saved inventories still hold, changing a KVP key or a saved JSON shape |
| Blast radius | Other resources calling a changed export or listening to a renamed event, every player's saved data, client frame time, the NUI at other resolutions, convars server owners already set |

## It's working if

- The Summary is mostly a visual, and every visual sits next to the sentence it supports.
- Evidence shows a before and an after: a screenshot of the NUI, test results or console output.
- Every PR states its door and its blast radius, even when both are small.

## Where it fits

The **last step before review**. Write the code with [lua-best-practices](../fivem/lua-best-practices.md) or [typescript-best-practices](../fivem/typescript-best-practices.md), tidy the diff with [deslop](../fivem/deslop.md), then open the PR with `pr`.
