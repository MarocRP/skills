### Authoring or modifying a skill

**You own the skill's voice.**

1. Call the Skill tool with `writing-for-agents` and write to it. Follow the repo's own skill conventions when it has them (its `AGENTS.md`, a contributor guide). With none, put a project skill's directory at `.agents/skills/<name>/` with a relative symlink `.claude/skills/<name> -> ../../.agents/skills/<name>`, and commit both. A user-invoked skill sets `disable-model-invocation: true` and also ships `agents/openai.yaml` with `policy.allow_implicit_invocation: false`.
2. Validate the skill: frontmatter has `name` and `description`, referenced files exist, skill references resolve. Run the repo's own validator when it has one (`claude plugin validate .` for a Claude Code plugin).
3. Test cases if structural. Skip if subjective. To measure how a change affects agent behavior, run the Eval playbook.
4. Run **Opening a PR**.

When in doubt, delete. Keep only prose that changes a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config) per **Encode Lessons in Structure**. Reach other skills through the Skill tool. Don't restate them. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
