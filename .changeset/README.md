# Changesets

Every change a user would notice (a new skill, a changed behaviour, a rename, a removal) ships with a changeset. Run `npx changeset`, pick the bump, and describe the change from the user's side.

The Release workflow collects pending changesets into a "chore: version skills" PR. Merging it bumps `package.json`, syncs `.claude-plugin/plugin.json` via `scripts/sync-plugin-version.mjs`, and writes `CHANGELOG.md`.

See the [changesets docs](https://github.com/changesets/changesets) for the rest.
