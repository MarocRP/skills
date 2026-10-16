# Credits

Adapted from the `show-me-your-work` skill in [pstack-t3](https://github.com/mariusflorescu/pstack-t3/tree/main/skills/show-me-your-work), itself adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan. Subagents take their models from `~/.config/ox/models.md` (written by `setup-ox`) instead of T3 Code's `delegate_task` and `~/.config/pstack/`, and other skills and principles are reached through the Skill tool instead of file paths. The format, `scripts/log.sh` and the audit are unchanged. New here: the transcript audit reads the harness's own session log (Claude Code, Codex, or T3 Code's thread), the trail reviewer runs on the `review` role, and the example rows describe a resource migration.

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
