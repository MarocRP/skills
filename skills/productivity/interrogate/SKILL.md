---
name: interrogate
description: Adversarial multi-model review of a change. Reviewers on different models challenge it independently, then a lead judgment sorts their findings into act on, consider, noted and dismissed. Use when the user asks to interrogate, stress test, adversarially review or tear apart a change, or when a skill such as architect calls for it.
---

# Interrogate

Start one reviewer per `panel` model to adversarially review code changes. The adversarial signal comes from model diversity, not assigned personas. The deliverable is a synthesized verdict. Do NOT auto-apply changes.

## Step 1, Scope

Identify what to review from context:

- If the user points at specific files or a diff, use that.
- If on a feature branch, diff against the merge base with the default branch (`git diff $(git merge-base HEAD origin/HEAD)`, else `main` or `master`) for the full changeset, including uncommitted changes.
- If the user's message references recent work, gather the relevant files.

Package the diff or file contents with any surrounding context files the reviewers need to understand the code.

## Step 2, Intent

Before starting reviewers, state the intent in one clear paragraph from the user's message, commit messages, the PR description if one exists, and the code. If the intent is unclear, state your best reading and proceed. The user can redirect.

## Step 3, Start reviewers

Start all reviewers at once, one per entry on the `panel` line of `~/.config/ox/models.md`, labeled Reviewer A, B, and so on to match the entry count, passing each entry's model and effort to your subagent tool. If the file or the line is missing, or the file's `# harness` line names a different harness, run three reviewers on your own model, say so, and suggest the user run `/setup-ox models`: the review then loses its model diversity. If the tool rejects an entry, run that reviewer on the closest model it lists and say so. Don't block the review on it.

Each brief says read-only: inspect only, no writes, no git commands. Fill [REVIEWER-PROMPT.md](./REVIEWER-PROMPT.md) the same way for every reviewer, with the stated intent, the diff or file contents, the rubric from [RUBRIC.md](./RUBRIC.md), and the code-quality lens from [CODE-QUALITY.md](./CODE-QUALITY.md).

## Step 4, Synthesize

As results come back, build a unified picture. Parse every reviewer's findings. Merge findings that describe the same issue differently, and note which models raised each one. Findings two or more models raised independently are the highest signal. Read a lone model's finding, but weight it accordingly. Note disagreements. If one model flags something and another explicitly says the opposite, that is context for the verdict.

## Step 5, Lead judgment

You are the lead reviewer, a pragmatic senior engineer, not a neutral aggregator. Read [LEAD-JUDGMENT.md](./LEAD-JUDGMENT.md) for the full framework. Put every finding in one of four buckets, with the model(s) that raised it and a one-line rationale.

- **Act on**. Real issues affecting correctness, security, or maintainability given the actual goals. They would block a real PR.
- **Consider**. Legitimate, but you're not sure they outweigh the cost of addressing them now. Worth the user's attention.
- **Noted**. Technically valid but not actionable. Context-dependent, premature optimization, or low-impact at this stage.
- **Dismissed**. Wrong, nitpicky, or missing context, with a brief reason.

## Output format

### Intent
> [The stated intent paragraph from Step 2]

### Reviewers
- Reviewer [label]: [model name], [N findings] (one bullet per reviewer)

### Act on
[Each: description, which models raised it, why it matters.]

### Consider
[Each: description, which models raised it, the tradeoff.]

### Noted
[Brief list.]

### Dismissed
[Each with a brief rationale.]

### Agreement map
[Where models agreed and diverged, and what that pattern tells us.]
