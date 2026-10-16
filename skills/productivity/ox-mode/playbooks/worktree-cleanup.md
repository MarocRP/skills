### Worktree cleanup

**You own the disk you reclaim and the work you keep.** This is the one playbook that deletes local state with no code review to catch a slip, so the gates below are the review.

1. Snapshot and audit. Record free space (`df -h .`). List worktrees with `git worktree list --porcelain`, never from hand-typed paths, since worktrees can live outside the repo's folder (T3 Code keeps them under `~/.t3/worktrees/`). For each one record:
   - size: `du -sh <path>`
   - last activity: `git -C <path> log -1 --format=%cr`
   - merged: `git merge-base --is-ancestor <branch> origin/HEAD` (or the base the PRs target)
   - uncommitted work: `git -C <path> status --porcelain`, split into tracked edits and untracked files
   - unpushed commits: `git -C <path> log @{upstream}..` (or every commit, when the branch has no upstream)
   - PR state: `gh pr list --head <branch> --state all --json number,state`

   Write the table to a file (per **Build the Lever**) so the decision is checkable.
2. Classify each worktree. **Safe**: clean, nothing unpushed, merged or its PR closed. **Hold**: tracked uncommitted edits, unpushed commits, an open PR, or activity in the last few days. A branch ref survives `git worktree remove`, so removing a clean worktree loses nothing. Uncommitted edits and unpushed commits are lost with it.
3. Check use before deleting. A worktree a running session or subagent is using is in use even when its branch looks finished. In T3 Code, read the threads that touch each candidate (`t3_thread_list` with `includeSubagents: true`, then `t3_thread_read`) in a subagent on the `explore` role, per **Guard the Context Window**, and hold any a live or pinned thread uses.
4. Prune only the safe set. Per path, `git worktree remove <path>` (add `--force` only when the leftover is untracked build output you have named), then `git worktree prune`. Confirm with free space and a fresh `git worktree list`.
5. Leave held worktrees alone. Removing uncommitted work is irreversible, so it waits for an explicit request naming that worktree.

**Reply:** free space before and after, the worktrees pruned, and a one-line reason for each held back (uncommitted edits, unpushed commits, open PR, or in use by which session).
