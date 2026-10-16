## What it does

`architect` designs code before writing it. It learns the systems the change touches with [how](./how.md) (and [why](./why.md) when ownership is changing), runs [arena](./arena.md) to get at least two structurally different sketches from different models, screens them for design red flags, and synthesizes one: types, signatures and a module map with `not implemented` bodies, plus a one-page rationale. Then it implements against that sketch, and throws the sketch out if implementation keeps fighting it.

The caller's view comes first. Each sketch starts from the call sites (another resource's export call, a client's callback, a NUI message) and derives the types from them.

## When to reach for it

Type `/architect`, or the agent reaches for it when you ask it to design something, or when [figure-it-out](./figure-it-out.md) meets a one-way-door decision. To review the sketch before any code is written, ask for a checkpoint ("architect with checkpoint"). Otherwise it goes straight to implementation.

## Red flags it screens for

| Flag | Sign |
| --- | --- |
| Shallow module | Callers coordinate several exports or events to do one thing |
| Information leakage | An export or event payload mirrors a database row |
| Temporal decomposition | Modules split into load, validate, save steps instead of by what they own |
| Split ownership | Two modules write the same state |
| Two ways to do one task | An agent copies whichever it finds first |
| Importable internals | Helpers reachable from outside the module or resource |
| Hand-synced lists | Adding an item means editing several lists |

## It's working if

- The rationale names the alternatives that lost and why.
- The usage sketch and the types agree.
- When the same workaround keeps appearing during implementation, the agent redesigns instead of piling on fixes.

## Where it fits

The **design step** for anything with a wrong shape that would be costly. It runs [how](./how.md), [why](./why.md), [arena](./arena.md) and optionally [interrogate](./interrogate.md), and applies [principles](./principles.md) throughout.
