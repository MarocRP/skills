This repo holds agent skills for building FiveM resources with the Overextended stack. Skills are organized into bucket folders under `skills/`:

- `ox/`: one Overextended resource each (ox_lib, ox_core, ox_inventory, ox_target, oxmysql, ...)
- `fivem/`: FiveM resource development in general, independent of the ox stack (fxmanifest, natives, state bags, NUI, Lua 5.4)
- `productivity/`: general workflow tools, not specific to FiveM or the ox stack (writing, reviewing, cleanup)

To add a skill, follow [.agents/new-skill.md](./.agents/new-skill.md).

Every skill must have a reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`'s `skills` array. Run `claude plugin validate .` after touching either manifest (not `--strict`: it rejects the root `CLAUDE.md`, which is for contributors, not shipped context). [ADR 0001](./.agents/adr/0001-ship-as-a-plugin-from-our-own-marketplace.md) records why.

Run `npm run check-skills` after touching any skill or manifest. It parses every `SKILL.md` frontmatter and `agents/openai.yaml` and checks them against `plugin.json` and `docs/`. CI runs it on every push and pull request; `claude plugin validate` doesn't catch a frontmatter parse error.

Install commands are copied verbatim from [.agents/install-block.md](./.agents/install-block.md).

Each skill entry in the top-level `README.md` links the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`. Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**, omitting a group that would be empty.

Every skill has a human-facing docs page at `docs/<bucket>/<skill-name>.md`. When you add, rename, or change the behaviour of a skill, create or re-sync its docs page following [.agents/writing-docs.md](./.agents/writing-docs.md).

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`) or model-invoked. See [.agents/invocation.md](./.agents/invocation.md).

A skill that depends on the user's project (framework, resource versions, language) reads `.ox/config.md`, found by walking up from the current directory. If it's missing, the skill detects what it needs itself and suggests the user run `/setup-ox`. `setup-ox` owns the file's format: change it there first.

A skill that starts a subagent picks its role (`explore`, `verify api`, `implement`, `review`, `hardest tasks`, or the `panel` list) and uses that role's line in `~/.config/ox/models.md`, passing the model and effort to the harness's subagent tool. `inherit`, a missing line, a missing file, or a `# harness` line naming another harness all mean: omit the model and effort so the subagent runs on the parent's. Say so when the file is missing, and suggest `/setup-ox models`. The roles are defined in `setup-ox`: add a role there before any skill uses it.

Every API a skill teaches is checked against the resource's current source before it lands. A wrong export name or signature in a skill is worse than no skill, because the agent trusts it over its own judgement.

A skill that's retired is deleted, and the changeset that removes it names whatever replaced it.

Every user-visible change ships with a changeset (`npx changeset`).

To (re)link every skill into the local harness skill directories (`~/.claude/skills`, `~/.agents/skills`), run `scripts/link-skills.sh`.

No em-dashes anywhere in this repo's prose (`SKILL.md` files, docs, `README.md`, `CHANGELOG.md`, ADRs, changesets, code comments). Rewrite the sentence with a comma, colon, period, parentheses or a conjunction instead of substituting the character.
