# Ship the skills as a plugin from this repo's own marketplace

Skills live in bucket folders under `skills/` (`ox/`, `fivem/`). Users should be able to subscribe to the set as a managed bundle that updates itself, and also be able to copy editable files if they'd rather own them.

## Decision

- `.claude-plugin/plugin.json` lists every skill one by one in its `skills` array. Claude Code, Codex and Copilot all read this manifest.
- `.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace, `overextended`. Every plugin route installs `overextended-skills@overextended` from it.
- skills.sh stays as the universal fallback for every other agent, and for anyone who wants editable copies.

## Invariants this creates

- Every skill has an entry in `plugin.json`'s `skills` array.
- `plugin.json`'s `version` tracks `package.json`'s. `npm run version` keeps them in sync via `scripts/sync-plugin-version.mjs`; plugin harnesses only reinstall when that field changes.
- Codex copies the plugin tree into its cache and drops symlinks, so skills must be real directories, never symlinks into another bucket.
