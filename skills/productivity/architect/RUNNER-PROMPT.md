# Architect runner prompt

The orchestrator passes this file through to every parallel candidate runner during Phase B and fills in the variable inputs around it: the task, the Phase A grounding artifacts, the isolated working directory, the path to write outputs, and the absolute paths of the architect `SKILL.md`, the rationale template, and each principle named below. The working directory is a git worktree when available, otherwise a per-runner directory. What matters is independence between candidates.

You are producing one candidate design in architect's parallel exploration. Read the architect `SKILL.md` in full first. That's the workflow you're inside. Output a candidate design package: type sketch, function signatures, module map, and prose rationale shaped per the rationale template.

Apply the following discipline. The orchestrator compares candidates on these axes to pick a base.

- Caller's usage first. Write the README-style usage and two or three real call sites before the types, then derive the type sketch from them. The usage is the spec. The two must agree, so reconcile the sketch to the usage, not the reverse. In a resource, a call site is an export call, a net event or `lib.callback` call, or a NUI message.
- Data structures first. Get the core types right and the code becomes obvious. Trace each dominant access pattern through the proposed structure. If the answer is "we'll add a map / index / cache later," the structure is wrong.
- Interface depth. Compare the capability hidden behind the public surface relative to the size of that surface. Prefer a simple interface that pulls complexity into the callee, even when the implementation becomes less simple. Do not put transport or wire types on the public API. Parse into domain types behind the interface.
- Shared state: if two actors might both write, ask "what happens?" If the answer isn't "nothing," default to per-actor state with a merge at the read boundary, per the Separate Before Serializing Shared State principle.
- Make boundaries visible. `error('not implemented')` in Lua or `throw new Error('not implemented')` in TypeScript for bodies, `TODO` pseudocode for tricky logic, and annotations stating intent and invariants (LuaLS `---@class` and `---@param`, or TypeScript types and doc comments). A reader should trace data from input to output by reading types and signatures alone.
- Encode invariants in types: hard-to-misuse types > runtime checks > prose comments, per the Encode Lessons in Structure principle.
- Validate at boundaries, trust types inside, per the Boundary Discipline principle. Server code validates everything a client sends. Business logic as pure functions. The shell stays thin.
- Single source of truth per invariant. Derive instead of sync.
- Idempotent state transitions where applicable, per the Make Operations Idempotent principle. Ask what happens if the operation runs twice, crashes halfway, or the resource restarts mid-operation.
- Short call chains. If tracing the flow needs more than three files, flatten the hierarchy, per the Laziness Protocol and Minimize Reader Load principles.

You are one of the parallel runners, each on a different model. Produce the best design your model can make. Don't hedge against the others. Differences between candidates are the signal used to pick a base and graft. Converging on a safe-looking middle defeats the exploration.
