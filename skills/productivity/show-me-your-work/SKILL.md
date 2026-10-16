---
name: show-me-your-work
description: Keep a reviewable decision trail, a TSV log with one row per decision (what, why, evidence, result), for long-running, unattended or multi-phase work. Use when the user asks for a decision trail or will review the work after stepping away, or when a skill such as figure-it-out calls for it.
---

# Show me your work

Keep one canonical log.

## The format

A single TSV file, one row per decision. Cells stay single-line. Evidence is a pointer, not prose. The header row is:

```
ts	phase	decision	why	evidence	result
```

- **ts.** ISO8601 timestamp.
- **phase.** The phase or workstream.
- **decision.** What was chosen or done, one line.
- **why.** The reason in plain words. If a principle drove it, say it plainly, not as a jargon tag.
- **evidence.** A link or path that proves it: commit SHA, PR number, `file:line`, or an artifact or screenshot path. Never a paragraph.
- **result.** The outcome or predicate state: `tests green`, `reverted`, `INCONCLUSIVE`, `open`.

An example, plain-spoken so a reviewer reads it at a glance.

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, 40 resources still on the old inventory exports	wanted to know the size before starting a long run	commit 3a9f1c2	found 3 resources that wrap the exports in their own bridge
2026-05-24T09:40:00Z	harness	wrote a script listing every call to the old exports before changing anything	so we can compare old against new and catch a missed call	scripts/find-old-exports.sh	baseline of 212 calls saved
2026-05-24T11:15:00Z	shops	moved the shop resource to the new exports	keep each resource's change small and checkable on its own	commit 7c21e0a	0 old calls left in shops, lua-language-server --check clean
2026-05-24T12:30:00Z	garages	threw out a helper's work because it skipped two files	checked the real diff instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## Logging a row

Write each entry the way you'd tell a teammate what you did: plain words, concrete actions, no jargon.

Use the helper `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>` from this skill's directory. It stamps `ts`, writes the header on first use, strips stray tabs and newlines, and prefixes any cell starting with `=`, `+`, `-`, or `@` with a single quote so a spreadsheet doesn't run it as a formula. A bare `printf` appending a row works too, but mind those same bytes if cells come from generated or user-supplied text.

Log decision points and checkpoints, not every action: a fork chosen, a unit completed with its verification result, a pivot or revert with its trigger, a blocker surfaced, a gate fixed. For loop runs, one row per iteration. Skip the trivial and self-evident.

A run is one agent conversation, including its later turns and any summary of it. A pickup, a replacement agent, or a new chat starts a new run. When a run adds to a log that already has rows, its first row has phase `start`, and so does its first row after another run's `start` row. So a run that comes back to a log in a later turn first reads the log's last rows to see whether another run wrote since. A `start` row names the `ts` range of the rows before it that this run did not write, and its evidence names this run, such as its session id. Use phase `start` for nothing else.

## Where it lives

By default the log is a working artifact, not committed. Keep it at `decisions.tsv` in the work dir, or `.audit/<task-slug>.tsv` when several efforts run at once, and leave it out of git.

Commit it only when the work is ambitious enough that a reviewer needs the trail to trust the result.

## Rules

- Append-only. A wrong call gets a new row that supersedes it. Never edit or delete history.
- Prefer evidence produced by committed scripts over hand-made one-offs, per Encode Lessons in Structure (in the `principles` skill).

## Audit the log against the transcript

At the end of the run, before handing back, check the log told the truth. Read this run's transcript: in Claude Code, the session's `.jsonl` file under `~/.claude/projects/`; in Codex, its file under `~/.codex/sessions/`; in T3 Code, `t3_thread_read` with `view: "activity"`, following `nextPosition` until `hasMore` is false. Find the session by searching for this run's opening prompt. Read only this run's session: other sessions hold unrelated private chats. Walk this run's rows against what actually happened. Each stretch of them begins at one of this run's `start` rows, or at the first row if this run created the log, and ends at the next `start` row of another run:

- Check that every row maps to a real decision or action.
- Check that each row's evidence resolves and shows what the row claims.
- A fork, pivot, or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records neither a real decision nor a real action, or its claim or evidence is wrong, add a row that supersedes it with what actually happened and a pointer that resolves. This audit does not check rows outside this run's stretches. If this run's own work shows one of them is wrong, supersede it like any wrong call.

## Cross-model review of the trail

Before handing back, start one subagent named Trail reviewer on the `review` line of `~/.config/ox/models.md`. If that line names the model that did the work, use a `panel` entry from a different model family instead: self-review is not a substitute. If neither gives a different model, run it on your own model and say so in the Attention section. Its brief gives the log's absolute path and the transcript's location, and says "read-only: inspect only, no writes, no git commands" and "Do not delegate". It reads the trail and the transcript, then flags what the user should pay attention to. Not a redo of the work, a scan for what's suboptimal or risky:

- Decisions logged with weak or absent evidence.
- Verification steps skipped or claimed without proof in the transcript.
- Choices that look risky in hindsight (premature, scope-creeping, papering over a symptom).
- Gaps the user would otherwise miss on a casual skim.

Every reply for a run that produced a trail ends with an "Attention" section. Lead with the reviewer's model on its own line (`reviewed by <model>`), then list each flag pointing to specific rows or moments. "No flags" is a valid value. The model name is not.

## Reviewing the trail

Read top to bottom, follow the evidence pointers, spot-check. GitHub renders a committed TSV as a table. `column -s$'\t' -t decisions.tsv` renders it in a terminal.

## Composing this skill

Other skills route their audit trail here instead of inventing one. Reference it by name and let it own the format. Don't restate the columns.
