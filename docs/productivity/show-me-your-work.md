## What it does

`show-me-your-work` keeps a decision log for long or unattended work: a TSV file with one row per decision, saying what was done, why, the evidence (a commit, a file, a script's output), and the result. Before handing back, the agent checks the log against its own session transcript and adds rows for anything it left out. A reviewer on a different model then reads both and flags what you should look at.

The log is append-only. A wrong call gets a new row that supersedes it, so the history stays honest.

## When to reach for it

Type `/show-me-your-work`, or the agent reaches for it when you'll review the work after stepping away, or when [figure-it-out](./figure-it-out.md) runs.

## The log

| Column | Holds |
| --- | --- |
| `ts` | When |
| `phase` | Which part of the work |
| `decision` | What was done, in one line |
| `why` | The reason, in plain words |
| `evidence` | A commit, `file:line`, or output path, never prose |
| `result` | `tests green`, `reverted`, `open`, ... |

`scripts/log.sh` appends a row safely. The log stays out of git unless the work is big enough that a reviewer needs it to trust the result.

## Common questions

**Where does it read the transcript from?**
The harness's own session log: `~/.claude/projects/` for Claude Code, `~/.codex/sessions/` for Codex, or the thread itself in T3 Code. It reads only the current session.

## It's working if

- Every row's evidence opens and shows what the row claims.
- The reply ends with an Attention section that names the reviewer's model.
- Pivots and reverts are in the log, not just the wins.

## Where it fits

The **audit trail** for every long-running skill. [figure-it-out](./figure-it-out.md) uses it, and the reviewer runs on the `review` model from [setup-ox](../ox/setup-ox.md).
