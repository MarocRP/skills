# Credits

Adapted from the `why` skill in [pstack-t3](https://github.com/mariusflorescu/pstack-t3/tree/main/skills/why), itself adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan. Subagents take their models from `~/.config/ox/models.md` (written by `setup-ox`) instead of T3 Code's `delegate_task` and `~/.config/pstack/`, and other skills and principles are reached through the Skill tool instead of file paths. The steps, epistemics, and investigator and synthesizer prompts are unchanged apart from wording. New here: the seven vendor playbooks (Linear, Notion, Slack, Datadog, Sentry, Databricks) are folded into one `SOURCES.md` with a section per evidence category, GitHub Issues through `gh` covers the issue tracker, and resources the server runs but doesn't own are traced through their upstream repository at the version the server runs.

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
