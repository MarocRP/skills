# Review-bot triage

Use this reference when a playbook handles comments from review automation: Cursor's Bugbot, GitHub Copilot review, CodeRabbit, an agentic security review. The goal is not to ignore bots by default. The goal is to stop treating every comment as a required code change.

## Decision rubric

Classify each bot thread before acting:

- `fix`: The comment identifies a plausible correctness, security, privacy, data loss, permission, item or money duplication, migration, idempotency, race, or shipped-behavior issue. Fix it in the lowest owning PR, then reply with the commit SHA and resolve the thread.
- `dismiss`: The comment matches a documented low-risk noisy pattern below, and the current code proves the concern does not need a code change. Reply with a short reason and resolve the thread.
- `escalate`: The comment is novel, high-severity, security- or data-related, or ambiguous, and no small fix clearly reduces the risk. Leave the thread open and list it in the reply as needing the owner's call, with your reading of it. Keep working the rest.

When in doubt between dismiss and the others, don't dismiss. Skipping a noisy code-quality comment is cheap. Skipping a real exploit or data bug is not.

## Learned pattern format

Add future patterns in this shape:

```markdown
### <short pattern name>

- Confidence: candidate | recurring | strong
- Skip when: <conditions that must be true>
- Do not skip when: <risk boundaries>
- Example signal: <phrases or code context that identify the pattern>
- Source: <PR/comment URL or short historical note>
```

Use `candidate` for one or two examples. Use `recurring` after multiple real dismissals. Use `strong` only when the pattern is narrow, repeatedly verified, and low-risk.

## Recurring skip candidates

### Upstack or stack-local usage the bot cannot see

- Confidence: candidate
- Skip when: The bot flags an export, function, event, or file as unused, and the stack's PR list and diffs show a later PR in the stack uses it.
- Do not skip when: The current PR is not part of a stack, the symbol is an export other resources may call, or the supposed upstack use cannot be verified.
- Example signal: "Exported function is never used" with a reply like "used upstack".

### Temporary duplication during parallel implementation

- Confidence: candidate
- Skip when: The PR intentionally duplicates a small amount of code to keep a new path parallel to an old path that is being deleted, replaced, or proven out.
- Do not skip when: The duplicated code changes security, item or money handling, data access, or an export's behavior, or a shared helper would clearly reduce risk.
- Example signal: "Significant duplication" where the owner explains the old path will be deleted.

### An existing invariant covers the warning

- Confidence: candidate
- Skip when: The concern is already guaranteed by a shared helper, a type or annotation, a server-side check upstream, or a single source of truth visible in the current diff or nearby code.
- Do not skip when: The invariant is assumed but not enforced, depends on timing, or crosses the client/server boundary, where the client can send anything.
- Example signal: A nil warning on a value the same function just validated, or a missing check that the caller already runs on the server.

### Owner-declared follow-up or deferred cleanup

- Confidence: candidate
- Skip when: The PR owner explicitly says the issue is a known follow-up, the behavior is not made worse by the current PR, and the comment is not about a high-risk area.
- Do not skip when: The agent is acting without owner input, the issue is medium or high severity, or deferring would merge a new regression.
- Example signal: "I'll worry about that later" or "we'll delete this eventually".

### Self-withdrawn or explicit false-positive rule comments

- Confidence: recurring
- Skip when: The comment body or a later bot reply explicitly says the finding is withdrawn, compliant, or a false positive, and the agent can verify the relevant rule locally.
- Do not skip when: The only evidence is a human saying "false positive" on a high-risk issue without explanation.
- Example signal: A naming-rule comment whose body says the file is already compliant.

### Stale security finding already fixed later in the same PR

- Confidence: candidate
- Skip when: A security review claims a missing permission, ownership, or validation check, and the current PR head clearly includes that exact check before the side effect, typically added in a later commit after the review ran.
- Do not skip when: The check runs after the side effect it guards, trusts a value the client sent, or doesn't cover the case the finding names.
- Example signal: A high-severity "missing permission check" finding while the exact `IsPlayerAceAllowed` or job check already runs on the head.

### Widening a deliberately narrow error condition

- Confidence: candidate
- Skip when: The finding asks to broaden a narrow error condition (a specific error code or status) into a catch-all, and that narrowness encodes a real distinction, such as "dependency missing" versus "the call ran and failed". Retrying on any failure would re-run a legitimate failure against the fallback and report the fallback's error, hiding the real one.
- Do not skip when: The narrow condition misses a case in the same category, the unhandled path loses data or leaves partial state, or the retry is idempotent and the original error is still surfaced.
- Example signal: "only falls back when X is missing ... never tries the fallback when X fails".

## Verify first, then classify

- A claim that a test no longer matches the code, or that a check fails, costs one command to settle. Run it on the PR head before classifying. A red run confirms the claim. A green run is the concrete disproof for the dismissal reply.

## Never auto-dismiss

Do not dismiss these categories, even if an earlier PR dismissed something similar:

- Security, privacy, permission, and server-trusting-client findings: net event and callback arguments, NUI data, anything a client can trigger.
- Item, money, or inventory duplication and loss.
- Migration, schema, idempotency, concurrency, and cross-resource behavior findings.
- High-severity findings.
- Comments where the suggested fix is small and clearly reduces risk without changing product intent. Fix those.

## Candidate learnings

Append new candidate patterns here during or after babysitting when they look team-useful but not yet mature. Promote a candidate into the section above once several PRs confirm it.
