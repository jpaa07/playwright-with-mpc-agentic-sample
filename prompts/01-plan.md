# Prompt: create a test plan (planner agent)

Use with the **`playwright-test-planner`** agent (Claude Code) or the **planner** chat mode (VS Code Copilot).
Output is a Markdown plan in `specs/`. See [`specs/product-details.plan.md`](../specs/product-details.plan.md) for an example.

```text
Use the playwright-test-planner agent.
Seed: tests/seed.spec.ts (it logs in as standard_user and lands on the product list).
Explore the burger menu of SauceDemo (All Items, About, Logout, Reset App State).
Write a test plan to specs/burger-menu.plan.md with 3 to 5 scenarios, each with
numbered steps and expected results. Prefer data-test attributes for locators.
```
