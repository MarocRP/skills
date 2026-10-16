### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** Work from a git worktree off the default branch. Subagents inherit it. Multiple writers on the same branch run one after another, with `git fetch && git reset --hard origin/<branch>` between them. Writers that must run in parallel each get their own branch and worktree (Worktrees in `SKILL.md`). Dirty branch with unrelated work: patch out, fresh worktree, apply. Snarled worktree: reset from the default branch, redo minimally.

**Commits.** Commit liberally. Rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit. New commit when separable. Commit bodies don't restate the subject. Stage only the files you changed (`git add <files>`, never `-A`).

**Before the PR.** Run `deslop` over the diff before commit and `no-comments` before review.

**Titles.** Follow the repo's convention, read from `git log --oneline -20`. With none, use Conventional Commits `type(scope): subject`, no trailing period: a type such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`, the scope as the area (`server`, `client`, `nui`, a module), and a short imperative subject that names a real symbol when one carries the change, for example `fix(server): check distance in my_shops:buy`.

**Descriptions.** Call the Skill tool with `pr` and write the body to its template. If the repo has a pull request template, `pr` fills that instead. The body is a one-minute briefing for a reviewer who has the diff, written per **Writing the reply** in `SKILL.md`. Full SHAs, swarm or arena lane recitals, and file-by-file checklists go in a linked artifact, not the body.

**Forge.** Use GitHub CLI (`gh`) for create, edit, view, and merge.

**Size and stacks.** Prefer five narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets the default branch. Each child branch rebases onto its parent's exact tip and its PR targets the parent branch. Create a child with `gh pr create --base <parent-branch>`, and retarget one with `gh pr edit <pr> --base <parent-branch>`. Branch from the default branch only for independent work. Rebase on it before substantial stack work.

**Readiness.** Open every PR ready, never as a draft. Omit `--draft` from `gh pr create`. If a PR still opens as a draft, run `gh pr ready <number>`. Run `gh pr view <number>` before you refer to PR status. In T3 Code, call `link_pull_request` with the PR URL at once, for every layer of a stack.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Babysit only when the user asks for it after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits later waves restart.

A subagent that opens a PR runs `interrogate`, `deslop`, and `no-comments`, and reports the URL. It returns to the parent without babysitting, unless it is an Autopilot-full or Autopilot-stack owner whose brief assigns the babysit loop. In T3 Code, the subagent links its PR with `link_pull_request`, and the parent links every returned PR URL to its own thread too.
