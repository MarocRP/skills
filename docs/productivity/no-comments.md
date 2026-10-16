## What it does

`no-comments` deletes the comments in a diff that the code should make unnecessary, then fixes the code they were covering for. A fresh reviewer, Comment Sicko, reads the diff with one short list of comments that may stay, deletes the rest, and flags each piece of our own code whose surprise needed a comment as `MUST KILL`. The agent then checks that report and fixes what it flagged.

A comment that explains a workaround is treated as a confession: the fix is the code, not a shorter comment. Only comments about things the resource can't change survive, such as a native's quirk or another resource's behaviour.

## When to reach for it

Type `/no-comments`, or the agent reaches for it automatically before a change goes to review. It works on the current branch's diff unless you give it files. For broader cleanup of AI-written code, use [deslop](../fivem/deslop.md) instead.

## What stays

| Kept | Why |
| --- | --- |
| License headers | Legal |
| Comments about natives, the FiveM runtime, or resources you don't own | You can't reshape them |
| LuaLS annotations and `--[[@as T]]` casts | They're types, not prose |
| Doc comments on a public API, such as an export | They're the contract |
| `// prettier-ignore`, and lint suppressions for style-only rules | The rule is wrong there |
| Issue links for a constraint code can't express | The code can't say it |

Everything else goes, including `---@diagnostic disable`, `@ts-ignore` and `eslint-disable` when the rule protects correctness.

## Common questions

**What happens to a "do not remove" comment?**
If it guards something the resource owns, the agent turns it into a check (a type, a runtime check, a test or a lint) and deletes the comment. If no check fits in the diff's scope, it deletes the comment and reports the constraint as open.

## It's working if

- The diff has fewer comments, and none restate the code.
- Each `MUST KILL` flag leads to a rename, extraction or fix rather than a rewritten comment.
- LuaLS annotations are untouched.

## Where it fits

The **before review** step. Run [deslop](../fivem/deslop.md) first to clean up the change, then `no-comments`, then open the PR with [pr](./pr.md). Comment Sicko runs on the `review` model from [setup-ox](../ox/setup-ox.md).
