---
name: why
description: Find why code is the way it is, through read-only investigators that search git history, PRs, issues and any docs or chat the agent can reach, then return a cited, confidence-weighted answer. Use when the user asks why something works this way, why a choice was made, where a number came from, or what a regression or postmortem traces back to, or when a skill such as architect calls for it.
---

# Why

Investigate the motivation and intent behind code. The companion `how` skill answers what the code does and how it works. `why` answers what forces led to its shape.

Every subagent below is read-only. Its brief carries the filled prompt template and the reference files it needs, pasted in or as absolute paths, and says: read-only, inspect only, no writes, no git commands that change state. Start each one with the same tool access you have: an investigator without its MCP can't search its source. Take each subagent's model from `~/.config/ox/models.md`, using the role its step names, and pass that line's model and effort to your subagent tool. If the line is `inherit`, is missing, or the file's `# harness` line names a different harness, omit both so the subagent runs on your model; if the file is missing, also suggest the user run `/setup-ox models`. If the tool rejects an entry, use the closest model it lists and say so. If the harness has no subagent tool, do each step yourself, in order.

## Operating posture

Operate as a **careful, cautious, and precise investigator**. Be honest about what you know vs what you're inferring. Read [EPISTEMICS.md](./EPISTEMICS.md) for the full confidence framework and phrasing guide. The synthesizer must follow it.

## Step 1. Understand the target and the question

The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?" with no clear referent), make your best guess from conversation context (open files, recent edits, what was just discussed). State your interpretation briefly so the user can redirect if you're off, then proceed.

## Step 2. Establish the code anchor

Before starting investigators, build the seed context inline: file paths and line ranges, key symbols (functions, tables, events, exports), the last few commits touching the target, PR numbers from merge commits (pattern `(#1234)` in the subject line), and any linked issue IDs. Run `git blame -L <start>,<end> <file>` for last-touch commits, `git log --follow -p -- <file>` for full history with patches through renames, `git log --oneline -20 -- <file>` for recent commits with PR numbers visible, and `git log -1 --format=%B <commit>` to extract PR numbers. Then pull the PR bodies and discussion for any substantive commit: `gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`.

When the target is in a resource the server runs but this repo doesn't own, or the server folder isn't a git repository, anchor on the resource's upstream repository and the version the server runs instead. [SOURCES.md](./SOURCES.md) says how to find both.

This anchor goes to every investigator and to the synthesizer.

## Step 3. Start parallel investigators

**Default to the full parallel investigation.** The goal is a complete coverage map, not a minimal one. Document the null, don't skip the search.

### Discovery

Before starting investigators, list the MCPs in your own tool list, grouped by server, including tools listed by name only before their schemas load. Map each one to one evidence category:

1. Source control history
2. Issue tracker
3. Long-form documents
4. Real-time chat
5. Infrastructure observability
6. Error tracking
7. Product analytics

Source control is always available through git and `gh`, and GitHub Issues through `gh` covers the issue tracker when the code lives on GitHub. For the rest, classify using the MCP name, server instructions, tool names, and resource descriptors. If an MCP could fit more than one category, choose the one matching its primary evidence. Record ambiguous cases in the coverage map.

Start one investigator per category that has a source, all at once so they run concurrently, each owning exactly one tool or MCP. Don't ask one agent to cover several. Each is named `why investigator: <category>` and uses the `explore` role.

Each investigator's brief is [INVESTIGATOR-PROMPT.md](./INVESTIGATOR-PROMPT.md) filled in, plus:

- its category's section of [SOURCES.md](./SOURCES.md), adapted to the MCP it was given
- the Incident context section of SOURCES.md **if the target code looks defensive** (null checks, retries, timeouts, rate limits, feature flags, distance or permission checks)
- the code anchor and the user's original question

### What each category is best at

Use this to know what to expect back, to name a gap when a category returns empty, and, only in the rare provably-irrelevant case, to justify a skip.

1. **Source control** (git history, `gh` for PRs, code comments, tests). Always start it, the only guaranteed source. Best at *implementation-time rationale captured during review*.
2. **Issue tracker** (GitHub Issues, or a Linear or Jira MCP). Best at *the product or user-facing forcing function*: the bug report or request behind the change.
3. **Long-form documents** (a docs site, wiki, or Notion-style MCP). Best at *long-form design rationale*, written out before it becomes code.
4. **Real-time chat** (a Discord, Slack, or Teams MCP). Best at *real-time deliberation that never reached a doc*. Especially important when the git, issue, and doc trail is thin.
5. **Infrastructure observability** (a Grafana, Datadog, or similar MCP). Best at *runtime reality that motivated the code*: timeouts, retries, rate limits.
6. **Error tracking** (a Sentry or similar MCP). Best at *the specific errors that motivated defensive code*: catch blocks, nil guards, type checks, retries.
7. **Product analytics** (a warehouse or analytics MCP). Best at *usage data that shaped the code*: flag-gated code, data migrations, "where did this number come from".

### When to skip an investigator

Only with an **explicit, written justification** that goes in the final Sources Consulted. Two valid reasons:

- **No source is available for that category** in this environment. Flag it as a gap, not a choice: "Real-time chat skipped. No matching MCP available, so the conversational record was not searchable."
- **The source is provably irrelevant**, not just "probably irrelevant." A high bar: "Error tracking skipped. Target is a build script with no runtime code path."

If the target is a single-commit change whose PR description already contains the complete answer, you may answer inline **only after** confirming every available category search would be redundant. Say so explicitly. This should be rare.

## Step 4. Synthesize

Start one synthesizer named `why synthesizer`, on the `hardest tasks` role. It gets:

1. The investigator findings, including any null results and any categories skipped with justification
2. The code anchor
3. The user's original question
4. The epistemics framework from [EPISTEMICS.md](./EPISTEMICS.md)
5. The synthesizer prompt from [SYNTHESIZER-PROMPT.md](./SYNTHESIZER-PROMPT.md)

## Step 5. Present

Present the synthesizer's output to the user. You may lightly edit for clarity or add context from the conversation, but **do not rewrite the confidence language**.

## Output format

The structure is the one in SYNTHESIZER-PROMPT.md: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Adapt as needed, but keep the confidence separation intact, and keep Sources Consulted as one line per investigator, including the ones that returned nothing or were skipped, with the reason.

After Sources Consulted, if the user's `why` question is a precursor to changing this code, convert the lineage findings into a Preserve / Change / Avoid / Risk constraint set for planning the change.

## Common failure modes to avoid

- **Recency bias**. Assuming the most recent commit is authoritative. The current shape is often the accretion of many earlier decisions. Trace back.
