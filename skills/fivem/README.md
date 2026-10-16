# FiveM

FiveM resource development in general, independent of the ox stack: `fxmanifest.lua`, natives, state bags, NUI, Lua 5.4.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[deslop](./deslop/SKILL.md)**: Remove AI-generated slop from resource code without changing behaviour, keeping every server-side check on client data.
- **[lua-best-practices](./lua-best-practices/SKILL.md)**: Structure resource Lua the way Overextended does: when to use `require`, `lib.load` or `lib.loadJson`, one entry script per side, convars for config, and ox_lib's `cache`, points and callbacks.
- **[tdd](./tdd/SKILL.md)**: Fix bugs in TypeScript resources test-first, with natives and ox_lib mocked so no server is needed.
- **[typescript-best-practices](./typescript-best-practices/SKILL.md)**: Type resources and their NUI so impossible states don't compile, and parse everything that arrives through net events, callbacks, exports and state bags.
