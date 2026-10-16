# Overextended Skills

Agent skills for building FiveM resources with the [Overextended](https://github.com/overextended) stack: ox_lib, ox_core, ox_inventory, ox_target, oxmysql, and general FiveM resource development.

Coding agents know Lua. They don't know which ox_lib module replaces the boilerplate you were about to write, what `exports.ox_inventory` actually exposes, or which pattern a resource stopped supporting two versions ago. These skills give the agent that knowledge, checked against the resources' source, so it writes code the way the people who built the stack would.

They work with Claude Code, Codex, Copilot, Gemini CLI, Cursor and any other agent that reads the [Agent Skills](https://agentskills.io) format.

## Installation

Pick one route per agent. Installing both the plugin and skills.sh gives you every skill twice.

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add overextended/skills
claude plugin install overextended-skills@overextended
```

To update, run `claude plugin update overextended-skills@overextended`, or turn on auto-update for the `overextended` marketplace in `/plugin`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add overextended/skills
codex plugin add overextended-skills@overextended
```

</details>

<details>
<summary><strong>GitHub Copilot</strong> (CLI)</summary>

```bash
copilot plugin marketplace add overextended/skills
copilot plugin install overextended-skills@overextended
```

</details>

<details>
<summary><strong>Gemini CLI</strong> (manual updates)</summary>

```bash
gemini skills install https://github.com/overextended/skills.git --path skills/ox
gemini skills install https://github.com/overextended/skills.git --path skills/fivem
gemini skills install https://github.com/overextended/skills.git --path skills/productivity
```

Re-run all three commands to update.

</details>

<details>
<summary><strong>Any other agent, or editable files</strong> (manual updates)</summary>

```bash
npx skills@latest add overextended/skills -a <agent>  # cursor, opencode, windsurf, ...; omit -a to choose
```

To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</details>

## Getting started

Run `/setup-ox` once in your server (or resource) folder. It does two things:

1. **Models and budget.** You pick a budget (`unlimited`, `large`, `medium`, `small`), and it maps each subagent role (exploring, checking APIs, implementing, reviewing, hard problems, and a panel of models for side-by-side work) to a model and reasoning level your agent actually offers. Saved to `~/.config/ox/models.md`, for you only.
2. **Project.** It finds your server, reads which ox resources, versions and framework you run, and confirms them with you. Saved to `.ox/config.md` in the server, for everyone on the project.

Every other skill reads both files, so it spends what you chose and writes code for the versions you actually have. Re-run `/setup-ox models` or `/setup-ox project` to redo one half.

Then, for a session where you want the full process (a playbook per task, delegated implementation, design bakeoffs, verified work), start it with `/ox-mode`.

## Skills

Skills split on one axis: who can invoke them. **Model-invoked** skills can be typed by you _or_ reached for automatically by the agent when the task fits. **User-invoked** skills run only when you type them.

### ox

One skill per Overextended resource, plus project setup.

**User-invoked**

- **[setup-ox](./skills/ox/setup-ox/SKILL.md)**: Configure these skills: pick a model and reasoning level per subagent role within a budget, then detect your server's ox resources, versions and framework.

### FiveM

FiveM resource development in general, independent of the ox stack.

**Model-invoked**

- **[deslop](./skills/fivem/deslop/SKILL.md)**: Remove AI-generated slop from resource code without changing behaviour, keeping every server-side check on client data.
- **[lua-best-practices](./skills/fivem/lua-best-practices/SKILL.md)**: Structure resource Lua the way Overextended does: when to use `require`, `lib.load` or `lib.loadJson`, one entry script per side, convars for config, and ox_lib's `cache`, points and callbacks.
- **[tdd](./skills/fivem/tdd/SKILL.md)**: Fix bugs in TypeScript resources test-first, with natives and ox_lib mocked so no server is needed.
- **[typescript-best-practices](./skills/fivem/typescript-best-practices/SKILL.md)**: Type resources and their NUI so impossible states don't compile, and parse everything that arrives through net events, callbacks, exports and state bags.

### Productivity

General workflow tools, not specific to FiveM or the ox stack.

**User-invoked**

- **[ox-mode](./skills/productivity/ox-mode/SKILL.md)**: Work in the Overextended style for the session: one playbook per task, delegated and verified work, short replies that cite their principles.
- **[retro](./skills/productivity/retro/SKILL.md)**: Look back at a coding session and suggest changes to the agent's environment: pointers, checks, review rules and instructions to cut.
- **[unslop](./skills/productivity/unslop/SKILL.md)**: Cut AI tells from any writing: filler, AI vocabulary, mannered prose, em dashes, over-compression.

**Model-invoked**

- **[architect](./skills/productivity/architect/SKILL.md)**: Design before coding: several candidate sketches from different models, screened for red flags, then implemented against the chosen one.
- **[arena](./skills/productivity/arena/SKILL.md)**: Run one task as several candidates on different models, pick the strongest and graft in the best of the rest.
- **[figure-it-out](./skills/productivity/figure-it-out/SKILL.md)**: Design and run a checkable, logged workflow for a large task no other skill covers.
- **[how](./skills/productivity/how/SKILL.md)**: Explain how a resource or subsystem works: architecture, the flow across client, server and NUI, and where things live.
- **[interrogate](./skills/productivity/interrogate/SKILL.md)**: Adversarial review of a change by reviewers on different models, sorted into what to act on and what to dismiss.
- **[no-comments](./skills/productivity/no-comments/SKILL.md)**: Delete the comments in a diff that the code should make unnecessary, then fix the code they were covering for.
- **[pr](./skills/productivity/pr/SKILL.md)**: Write a PR body that's fast to review: the change as a diagram or small diff, before-and-after evidence, and whether the merge can be rolled back.
- **[principles](./skills/productivity/principles/SKILL.md)**: 23 engineering principles for building, verifying and delegating work, each read only when the task calls for it.
- **[show-me-your-work](./skills/productivity/show-me-your-work/SKILL.md)**: Keep a decision log for long or unattended work, audited against the transcript and reviewed by another model.
- **[swarm](./skills/productivity/swarm/SKILL.md)**: Fan a task out to parallel subagents as slices or a race, and return one evidenced report.
- **[why](./skills/productivity/why/SKILL.md)**: Find why code is the way it is, from git history, PRs, issues and docs, with every claim cited and labelled by confidence.
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**: Write skills, `AGENTS.md` and `CLAUDE.md` so the agent takes the same path every run: sharp pointers, the right things inline, checkable steps, no lines that change nothing.

## Contributing

Found a skill that made your agent write the wrong thing? [Open an issue](https://github.com/overextended/skills/issues/new/choose). To add a skill, follow [`.agents/new-skill.md`](./.agents/new-skill.md).

## License

[GPL-3.0](./LICENSE)
