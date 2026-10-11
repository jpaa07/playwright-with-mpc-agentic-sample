# AGENTS.md (same rules as CLAUDE.md, for Copilot, Cursor, Codex and other agents)

This repo is a sample of AI-agent driven UI testing with Playwright MCP.
The app under test is the public demo store https://www.saucedemo.com.

## Commands
- `npm test`: all browsers. `npm run test:chromium` for a fast run.
- `npx playwright test <path> --project=chromium`: run a single file.
- `npm run typecheck`: TypeScript check, run after editing tests.

## Conventions for tests you write
- Import `test` and `expect` from `src/fixtures/test`, never directly from `@playwright/test`.
- Start logged-in tests from the `loggedInPage` fixture; do not repeat the login steps.
- Locate elements with `page.getByTestId(...)` (it reads `data-test`) or `getByRole`. No CSS/XPath.
- After a click that navigates, assert the new page (URL or a unique element) before the next action.
- Shared selectors belong in page objects under `src/pages/`; test data in `src/data/`.
- AI-generated tests go to `tests/agent-generated/` with `// spec:` and `// seed:` header comments.
- Test plans go to `specs/*.plan.md`.
- Never weaken or delete an assertion to make a test pass. Use `test.fixme()` with a reason if the app is broken.

## MCP servers (see .mcp.json)
- `playwright`: general browser automation (`@playwright/mcp`). Use it for exploration.
- `playwright-test`: Playwright Test Agents server; backs the planner, generator and healer agents in `.claude/agents/`.

Test credentials are public: `standard_user` / `secret_sauce` (see `src/data/users.ts`).
