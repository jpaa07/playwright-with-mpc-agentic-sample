# Agentic workflow walkthrough

This walks through one complete loop on a new feature: the SauceDemo **burger menu**.
Commands assume Claude Code; in VS Code pick the matching chat mode instead.

## 0. Prepare
```bash
npm install && npx playwright install chromium
npm run mcp:check
claude            # in the repo root; approve the project MCP servers
```

## 1. Explore (optional)
Paste [`prompts/00-explore.md`](../prompts/00-explore.md). The agent opens a browser, logs in
and describes the pages. Nothing is written. Use this to decide what to plan.

## 2. Plan
Paste [`prompts/01-plan.md`](../prompts/01-plan.md). The planner:
1. calls `planner_setup_page`, which runs `tests/seed.spec.ts` (logged-in state),
2. explores with snapshots and clicks,
3. writes `specs/burger-menu.plan.md`.

**Review the plan.** It is the cheapest place to fix misunderstandings: delete scenarios
that don't matter, add the edge cases you care about, fix expected results.

## 3. Generate
Paste [`prompts/02-generate.md`](../prompts/02-generate.md). For each scenario the generator
executes every step in the browser, reads the log of what worked
(`generator_read_log`), and writes a test (`generator_write_test`). Because the code comes from
actions that really succeeded, locators are usually right the first time.

## 4. Run and harden
```bash
npx playwright test tests/agent-generated --project=chromium --repeat-each=5
```
`--repeat-each` catches timing flakes that a single run hides.

## 5. Heal
Paste [`prompts/03-heal.md`](../prompts/03-heal.md). The healer runs the tests, pauses on the first
failure with `test_debug`, inspects the live page, edits the test and reruns until green.

## 6. Promote
Generated tests are a first draft. Before moving them out of `tests/agent-generated/`:
- replace raw selectors with page-object methods (`src/pages/`),
- make assertions check business outcomes,
- give the test a clear name and, if it is critical, the `@smoke` tag.

## Where AI helps most, and where it doesn't

| Good fit | Poor fit |
| --- | --- |
| Bootstrapping coverage for an untested app | Deciding what is *correct* behaviour |
| Turning manual test cases into code | Visual or pixel-perfect checks |
| Fixing broken locators after a UI refactor | Running in CI (use plain Playwright) |
| Exploring an unfamiliar flow quickly | Tests needing secrets the agent shouldn't see |
