# Playwright MCP Agentic Testing – Sample Framework

A ready-to-run TypeScript framework that shows how to let AI agents explore a web app, write
test plans, generate Playwright tests and fix broken ones through the **Model Context Protocol (MCP)**.

The app under test is the public demo store **[SauceDemo](https://www.saucedemo.com)**.

| What you get | Where |
| --- | --- |
| 25 runnable Playwright tests (login, inventory, cart, checkout, agent-generated) | `tests/` |
| Page Object Model + custom fixtures | `src/pages/`, `src/fixtures/` |
| MCP servers pre-configured for Claude Code, VS Code and other clients | `.mcp.json`, `.vscode/mcp.json` |
| Playwright Test Agents: planner, generator, healer | `.claude/agents/`, `.github/chatmodes/` |
| Copy-paste prompts for each agentic step | `prompts/` |
| Example AI test plan and the tests generated from it | `specs/`, `tests/agent-generated/` |
| Rules every agent follows when it writes tests | `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md` |
| CI on GitHub Actions (3 browsers, HTML reports) | `.github/workflows/playwright.yml` |
| A script that checks the MCP servers work | `scripts/mcp-check.mjs` |

---

## 1. Quick start

Requirements: **Node.js 18+** (20 or 22 recommended) and git.

```bash
git clone <your-repo-url> playwright-mcp-agentic-testing
cd playwright-mcp-agentic-testing
npm install
npx playwright install --with-deps   # downloads Chromium, Firefox, WebKit

npm run test:smoke      # 3 @smoke tests, Chromium only, ~10 s
npm test                # full suite on all 3 browsers
npm run report          # open the HTML report
```

Other useful scripts:

| Script | What it does |
| --- | --- |
| `npm run test:chromium` | Full suite, Chromium only |
| `npm run test:headed` | Watch the browser while tests run |
| `npm run test:ui` | Playwright UI mode (time-travel debugging) |
| `npm run test:generated` | Only the AI-generated tests |
| `npm run typecheck` | TypeScript check |
| `npm run mcp:check` | Start both MCP servers and list their tools |

Environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://www.saucedemo.com` | Point the suite at another environment |
| `SAUCE_PASSWORD` | `secret_sauce` | Password for the demo users |
| `CI` | unset | Enables retries, `forbidOnly`, 2 workers |

---

## 2. What is "agentic testing with Playwright MCP"?

**MCP** is an open protocol that lets an AI assistant call tools. The **Playwright MCP server**
exposes a real browser as tools: `browser_navigate`, `browser_click`, `browser_type`,
`browser_snapshot`, and so on. The agent reads the page as an **accessibility snapshot**
(structured text with element refs), not as pixels, so it can act precisely and cheaply.

```
 You ──prompt──▶ AI agent (Claude Code / Copilot / Cursor …)
                    │  MCP (JSON-RPC over stdio)
                    ▼
          Playwright MCP server ──drives──▶ Browser ──▶ SauceDemo
                    │
                    └─▶ writes specs/*.plan.md and tests/**/*.spec.ts
                                   │
                         npx playwright test  (normal, deterministic CI run)
```

The key idea: **the AI is used to author and maintain tests, not to run them.**
What ends up in the repo is plain Playwright code that runs fast and deterministically in CI,
with no AI involved.

This repo configures two MCP servers (`.mcp.json`):

| Server | Package | Use it for |
| --- | --- | --- |
| `playwright` | `@playwright/mcp` | Free-form exploration and ad-hoc browser tasks |
| `playwright-test` | `@playwright/test` (`playwright run-test-mcp-server`) | Backs the **Test Agents**: knows your config, seed test, can run and debug tests |

### The three Playwright Test Agents

| Agent | Input | Output |
| --- | --- | --- |
| 🎭 **planner** | A goal + a seed test | Markdown plan in `specs/` |
| 🎭 **generator** | A plan | Test files, written after replaying each step in a real browser |
| 🎭 **healer** | Failing tests | Patched tests (or `test.fixme()` when the app itself is broken) |

The seed test (`tests/seed.spec.ts`) puts the browser in a known state (logged in as
`standard_user` on the product list) before an agent starts working.

---

## 3. Connect the MCP servers to your AI client

Run `npm run mcp:check` first. It should print something like:

```
✔ playwright: 25 tools (browser_close, browser_resize, …)
✔ playwright-test: 39 tools (planner_setup_page, generator_setup_page, …)
  test_list → 75 tests visible to agents
```

### Claude Code
Nothing to do: `.mcp.json` and `.claude/agents/` are picked up automatically when you run
`claude` in the repo root. Approve the two project MCP servers when asked, then check with `/mcp`
and `/agents`.

To add the browser server to another project by hand:
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

### VS Code (GitHub Copilot, agent mode)
`.vscode/mcp.json` registers both servers. Open the Command Palette, run **MCP: List Servers** and start
them. The planner, generator and healer appear as chat modes (from `.github/chatmodes/`) in the
chat mode picker.

### Cursor, Windsurf, Claude Desktop and other clients
Add this to the client's MCP config (for example `~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```
Useful `@playwright/mcp` flags: `--headless`, `--browser firefox`, `--isolated`,
`--viewport-size 1280,720`, `--save-trace`. Run `npx @playwright/mcp@latest --help` for the full list.

More detail: [docs/mcp-setup.md](docs/mcp-setup.md).

---

## 4. The agentic workflow, step by step

Each step has a ready prompt in `prompts/`.

1. **Explore** ([prompts/00-explore.md](prompts/00-explore.md)). Ask the agent to browse SauceDemo with the `playwright` server and report what it finds.
2. **Plan** ([prompts/01-plan.md](prompts/01-plan.md)). The planner writes `specs/<feature>.plan.md`. Review and edit it like any other document.
3. **Generate** ([prompts/02-generate.md](prompts/02-generate.md)). The generator turns each scenario into a test in `tests/agent-generated/`.
4. **Run**: `npm run test:generated`.
5. **Heal** ([prompts/03-heal.md](prompts/03-heal.md)). The healer debugs failures in a live browser and patches the tests.
6. **Promote**. Review the generated test, move repeated selectors into `src/pages/`, and move the file into `tests/<area>/`.

Or run everything at once with [prompts/04-agentic-e2e.md](prompts/04-agentic-e2e.md).

The repo already contains one full round of this loop:
[`specs/product-details.plan.md`](specs/product-details.plan.md) and the tests produced from it,
[`tests/agent-generated/product-details.spec.ts`](tests/agent-generated/product-details.spec.ts),
including a real flake that was healed (described in `prompts/03-heal.md`).

Full walkthrough: [docs/agentic-workflow.md](docs/agentic-workflow.md).

---

## 5. Project structure

```
.
├── .claude/agents/             # Claude Code subagents: planner, generator, healer
├── .github/
│   ├── chatmodes/              # Same agents as VS Code Copilot chat modes
│   ├── copilot-instructions.md # Repo rules for Copilot
│   └── workflows/playwright.yml
├── .vscode/mcp.json            # MCP servers for VS Code
├── .mcp.json                   # MCP servers for Claude Code / generic clients
├── CLAUDE.md / AGENTS.md       # Rules every agent follows when writing tests
├── docs/                       # Guides (setup, workflow, framework, troubleshooting)
├── prompts/                    # Copy-paste prompts for each agentic step
├── scripts/mcp-check.mjs       # Verifies MCP servers start and expose tools
├── specs/                      # Test plans written by the planner agent
├── src/
│   ├── data/                   # Users, products, tax rate
│   ├── fixtures/test.ts        # Extended `test` with page objects + loggedInPage
│   └── pages/                  # Page Object Model
├── tests/
│   ├── seed.spec.ts            # Starting state for the agents
│   ├── auth/  inventory/  cart/  checkout/   # Hand-written suites
│   └── agent-generated/        # AI-generated tests, reviewed before promotion
├── playwright.config.ts
└── tsconfig.json
```

Framework details (fixtures, page objects, writing a new test): [docs/framework-guide.md](docs/framework-guide.md).

---

## 6. Test inventory

| File | Tests | Covers |
| --- | --- | --- |
| `tests/auth/login.spec.ts` | 7 | Valid login, locked-out user, wrong password, required fields, auth redirect, logout |
| `tests/inventory/sorting.spec.ts` | 4 | Default order, A→Z / Z→A, price low↔high |
| `tests/cart/cart.spec.ts` | 4 | Badge count, cart contents, remove item, persistence across reload |
| `tests/checkout/checkout.spec.ts` | 6 | Full purchase, subtotal/tax/total maths, form validation ×3, cancel |
| `tests/agent-generated/product-details.spec.ts` | 3 | Product details page (generated from a plan) |
| `tests/seed.spec.ts` | 1 | Seed for the agents |

25 tests × 3 browsers = 75 test runs. Tests tagged `@smoke` run with `npm run test:smoke`.

---

## 7. Good practices for agentic testing

- **Give the agent rules.** `CLAUDE.md` / `AGENTS.md` tell it which fixtures, locators and folders to use. Output quality depends heavily on this.
- **Use a seed test** so every agent session starts from the same state.
- **Keep generated tests in quarantine** (`tests/agent-generated/`) until a human has reviewed them.
- **Run new tests with `--repeat-each=5`** before trusting them; agents often miss waits after navigation.
- **Never let the healer weaken assertions.** A failing assertion may be a real bug; `test.fixme()` with a reason is the honest outcome.
- **Prefer snapshots over screenshots** in prompts. The accessibility tree is cheaper and more precise.
- **AI authors, CI executes.** CI runs plain Playwright; no model calls, no tokens, no nondeterminism.

---

## 8. Troubleshooting

See [docs/troubleshooting.md](docs/troubleshooting.md). The most common issues:

- **The MCP server doesn't appear in the client.** Run `npm run mcp:check`, restart the client, and make sure `npx` is on the PATH the client uses.
- **"Executable doesn't exist" / browser not found.** Run `npx playwright install`. If the `playwright` MCP server still cannot find a browser, add `"--browser", "chrome"` to its args to use your installed Chrome.
- **SauceDemo is unreachable from a corporate network.** Build the app locally (see the troubleshooting guide) and run with `BASE_URL=http://localhost:3000`.

## License

MIT. SauceDemo is a demo application provided by Sauce Labs.
