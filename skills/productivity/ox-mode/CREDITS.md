# Credits

Adapted from the `poteto-mode` skill in [pstack-t3](https://github.com/mariusflorescu/pstack-t3/tree/main/skills/poteto-mode), itself adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, whose working style ("poteto") it encodes. The structure (non-negotiables, autonomy, subagents, reply rules, and one playbook per kind of task) is kept. Changes here:

- Subagents take their models from the roles in `~/.config/ox/models.md` instead of T3 Code's `delegate_task` and `~/.config/pstack/`, and other skills are reached through the Skill tool instead of file paths. The principle index lives in the `principles` skill.
- Verification uses only checks the agent can run itself. Steps that needed a person to act, such as reproducing in game, approving a review gate, or recording a video, are gone or report the gap instead.
- Babysit, Shipping, Orchestrate, Autopilot-full and Autopilot-stack are marked T3 Code only and no longer use the `orch` and `watch-pr` scripts: PR status comes from `gh`, and the orchestration store is plain TSV and markdown files with the coordinator as their only writer. The `check-plan.mjs` script became a checklist in the multi-phase plan playbook, and `worktree-audit.sh` became commands in Worktree cleanup.
- The Perf issue, Hillclimb, Runtime forensics, Trace forensics, and Visual parity playbooks, and the iOS simulator cleanup, are left out.
- Bugbot triage became review-bot triage, with an escalate bucket that reports instead of asking, and FiveM risk areas.

The original is distributed under the MIT License:

```
MIT License

Copyright (c) 2026 Lauren Tan
Copyright (c) 2026 Cursor (skills/deslop, from cursor-team-kit)
Copyright (c) 2026 Marius Florescu (T3 Code adaptation)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
