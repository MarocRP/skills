# Productivity

General workflow tools, not specific to FiveM or the ox stack.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[ox-mode](./ox-mode/SKILL.md)**: Work in the Overextended style for the session: one playbook per task, delegated and verified work, short replies that cite their principles.
- **[retro](./retro/SKILL.md)**: Look back at a coding session and suggest changes to the agent's environment: pointers, checks, review rules and instructions to cut.
- **[unslop](./unslop/SKILL.md)**: Cut AI tells from any writing: filler, AI vocabulary, mannered prose, em dashes, over-compression.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[architect](./architect/SKILL.md)**: Design before coding: several candidate sketches from different models, screened for red flags, then implemented against the chosen one.
- **[arena](./arena/SKILL.md)**: Run one task as several candidates on different models, pick the strongest and graft in the best of the rest.
- **[figure-it-out](./figure-it-out/SKILL.md)**: Design and run a checkable, logged workflow for a large task no other skill covers.
- **[how](./how/SKILL.md)**: Explain how a resource or subsystem works: architecture, the flow across client, server and NUI, and where things live.
- **[interrogate](./interrogate/SKILL.md)**: Adversarial review of a change by reviewers on different models, sorted into what to act on and what to dismiss.
- **[no-comments](./no-comments/SKILL.md)**: Delete the comments in a diff that the code should make unnecessary, then fix the code they were covering for.
- **[pr](./pr/SKILL.md)**: Write a PR body that's fast to review: the change as a diagram or small diff, before-and-after evidence, and whether the merge can be rolled back.
- **[principles](./principles/SKILL.md)**: 23 engineering principles for building, verifying and delegating work, each read only when the task calls for it.
- **[show-me-your-work](./show-me-your-work/SKILL.md)**: Keep a decision log for long or unattended work, audited against the transcript and reviewed by another model.
- **[swarm](./swarm/SKILL.md)**: Fan a task out to parallel subagents as slices or a race, and return one evidenced report.
- **[why](./why/SKILL.md)**: Find why code is the way it is, from git history, PRs, issues and docs, with every claim cited and labelled by confidence.
- **[writing-for-agents](./writing-for-agents/SKILL.md)**: Write skills, `AGENTS.md` and `CLAUDE.md` so the agent takes the same path every run: sharp pointers, the right things inline, checkable steps, no lines that change nothing.
