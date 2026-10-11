# Prompt: generate tests from a plan (generator agent)

Use with the **`playwright-test-generator`** agent (Claude Code) or the **generator** chat mode (VS Code).
The agent replays every step in a real browser, then writes the test from what actually worked.

```text
Use the playwright-test-generator agent.
Generate tests for every scenario in specs/burger-menu.plan.md.
Write them to tests/agent-generated/, one file per scenario.
Import test and expect from '../../src/fixtures/test' and use the loggedInPage fixture
instead of logging in by hand.
After writing, run them with `npx playwright test tests/agent-generated --project=chromium`
and report the result.
```

Review checklist before promoting a generated test into `tests/<area>/`
- [ ] Assertions check the outcome the plan describes, not just that a click happened.
- [ ] It waits for navigation or a visible element before acting on a new page.
- [ ] Repeated selectors moved into a page object in `src/pages/`.
- [ ] Passes with `--repeat-each=5` (no flakes).
