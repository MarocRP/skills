### Prototype

**You own the design decision, not the code. The prototype is a throwaway instrument. The real build follows Feature.**

The one playbook where the **Laziness Protocol**'s "smallest change" and the verification bar invert. Speed over polish, code quality does not matter, no planning. The rigor is in picking the right design cheaply. Propose variations the user didn't ask for, throw an approach away and try another.

1. Scope the decision the prototype exists to make: which layout, which interaction, which density, or for an empirical fork which behavior or approach. No decision means no prototype. Route to Feature.
2. Gather references when the design space is open. Search for prior art and summarize the themes, palettes, and layouts it shows, then pick the directions worth building and say why. Skip when the direction is set.
3. Build throwaway in an isolated scratch dir, separate from the resource. For a NUI decision, vanilla HTML/CSS/JS or the lightest stack that renders the idea, CDN deps, a dev server with hot reload. For a behavioral decision, the smallest script that exercises the question. No production framework, no tests, no abstractions.
4. When comparing alternatives, build them behind one switcher (buttons or a keypress), each variant labeled. This is **Exhaust the Design Space** made cheap.
5. Observe the thing you are deciding. For a visual decision, screenshot each variant through a browser tool when the harness has one (in T3 Code, `preview_*`, with `preview_recording_start` and `preview_recording_stop` for video). For a behavioral decision, log the result or print the output. The observation is the test here, not an assertion.
6. Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Hand the chosen direction to Feature (or `architect` for the shape) for the real build.

**Reply:** the variants explored, the evidence (screenshots for a visual decision, the observed output for a behavioral one), tradeoffs, your recommendation, and the scratch path. Say plainly that the prototype is throwaway.
