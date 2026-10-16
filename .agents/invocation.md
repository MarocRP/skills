# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing**: a one-line summary read by a person browsing slash-commands. Strip trigger lists ("Use when the user says...").
- **Model-invoked**: reachable by **model or user**. The default: omit `disable-model-invocation` and the `policy` block from `agents/openai.yaml`. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user is writing an `fxmanifest.lua`, mentions `lib.callback`, asks about...") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_

Most skills in this repo should be **model-invoked**: knowledge of how an ox resource works is exactly what the agent should reach for on its own the moment it sees `exports.ox_inventory` or `lib.points`. Reserve user-invoked for workflows the human starts deliberately (scaffolding a new resource, running a migration).

A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Every skill carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata: `interface.display_name` and `interface.short_description` for the skill picker, and, for user-invoked skills, the `policy.allow_implicit_invocation: false` that pairs with `disable-model-invocation`. Keep the two in sync: a skill is user-invoked in both harnesses or neither.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between skills

Express a dependency as an explicit instruction to **call the Skill tool** with the named skill (`Call the Skill tool with "ox-lib"`), not a deep `../other-skill/FILE.md` cross-reference and not a bare `/skill` mention left for the model to interpret. Shared reference material lives inside the skill that owns it; other skills reach it by calling the Skill tool, not by linking across folders.

The Skill tool takes one skill per call. A step that needs two skills is two calls: say so (`Call the Skill tool twice, for "ox-lib" and "oxmysql"`).

This only holds when the named skill is **model-invoked**. When a step's precondition is a user-invoked skill, phrase it as an instruction for the human: "tell the user to run `/<name>`".
