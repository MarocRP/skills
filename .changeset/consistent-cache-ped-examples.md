---
"overextended-skills": patch
---

**`lua-best-practices`** and **`resource-best-practices`** no longer contradict each other: their loop examples read `cache.ped` instead of `PlayerPedId()`, and `resource-best-practices` now uses `lib.points` for "do something near a location" instead of a hand-written distance loop.
