## What it does

`retro` looks back at a coding session and suggests changes to the agent's environment so the next session goes better: a pointer that would have saved a long search, a check that would have caught a mistake, an instruction that does nothing. It reads the session's own log, so its suggestions come from what the agent actually did, not from what you remember.

It treats an instruction as the last resort. A mistake with a fixed shape, such as a banned native or a file in the wrong folder, gets a lint rule, a pre-commit hook or a CI job, because a check fires every time and an instruction only sometimes.

## When to reach for it

You invoke this by typing `/retro`; the agent won't reach for it on its own. Run it at the end of a session that went badly or took longer than it should have, or name an earlier session for it to read. It only suggests: nothing changes until you pick a suggestion.

## What it looks for

| Category | Signal in the session |
| --- | --- |
| Navigation | The agent took a long time to find something |
| Automated checks | A mistake a linter, type check or test would have caught, or a repo with no check wired up at all |
| Coding standards | The review step let a mistake through |
| `AGENTS.md` size | Instructions in always-loaded files that belong in a check or a standards file |
| Tool economy | Expensive tool calls, or subagents on the wrong model |
| No-ops | Instructions that don't change what the agent does |
| Information access | Something the agent needed but couldn't see, such as the server console |

## Common questions

**What Lua check does it suggest?**
LuaLS with [fivem-lls-addon](https://github.com/overextended/fivem-lls-addon), which knows FiveM's natives and CfxLua syntax and can run in CI with `lua-language-server --check`. A stock Lua linter rejects backtick hashes and `+=`.

**Where does it find old sessions?**
In the harness's own logs: `~/.claude/projects/` for Claude Code, `~/.codex/sessions/` for Codex.

## It's working if

- Suggestions are ordered by severity, and each one names the moment in the session it came from.
- Mechanical mistakes come back as checks to add, not lines for `AGENTS.md`.
- Some suggestions remove instructions rather than add them.

## Where it fits

The **end-of-session** loop for everything else in this set. It loads [writing-for-agents](./writing-for-agents.md) before writing any suggestion, and when the cause was stale project facts or the wrong subagent models, it points you back to [setup-ox](../ox/setup-ox.md).
