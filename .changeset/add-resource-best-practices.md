---
"overextended-skills": minor
---

Add **`resource-best-practices`** (model-invoked) to the **FiveM** bucket, for creating, editing and reviewing resource code on any framework. It covers the standard practice that isn't security: spawning entities client-side and non-networked unless they must be shared (then on the server), requesting network control only when the server whitelists the entity, working with networked sounds, ragdoll requests and script entity states blocked, cleaning up on player drop and resource stop, events over loops, copying `source` before a yield, targeted network sends and small state bags, and parameterised, limited, atomic SQL.
