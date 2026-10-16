## What it does

`interrogate` has several reviewers on different models tear into a change independently, then acts as the lead reviewer: it merges their findings, weighs which ones more than one model raised, and sorts every finding into **Act on**, **Consider**, **Noted** or **Dismissed**, each with a reason. It never applies changes itself.

Model diversity is the point. Findings two models raise independently are the strongest signal, and the Dismissed list shows you what was rejected so you can overrule it.

## When to reach for it

Type `/interrogate`, or the agent reaches for it when you ask for an adversarial review or stress test, or when [architect](./architect.md) wants pressure on a design. It reviews the branch's diff unless you point it at files.

## What the reviewers check

| Lens | Includes |
| --- | --- |
| Correctness | Edge cases, players disconnecting mid-operation, operations that run twice or across a resource restart |
| Root causes | Guards and casts that hide a deeper problem |
| Structure | Validation at boundaries, bolted-on changes, old and new APIs both kept alive |
| Verification | Whether anything proves the change works |
| Complexity | Abstractions with one caller, code for cases that don't exist |
| Security | Server code trusting net event, callback or NUI data, rewards a client can trigger, SQL built outside oxmysql parameters |

## Common questions

**Which models review?**
The `panel` line from [setup-ox](../ox/setup-ox.md), one reviewer per entry. Without it, three reviewers run on your session's model, and the review says it lost its model diversity.

## It's working if

- The Act on list is short enough to fix before shipping, usually five items or fewer.
- Each finding names the models that raised it.
- Findings that amount to "I'd have done it differently" end up dismissed, with a reason.

## Where it fits

The **adversarial review** step before shipping. It pairs with [no-comments](./no-comments.md) and [deslop](../fivem/deslop.md), which clean the diff, and [pr](./pr.md), which describes it.
