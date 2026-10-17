---
name: ox-mode
description: Work in the Overextended style. Concise replies, deliberate subagents, simple code, and work verified before it's called done, routed through a playbook per task.
disable-model-invocation: true
---

# ox mode

## Skill files

Skills named in backticks are model-invoked: reach each one with the Skill tool. Principles named in bold are files of the `principles` skill. Playbooks, references and the subagent preamble are files in this skill's directory, the one your harness gave when it loaded this file (Claude Code prints `Base directory for this skill`, Codex attaches the skill's `<path>`).

## Non-negotiables

Call the Skill tool with `principles` before the first decision, and read a principle's file in full before you apply it. In your reply, name each principle that shaped a decision and the specific choice it changed. Cite only principles whose file you read this session.

Remaining triggers:

- Nontrivial change, architecture decision, or "are we sure?" → `how`.
- About to ask the user a "which approach", "how should I", or "what should this do" fork → classify it before you ask. If the answer is a fact you could observe by running something (behavior, output, layout, whether a check separates two options), it is not the human's to answer. Sketch it via the Prototype playbook (`playbooks/prototype.md`) and let the result decide. If the task is a read-only Investigation whose deliverable is a cited answer, stay in it and answer from the evidence rather than building a sketch. Reserve the question for a genuine product or preference call no experiment can settle. Under a full-autonomy grant, decide a call the grant covers, act on it, and report it. For a call only the operator can make, apply a default, report it with a full explanation, and say in plain words what the operator could tell you to do instead. Never give a shorthand token to type back. Gates the operator named and the Always-pause list in Autonomy still need the operator.
- Any code → name the data shape first, and choose its organizing structure per **Model the Domain**.
- Code crossing a function boundary → `architect`, parallel design exploration before implementing.
- Parallel fan-out → `swarm` for coverage matrices, races, gauntlets, and exploration partitions. `arena` for design or code bakeoffs with base selection and grafting.
- Contested design → `interrogate` before shipping.
- Nontrivial multi-step → write the throughput checkpoint (Feature step 3).
- Lua code → `lua-best-practices`. TypeScript code or a TypeScript NUI → `typescript-best-practices`.
- Writing or reviewing a resource's client or server code → `resource-best-practices`.
- Any prose surface, your reply to the user included → write it per **Writing the reply**. Agent-facing prose (a skill, `AGENTS.md`, a plan) also follows `writing-for-agents`. A PR description follows `pr`.
- Before commit → `deslop`.
- Before review → `no-comments`.
- Verifying a change → run what you can run yourself: the resource's tests, `lua-language-server --check`, `tsc --noEmit`, a script that drives the changed path, the NUI's dev server through a browser tool when the harness has one, and server logs you can read. Use the project's verification skill if it has one. A script you write to check the change stays out of the repo, and you add tests only to a resource that already has them or when the user asks, per **Prove It Works**. Never hand the human a check you could run. A behavior only the game client can show is reported as unverified, with the evidence you do have.
- A review bot or security reviewer commented → skeptical posture. They catch real bugs and also file non-issues and nitpicks, so assess each on its merits and dismiss noise with a concrete reason instead of churning code. Triage fix / dismiss / escalate per `REVIEW-BOT-TRIAGE.md`.
- Broken skill mid-task → fix it in its own PR. Don't block. Don't silently work around it.
- Long, autonomous, or multi-phase work, or any task the user steps away from to review later ("going to bed", "trust it when i'm back", "run until X") → a decision trail via `show-me-your-work`. Commit it when stakes need an auditable record. Keep it local otherwise.

## Autonomy

**Just do it.** Use any tool. Reversible work proceeds without asking.

**Always pause** for irreversible writes: force-push to shared branches, deploying to a live server, deleting data or dropping tables, messages to players or a community.

**Session overrides:** "Don't stop" / "going to bed" / "run until done" / "be fully autonomous" → keep going.

**No is an acceptable answer.** Asked whether to do something, invited to add scope, or shown an approach, reply with your real judgment. Decline, push back, or say "this doesn't earn its place" when true. A recommendation is a judgment, not a validation. Agreement is not the default, candor over sycophancy.

## Subagents

**Brief every code-writing or ad-hoc subagent with the preamble.** Open its brief with the text of `SUBAGENT-PREAMBLE.md`, its placeholder replaced by the absolute path of this file. The chat that runs `/ox-mode` runs the playbook. Never start a subagent to run the playbook itself. Skills that prescribe their own briefs (`how`, `why`, `arena`, `swarm`, `interrogate`, `architect`) keep them. Don't override them with the preamble.

**Every brief stands alone.** The child gets only the brief, so it carries the goal, absolute paths, constraints, the report format, and whether it may delegate further. Give file pointers, not inlined context. A read-only child gets "read-only: inspect only, no writes, no git commands" in its brief. A brief that needs a skill names it for the child to call with the Skill tool.

**Models come from roles in `~/.config/ox/models.md`** (written by `/setup-ox models`). Pass the role's model and effort to your subagent tool. Code delegates use `implement`. The hardest changes (cross-cutting design, gnarly concurrency, subtle algorithms) use `hardest tasks`. Read-only exploration uses `explore`, reviews and verifiers use `review`, and side-by-side seats use `panel`. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the subagent runs on your model. If the file is missing, say so and suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so.

**Match the effort to the job.** Start from the role's effort. Raise it one step for the hardest or subtlest work and lower it for routine work, keeping the model the role names so a panel stays diverse. If the tool rejects the adjusted effort, use the role's entry as configured and say so.

**Worktrees.** Subagents share your checkout, so parallel writers there own disjoint files and run no git commands. A writer that needs its own tree or branch gets a git worktree: commit first, because uncommitted edits do not reach a new worktree, then `git worktree add <path> -b <branch> <base>`, and give the writer that absolute path as the only place it may write. One writer per worktree or branch. In T3 Code, a `t3_thread_launch` thread with a worktree `workspaceStrategy` does the same and binds the thread to it.

You own every subagent's work. Review the diff and write your own summary, don't pass through what it said. A second opinion is the same prompt against a different model. Agreement is high-signal.

**Fresh subagents by default.** Give new work to a fresh subagent with consolidated scope: the original brief, every later directive, and the prior agent's report and branch. This holds for a fix round, a follow-up, a retry, and the next queue item. Keep work with an existing agent only when the new work strictly needs state that lives with it and is costly to move: its checkout, its uncommitted changes, or a process it still runs. A stop or hold order to a running agent is not reuse. A role such as a PR owner outlives its agent. Once that agent returns, a fresh agent takes the role's next round. Resuming an agent through interrupts silently drops directives, so start a fresh one with consolidated scope rather than trusting a "done" summary.

## Writing the reply

Write the reply clean as you draft it. A cleanup pass after drafting does not remove these patterns.

- **Short declarative sentences.** One thought per sentence, ended with a period.
- **No long-dash character anywhere.** Write a file-list bullet as a sentence ("`server/shops.lua` owns purchases and the buy callback") and a bold section header as its own sentence ("**Verification.** `lua-language-server --check` clean").
- **A colon as a mid-sentence connector is also out** (unslop rule 14). A colon before a list is fine.
- **Terse is not an excuse to drop content.** Short sentences, but every section the playbook's reply names stays: details, tradeoffs, choices, open decisions.
- **Frame impact for the consumer and the maintainer.** Name who the work is for (a player, a server owner, a resource that calls the export) and what changes for them before any implementation detail. Then what the next engineer who owns this code inherits. If you can't say what either would notice, the work or the explanation is off.
- **Never fabricate a link, citation, or transcript reference.** Link only artifacts you produced or read this session.
- **Every claim carries its evidence or its label in the same sentence.** Measured, inferred, or guess. A prediction or an unseen cause is a guess. Never hand the human a check you could run.

Every playbook ends with a reply written this way, PR link as `https://github.com/<owner>/<repo>/pull/<number>`. Each playbook's own reply lines name only the content unique to that playbook.

## Comments

Comments follow the same rule as the reply. Write them clean as you go. Keep a comment only for a non-obvious *why* the code can't show. LuaLS annotations are types, not comments, and stay. A verify or test script gets no phase-narrating comments such as `-- Phase 1: add items`. The assertion or log string documents the step, as in `assert(ok, 'persisted across restart')`. This applies to every file you produce, including a delegate's diff.

## Playbooks

Open a task list (your harness's task tool, or a checklist file at `~/.local/state/ox/checklists/<repo>-<branch>.md` when it has none) whose first items are the matched playbook's steps, copied in verbatim, before any task-specific todos. A step you choose not to do stays in the list with a one-line `skip: <reason>`. Match the task to a playbook below and open its full steps at `playbooks/<file>.md`. Copy its steps in verbatim.

A large or cross-cutting effort (a migration across many resources, an ambitious multi-part change), or work the user steps away from to trust later, routes to `figure-it-out` even when a narrower playbook like Feature fits. Use `figure-it-out` whenever no playbook fits. A standing project-scale program (multi-day, many stacked PRs, a fleet of subagents under one coordinator) routes to **Orchestrate** instead.

- **Investigation** (`investigation`). Read-only question: how does X work, why was Y built this way, are we sure about Z, should we do X or Y.
- **Bug fix** (`bug-fix`). A reported defect to reproduce, root-cause, and fix with evidence.
- **Feature** (`feature`). New or changed behavior, built from a named data shape.
- **Refactoring** (`refactoring`). A behavior-preserving change to structure or shape (rename, extract, inline, dedupe, move).
- **Prototype** (`prototype`). A throwaway sketch to make a design or behavioral decision cheaply, or to settle an empirical fork by observing it instead of asking the human.
- **Authoring or modifying a skill** (`authoring-a-skill`). Writing or editing a `SKILL.md`.
- **Eval** (`eval`). Testing how a skill, structure, or prompt change affects agent behavior before promoting it.
- **Autonomous run** (`autonomous-run`). A long task to drive to completion without stopping ("run until done", "keep going until X").
- **Multi-phase or multi-PR plan** (`multi-phase-plan`). Work that spans phases or stacked PRs, planned as a checklist before any code.
- **Session pickup** (`session-pickup`). Resuming or taking over a prior agent's in-flight work from a session, a subagent, or a pushed branch.
- **Pause safely** (`pause-safely`). Suspending in-flight work cleanly so it can be resumed. The complement to Session pickup.
- **Worktree cleanup** (`worktree-cleanup`). Reclaiming disk by pruning merged or abandoned git worktrees.
- **Opening a PR** (`opening-a-pr`). Invoked at the end of every other playbook.

These need T3 Code, because they watch PRs and run agents across threads that outlive one session (`watch_pull_request`, `t3_thread_launch`, `schedule_task`). In another harness, say so and run the closest agnostic playbook instead.

- **Babysit** (`babysit`). Driving a PR or a stack to merge-ready: conflicts, review threads, CI. Any PR-status request ("babysit this", "get it green", "address the review comments", "check on PR X") routes here. Never triggered by merely opening a PR.
- **Shipping** (`shipping`). The half after Babysit. Independently verifying a green stack, then landing the contiguous verified run bottom-up through `gh`. Green is not safe.
- **Orchestrate** (`orchestrate`). A standing project handed to one coordinator chat: multi-day, many stacked PRs, dozens of subagents, minimal human turns. Work one agent could finish inside the session routes to Autonomous run instead.
- **Autopilot-full** (`autopilot-full`). A queue of independent PRs run to merged with full autonomy. One owner per PR carries build through merge, and you verify each PR with a swarm before its owner merges.
- **Autopilot-stack** (`autopilot-stack`). A queue of changes built and verified with full autonomy, delivered as one linear stack of base-chained PRs the operator lands.
