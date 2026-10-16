### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. Run `playbooks/prototype.md` for each. Keep the branch, the SHA, and the screenshots or output for Appendix A. A product or preference call no run can settle gets a default: apply it, record it in Appendix B with the alternative the operator could choose instead, per **Never Block on the Human**.
3. Explore in subagents on the `explore` role whose briefs open with the text of `SUBAGENT-PREAMBLE.md`, per **Guard the Context Window**. Each returns file pointers, conventions, check commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file under `~/.local/state/ox/<project-slug>/docs/`. Keep every heading and every sub-block in the order shown. One section per PR. One PR is one change with its own evidence, per **Sequence Work into Verifiable Units**. Name the execution playbook in **How to read this**: Autopilot-full when the PRs are independent and landing authority is granted, Autopilot-stack when the work is sequenced or the operator lands it, Orchestrate for a standing program. Outside T3 Code, the owner runs the PRs one at a time under Feature.
5. Write it per `writing-for-agents`, and the reply rules in `SKILL.md`. The body is a how-to. Appendices hold explanation and reference. Each heading states the task or the finding. No long dashes. No mid-sentence colons.
6. Check the plan before handing it back. Fix every failure:
   - Every placeholder is filled. No `<...>` remains outside code blocks.
   - Every PR section has **Depends on**, **Files**, **Build**, **You see**, **Verify**, and **Merge**, in that order, and each holds at least one box.
   - Every box names the evidence that checks it: a file, a log line, a command's output, a test run, or a SHA.
   - Every **Depends on** names a PR id that exists in the plan, and the dependencies form no cycle.
   - Two PRs that can run in parallel touch no file in common.
   - Every **Verify** block opens with the verification rule below.
7. Hand back. Post the plan path and the result of the step 6 check. Executing the plan is a separate request.

**Verification.** Tests and type checks alone are not sufficient verification. A PR is verified only when every box of its Verify block is checked with evidence the agent produced, per **Prove It Works**. That sentence is the verification rule. Every Verify block opens with it. Each box is one scenario the agent can run itself: a test, a script that drives the changed path, `lua-language-server --check` or `tsc --noEmit`, the NUI's dev server through a browser tool, or a server log line. One box is the **regression check against the default branch**: it runs the same load-bearing scenario on the default branch and on the PR head. If the default branch does not have the feature, the box records that and checks the behavior the diff adds instead. A behavior only the game client can show is a risk in Appendix C, not a box.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists: a file, a log line, a command's output, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs the ox-mode `<execution playbook>` playbook. <Who merges, and which PR ids stop at merge-ready for the operator.>

Tests and type checks alone are not sufficient verification. A PR is verified only when every box of its Verify block is checked with evidence the agent produced.

## Program checklist

### Start the program

- [ ] Read the ox-mode `SKILL.md`, the `<execution playbook>` playbook, and each skill the program uses, at program start and again at each phase boundary.
- [ ] Open the decision trail per `show-me-your-work`.

### Owners

- [ ] Start one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from the default branch.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.

### PR mechanics, for every PR

- [ ] `gh` is the forge.
- [ ] Open the PR ready, never draft, per Opening a PR.
- [ ] Run the repo's checks (`lua-language-server --check`, `tsc --noEmit`, tests, lint) once before the PR-facing push.
- [ ] Run `deslop` before each commit and `no-comments` before review.
- [ ] Triage every review-bot comment per the ox-mode `REVIEW-BOT-TRIAGE.md`.

### Verdict and merge, for every PR

- [ ] A verifier that did not write the code runs every Verify box at the code-ready head, per `swarm`. Another full run happens only for new behavior, a redesign, or a large new diff. A rebase or a minor fix gets a single verifier at the new head.
- [ ] Clean only when every box passes. Findings go back to the owner.
- [ ] <The merge or stack rule from the execution playbook.>

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact output, log line, or NUI state.>

**Verify.** Tests and type checks alone are not sufficient verification. A PR is verified only when every box of its Verify block is checked with evidence the agent produced.

- [ ] Regression check against the default branch. Run <the same load-bearing scenario> on the default branch and the head. If the default branch lacks the feature, record that and check <the behavior the diff adds>. Pass when <predicate>.
- [ ] <Scenario.> Run `<command>`. Pass when <predicate>.
- [ ] <Scenario.> Run `<command>`. Pass when <predicate>.

**Merge.**

- [ ] A clean verdict at the exact head SHA.
- [ ] Review-bot triage done.
- [ ] Rebased onto the current default branch after the verdict, patch-id unchanged.
- [ ] <The owner squash-merges its own PR, or the PR joins the stack the operator lands bottom-up.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Decisions and alternatives rejected

<Each default applied for a product or preference call, with what the operator could choose instead. Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches, including behavior only the game client can show.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `how` and `interrogate`. The trail per `show-me-your-work`.>
````

**Reply:** the plan path, the PR ids with their dependencies, what the prototypes proved and what stays unproven, the defaults applied for the operator to override, and the step 6 check result.
