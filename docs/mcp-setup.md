# MCP setup in detail

## The two servers

### `playwright` (`@playwright/mcp`)
General-purpose browser automation for agents. Each tool call is one browser action, and
every action returns a fresh **accessibility snapshot** of the page, for example:

```yaml
- textbox "Username" [ref=e9]
- textbox "Password" [ref=e10]
- button "Login" [ref=e11]
```

The agent then calls `browser_click` with `ref=e11`. No vision model and no coordinates are needed.

Common flags (append to `args` in `.mcp.json`):

| Flag | Effect |
| --- | --- |
| `--headless` | No visible window (default is headed) |
| `--browser chrome\|firefox\|webkit\|msedge` | Pick the browser |
| `--isolated` | Fresh profile per session, nothing saved to disk |
| `--storage-state auth.json` | Start already logged in |
| `--viewport-size 1280,720` | Fixed viewport |
| `--save-trace` | Save a Playwright trace of the session |
| `--caps vision,pdf` | Enable extra capabilities (coordinate clicks, PDF) |
| `--port 8931` | Run as an HTTP/SSE server instead of stdio |

### `playwright-test` (`npx playwright run-test-mcp-server`)
Shipped inside `@playwright/test` (1.56+). In addition to the browser tools it knows your
`playwright.config.ts` and adds test-aware tools:

| Tool | Used by |
| --- | --- |
| `planner_setup_page` | planner: runs the seed test, then hands over the page |
| `generator_setup_page`, `generator_read_log`, `generator_write_test` | generator |
| `test_list`, `test_run`, `test_debug` | healer (and you) |
| `browser_generate_locator`, `browser_verify_*` | generator: robust locators and assertions |

## Regenerating the agent definitions

The files in `.claude/agents/` and `.github/chatmodes/` were produced by:

```bash
npx playwright init-agents --loop=claude    # Claude Code
npx playwright init-agents --loop=vscode    # VS Code Copilot
npx playwright init-agents --loop=opencode  # opencode
```

Re-run them after upgrading `@playwright/test` to pick up new tool lists.
**Careful:** the command also overwrites `tests/seed.spec.ts` and `.mcp.json` / `.vscode/mcp.json`.
Run `git diff` afterwards and restore this repo's seed test and the extra `playwright` server entry.

## Running the server over HTTP

For clients that cannot spawn processes, or to share one browser across tools:

```bash
npx @playwright/mcp@latest --port 8931
```

```json
{ "mcpServers": { "playwright": { "url": "http://localhost:8931/mcp" } } }
```

## Verifying without an AI client

`npm run mcp:check` speaks raw MCP (JSON-RPC over stdio) to each server: `initialize`,
`tools/list`, and `tools/call test_list`. If it passes, any MCP client configured with the same
command will work.
