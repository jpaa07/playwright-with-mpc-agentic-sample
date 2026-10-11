# Prompt: one-shot agentic loop (plan → generate → run → heal)

Useful for demos. Works in Claude Code with the agents in `.claude/agents/`.

```text
Goal: add regression coverage for sorting on the SauceDemo product list.
1. Use playwright-test-planner to write specs/sorting.plan.md (seed tests/seed.spec.ts).
2. Use playwright-test-generator to turn every scenario into tests/agent-generated/.
3. Run `npx playwright test tests/agent-generated --project=chromium`.
4. If anything fails, use playwright-test-healer to fix it, then run again.
Stop when everything passes and summarise what was created.
```
