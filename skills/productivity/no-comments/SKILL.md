---
name: no-comments
description: Delete the comments in a diff that the code should make unnecessary, through a fresh read-only reviewer, then fix the code each deleted workaround comment was excusing. Use before a change goes to review, or when the user asks to strip comments from a diff.
---

# No comments

Spawn Comment Sicko. Act on accepted findings.

Defer to Comment Sicko's fresh perspective.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the merge base with the default branch (`git merge-base HEAD origin/HEAD`, else `main` or `master`), including the working tree. With no git, use the files changed in this session.

## Steps

1. Start one `review` subagent named Comment Sicko. Use the `review` line of `~/.config/ox/models.md`: pass its model and effort to your subagent tool. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the subagent runs on your model; if the file is missing, also suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so. Its brief is [COMMENT-SICKO.md](./COMMENT-SICKO.md) pasted verbatim, then the scope. Do not restate its rules. If the harness has no subagent tool, say so and make the pass yourself with that file as your brief.
2. Inspect its report and diff. Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable. Do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped suppressions (`---@diagnostic disable`, `eslint-disable`, `@ts-ignore`, `@ts-expect-error`). Correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, trace their symbol yourself: its callers, and `git log -L` or `git blame` for when and why the comment appeared. If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it. Revert and rerun one rejected report in a fresh subagent with the failure named. Reject a second, report it open, and fail `no-comments`.
3. Fix trivial accepted flags directly by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, sketch it once for the accepted set and surrounding code: the data shape and the functions that change. Stop at the sketch. Step 4 implements.
4. Implement the smallest root-cause fix in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. The Fix Root Causes and Redesign from First Principles principles (call the Skill tool with `principles`) guide intent only. Neither authorizes widening the fence nor fixing instances outside it. Never bolt on symptom guards.
5. Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Encode the rest with the cheapest in-scope type, runtime check, test, or CI lint, then delete the comment. If no in-scope encoding exists, delete the comment, report the constraint open, and sketch the out-of-scope work.
6. Report the deletion count, restored comments, reruns, the sketch, fixes, encodings, unenforced constraints, and other open work.
