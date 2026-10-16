---
"overextended-skills": minor
---

Add **`setup-ox`** (user-invoked), run once before the other ox skills:

- **Models and budget**: pick `unlimited`, `large`, `medium` or `small`, and it maps each subagent role (`explore`, `verify api`, `implement`, `review`, `hardest tasks`) to a model and reasoning level your harness offers, written to `~/.config/ox/models.md`.
- **Project**: it detects the server root, every ox resource and its version, the framework and the language your resources use, confirms them with you, and writes `.ox/config.md`.
