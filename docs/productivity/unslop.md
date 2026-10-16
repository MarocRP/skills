## What it does

`unslop` rewrites a piece of text to remove the patterns that mark it as AI-written: AI vocabulary ("delve", "pivotal", "showcase"), fancy ways to say "is", forced groups of three, em dashes, chatbot phrases, filler, hedging, abstract metaphor nouns, and over-compressed shorthand. It keeps the meaning and the intended tone.

Its sharpest rule is about what a sentence says, not its tone. A sentence that names a feeling ("SQL you can read") gets rewritten to name the mechanism or a number, and a sentence that could appear unchanged in another project's docs gets cut.

## When to reach for it

You invoke this by typing `/unslop`; the agent won't reach for it on its own. Point it at a README, a changeset, a PR description, release notes, or a reply you're about to send. For code rather than prose, use [deslop](../fivem/deslop.md).

## Stable rule numbers

Each pattern has a number that never changes, and a removed rule leaves a gap rather than renumbering the rest. Other skills and reviews can cite "rule 27" and mean the same thing a year from now.

## It's working if

- The text gets shorter, and every sentence that survives says something specific to its subject.
- No em dashes, curly quotes, or decorative emojis remain.
- Headings are in sentence case.

## Where it fits

A **reach-for-it-anytime** standalone for prose. It pairs with [deslop](../fivem/deslop.md), which does the same job for resource code.
