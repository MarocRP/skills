# Sources

Each investigator owns one evidence category and reads the matching section below, adapted to the tool or MCP it was given.

## Source control (git and GitHub)

The most trustworthy source, tied directly to the code, and the most complete. It holds:

- Commit history (messages, dates, authors, diffs)
- PR descriptions, review comments, and discussion threads (through `gh`)
- Inline code comments, TODOs, FIXMEs, deprecation notes
- ADRs (architectural decision records) if the repo keeps them
- Tests, whose names and assertions often encode the edge cases that motivated a change
- Related files modified in the same commits (co-change signal)
- CHANGELOG entries and GitHub release notes
- Issue IDs in commit messages and PR bodies

Expand the seed commit list:

```bash
# History through renames
git log --follow --oneline -- <file>

# Pickaxe: commits that added or removed this exact text
git log -S '<exact_string_from_code>' -- <file>

# Or for patterns:
git log -G '<regex>' -- <file>

# Who wrote each line and when
git blame -L <start>,<end> <file>

# One commit's full diff
git show <hash>

# Commits between two points affecting this file
git log <old>..<new> -p -- <file>
```

Look for out-of-band docs:

```bash
# ADRs often live in docs/adr/ or similar
rg -l -i 'architecture.decision' --glob '*.md'

# TODOs and FIXMEs near the target
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# Related tests
rg -l '<symbol>' --glob '*test*'
```

### A resource you don't own

When the target is in a resource the server runs but this repo doesn't own (ox_inventory, ox_lib, a framework), its history lives in its upstream GitHub repository, not in the server folder. Find the repository from the `repository` field of its `fxmanifest.lua` (every Overextended resource sets one, such as `https://github.com/overextended/ox_inventory`), and the version from its `version` field or the `ox resources` line of `.ox/config.md`. Overextended tags each release `v<version>`, so `gh api repos/<owner>/<repo>/compare/v<old>...v<new>` lists what changed between two versions. Search that repository's PRs, issues and release notes with `gh` the same way as a local one:

```bash
gh search prs --repo <owner>/<repo> '<symbol or error string>'
gh search issues --repo <owner>/<repo> '<symbol or error string>'
gh release view v<version> --repo <owner>/<repo>
gh api 'repos/<owner>/<repo>/commits?path=<file>' --jq '.[] | .sha[0:7] + " " + .commit.message'
```

## Issue tracker

GitHub Issues through `gh`, or another tracker's MCP. It holds the product or user-facing reason: the bug report, the feature request, the "this broke for servers with X" thread.

1. **Start with linked issues.** Fetch every issue the seed commits or PRs reference, and read the full thread, comments included.
2. **Search by keyword.** The feature name, the key symbol, the error string a user would paste. Try several phrasings.
3. **Walk the tree.** A sub-issue is tactical. Its parent or milestone often carries the why.
4. **Check labels and milestones.** They hint at the kind of motivation (bug, enhancement, breaking change) and tie work to a release.

## Long-form documents

A docs site, a wiki, or a docs MCP. Design rationale written before it became code.

1. Search for the feature name, key symbols, and user-visible terms. Read the full page, not the preview: rationale is often mid-document.
2. Follow child pages and backlinks for alternatives considered.
3. Specs are often written before implementation and not updated. Cross-check against the actual PR, and record any divergence as a contradiction.

## Real-time chat

A Discord, Slack, or Teams MCP. Real-time deliberation that never reached a doc. Check the MCP's tools first. If it isn't authenticated, stop and report the gap.

1. **Author-bounded search.** Messages from the PR author around the merge date.
2. **PR URL search.** Search for the PR URL or `/pull/<number>`.
3. **Error string search.** If the code handles a specific error, search for it. Support and incident threads often surface.

Pitfalls: old messages may be gone (note the retention cliff), DMs aren't searchable, a joke is not a decision, and a single message reads differently without its thread, so always fetch the thread.

## Observability, error tracking, and analytics

An infrastructure monitoring, error tracking, or analytics MCP. The runtime reality that motivated the code: the exception a guard was added for, the threshold a limit was clamped to, the usage a flag was gated on.

1. Build queries from the exception names, error strings, function names, and file paths the target handles.
2. Bound every query to a window around the ship date, about 30 days either side.
3. Probe before trusting a table, metric or project name: names are deployment-specific.

Pitfalls: instrumented is not caused (a metric existing doesn't mean the code exists because of it), correlation is not causation (other changes landed in the same window), and data past the retention window is a gap, not a null result.

## Incident context

Add this when the target looks defensive: null checks, retries, timeouts, rate limits, feature flags, distance or permission checks.

- **Issues:** look for labels such as `bug`, `exploit`, `crash`, `regression`, and for issues opened shortly before the target landed.
- **Chat:** search support and incident channels around the dates the target was added.
- **Git:** commit messages like "fix exploit", "add check", "hotfix", or a "revert" followed by "re-apply with..." are strong signals.
