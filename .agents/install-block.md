# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## Routes

Lead with installs that update themselves. Fall back to skills.sh, labelled "manual updates", only for agents that have no such install.

Every plugin route installs from this repo's own marketplace, `.claude-plugin/marketplace.json` plus `plugin.json`. Those routes reinstall only when the `version` in `plugin.json` changes. The Release workflow runs `npm run version`, which copies that field from `package.json`, so users get a release when the "chore: version skills" PR merges.

## Claude Code

<canonical-block name="claude-code">

```bash
claude plugin marketplace add overextended/skills
claude plugin install overextended-skills@overextended
```

To update, run `claude plugin update overextended-skills@overextended`, or turn on auto-update for the `overextended` marketplace in `/plugin`.

</canonical-block>

## Codex

<canonical-block name="codex">

```bash
codex plugin marketplace add overextended/skills
codex plugin add overextended-skills@overextended
```

</canonical-block>

## GitHub Copilot (CLI)

<canonical-block name="copilot">

```bash
copilot plugin marketplace add overextended/skills
copilot plugin install overextended-skills@overextended
```

</canonical-block>

## Gemini CLI

Gemini doesn't read `.claude-plugin`, and `--path` takes one bucket. One install per bucket gives the full set.

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/overextended/skills.git --path skills/ox
gemini skills install https://github.com/overextended/skills.git --path skills/fivem
gemini skills install https://github.com/overextended/skills.git --path skills/productivity
```

Re-run all three commands to update.

</canonical-block>

## Every other agent, or editable files (skills.sh)

<canonical-block name="other-agents">

```bash
npx skills@latest add overextended/skills -a <agent>  # cursor, opencode, windsurf, ...; omit -a to choose
```

To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</canonical-block>

Use the single-skill form wherever one skill is named on its own:

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add overextended/skills --skill=<name>
```

</canonical-block>

`skills@latest` is the pinned spelling everywhere.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".
