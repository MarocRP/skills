# Explorer prompt template

Build each explorer subagent's prompt from this template. Fill in the placeholders.

---

Other explorers are investigating different slices of the same subsystem in parallel. Don't try to cover everything. Focus on your assigned angle and go deep. Start from the resource's `fxmanifest.lua`, which names each side's entry scripts and the files the client loads.

## Question

> {QUESTION}

## Your exploration angle

{EXPLORATION_ANGLE}

## Output

### Components found
The key modules, tables, classes and abstractions. For each: name, file path, and a one-sentence description of what it does.

### Flow
The execution flow step by step. For each step: what function runs, what file it's in, which side it runs on (client, server or NUI), what it does, and what it calls next. Include the data that flows between steps.

### Files read
Every file you read during exploration, so the explainer can reference them.

### Boundaries
Where this subsystem connects to other parts of the codebase or other resources: net events, callbacks, exports, state bags, NUI messages, database tables. The inputs and outputs.

### Non-obvious things
Anything surprising, historically motivated, or easy to get wrong. Things that look like they should work one way but work another.

### Open questions
Anything you couldn't fully trace or understand. Be honest about gaps.
