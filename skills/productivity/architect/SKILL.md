---
name: architect
description: Sketch types, signatures and module structure before writing code, from several candidate designs on different models, then implement against the chosen sketch. Use when the user asks to architect or design something, or when a skill such as figure-it-out calls for it.
---

# Architect

Sketch types, function signatures, table shapes, and module boundaries with `not implemented` bodies and pseudocode. Synthesize across multiple model perspectives, then fill in code against the chosen sketch.

Principles named in bold are in the `principles` skill: call the Skill tool with `principles` once, then read each named principle's file.

## Start

Open a task list (your harness's task tool, or a checklist file at `~/.local/state/ox/checklists/<repo>-<branch>.md` when it has none) with one entry per phase before starting.

1. Ground
2. Sketch
3. Agree
4. Implement
5. Scrap

## Phase A: Ground the problem

Build a real mental model of every system the new code touches. Call the Skill tool with `how` over the relevant subsystems. Naming a file isn't grounding. Produce the architectural explanation `how` prescribes. If the design redefines ownership or layering, also call the Skill tool with `why` on the existing shape so the rationale becomes a constraint, not a guess.

Skip Phase A only when the work is genuinely greenfield with no surrounding system to integrate.

## Phase B: Sketch

Call the Skill tool with `arena`, giving it the design-sketch task and the Phase A grounding artifacts. Paste [RUNNER-PROMPT.md](./RUNNER-PROMPT.md) into each runner's brief, along with the absolute paths of this file, [RATIONALE-TEMPLATE.md](./RATIONALE-TEMPLATE.md), and the `principles` files that prompt names. The runners are arena's `panel` seats.

Design it twice. Require at least two structurally distinct candidates before synthesis, even when the first looks sufficient. This is **Exhaust the Design Space** made concrete. Whole-shape alternatives, not point fixes inside one shape.

Screen every candidate against [DESIGN-RED-FLAGS.md](./DESIGN-RED-FLAGS.md) before synthesis. Assume the next contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole resource.

Compare viable candidates on interface depth. Prefer the design that hides more complexity behind a smaller, simpler public surface: fewer exports and events, each doing more. A rich interface can keep call chains short by concentrating capability instead of scattering it across layers.

Arena returns one synthesized design package. Its synthesis decision fills the rationale's "Synthesis decision" section.

## Phase C: Agree (opt-in)

Default: proceed directly to implementation with the synthesized design. No human checkpoint.

Opt in to a checkpoint only when the invoker explicitly asks: "architect with checkpoint," "stop and show me before implementing," or similar. Then surface the synthesized design and pause for sign-off.

The synthesis can ship as its own commit either way, as the "scaffold first" mode of **Foundational Thinking**. Planned and scoped breakage during fill-in is fine, per **Outcome-Oriented Execution**. For adversarial pressure on the design before implementing, call the Skill tool with `interrogate` on the synthesized sketch.

If the human pushes back on the shape (in a checkpoint or after the fact), treat that as Phase A evidence. Re-ground and re-run Phase B before writing more code.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code, pseudocode with logic. The synthesized sketch is the contract. Deviations from it are signal to surface, not friction to absorb silently. If a function needs a parameter the sketch didn't anticipate, ask whether the sketch was wrong, the requirement was missed, or the implementation is overreaching.

## Phase E: Scrap when the architecture is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out. Don't bolt fixes onto a wrong design, per **Redesign from First Principles** and **Fix Root Causes**.

The signal is a *pattern*, not single instances. Tells:

- The same shape of workaround appearing repeatedly across unrelated code.
- Multiple unrelated edge cases that all need special-case branches.
- Types that need escape hatches (`any`, casts, `--[[@as T]]`, optional fields always set in practice) to compile or type-check.
- The "we need a lock" reflex when the sketch said the state wasn't shared.
- Callers having to know the abstraction's internal rules to use it.
- Two or more independent Phase D deviations of the same shape across the implementation.

Use judgment. A few edge cases don't condemn an architecture. Some problems are legitimately complex. Complexity in the data is not complexity in the design.

When you scrap:

1. Call the Skill tool with `how` over what's been built.
2. Redesign as if the new constraints had been day-one assumptions, per **Redesign from First Principles**.
3. Subtract before adding, per **Subtract Before You Add**. The new sketch should be smaller than the old one before it grows.
4. Return to Phase B and re-run arena.

## Outputs

The caller's usage is written first and the type sketch derived from it. One file with new types and signatures for small changes. Module map plus type definitions for larger work. The rationale ships alongside, shaped per [RATIONALE-TEMPLATE.md](./RATIONALE-TEMPLATE.md), including the usage sketch and the synthesis decision.
