# Writing docs pages

Every skill has a human-facing **docs page** at `docs/<bucket>/<skill-name>.md`. The docs tree mirrors the bucket folders under `skills/`. The page is not the skill and not a copy of `SKILL.md`: it orients one reader around one skill so they know what it covers, when it fires, and where it sits in the set.

Act whenever a skill is added, renamed, removed, or has its behaviour changed: create, move, re-sync or delete its docs page to match.

There is no H1: the filename is the title. A page carries no install commands: link to the install section of the top-level `README.md` instead, so the wording lives in one place ([install-block.md](./install-block.md)).

## Page template

Keep this order. `What it does`, `When to reach for it` and `Where it fits` appear on every page; the rest only where the skill has something to say.

<page-template>

## What it does

One or two plain paragraphs. Lead with the skill's one-sentence job, then state the single fact that makes it behave differently from the obvious default (for a resource skill, usually the thing an agent gets wrong without it). Write it as a plain sentence, not a labelled aside.

## When to reach for it

- **Invocation mode.** User-invoked: "You invoke this by typing `/<name>`; the agent won't reach for it on its own." Model-invoked: "Type `/<name>`, or the agent reaches for it automatically when a task fits."
- **Trigger boundary.** "Reach for this when ...". Where it's confusable with a sibling, add "for <X> instead, use [<sibling>](./<sibling>.md)."

## Prerequisites

Optional. Resources that must be running, minimum resource versions, convars, or prior setup. Omit the heading when there are none.

## <free-form middle>

One to three short sections, in the skill's own vocabulary, that make it click: the pattern it enforces, the mistake it prevents, the API shape it teaches.

## Common questions

Real questions from issues, Discord and support threads, each in bold with the answer beneath. Sized to the evidence: don't pad. Omit the heading when there's nothing worth answering.

## It's working if

A few bullets the reader can check in their own code or session without opening `SKILL.md`.

## Where it fits

A sentence or two: which resources or sibling skills it pairs with, and why.

</page-template>

## Conventions

- Explain the **why**, not the runbook.
- Branches go in a table or a list, never a paragraph.
- Links to other docs pages are relative (`./ox-lib.md`, `../fivem/<name>.md`); links into the skill itself point at its `SKILL.md`.
- Keep the page low-load: no spare headings, no restated links.
