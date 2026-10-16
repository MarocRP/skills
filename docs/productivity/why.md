## What it does

`why` finds out why code is the way it is. It anchors on the code's git history and PRs, then starts one read-only investigator per source it can reach (git and GitHub always, plus any issue tracker, docs, chat or monitoring MCP your agent has) and has a synthesizer write a cited answer.

Every claim is labelled by how well it's supported: **Direct** (someone wrote down the reason), **Supported** (several sources point the same way), **Inferred**, or **Speculative**. Gaps are listed as gaps, with what was searched. It's built to say "we don't know" rather than invent a tidy reason.

## When to reach for it

Type `/why`, or the agent reaches for it when you ask why something works a certain way, why a choice was made, or where a number came from, and when [architect](./architect.md) needs the reasons behind code it's about to reshape. For what code does rather than why, use [how](./how.md).

## Resources you don't own

When the code is in a resource your server runs but your repo doesn't own, such as ox_inventory or ox_lib, the history isn't in your server folder. `why` finds the resource's GitHub repository from the `repository` field in its `fxmanifest.lua`, and the version from the manifest or `.ox/config.md`. It then searches that repository's PRs, issues and releases. Overextended tags releases `v<version>`, so it can compare exactly what changed between the version you run and another.

## It's working if

- Every Direct or Supported claim has a citation you can open: a PR, an issue, a commit, a `file:line`.
- The answer has a What We Don't Know section naming what was searched.
- A guess you put in the question ("is this for performance?") is checked, not confirmed.
- When you're about to change the code, it ends with a Preserve, Change, Avoid and Risk list.

## Where it fits

The **history** half of understanding code, next to [how](./how.md). Investigators run on the `explore` model and the synthesizer on `hardest tasks`, from [setup-ox](../ox/setup-ox.md).
