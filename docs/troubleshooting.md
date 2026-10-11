# Troubleshooting

| Symptom | Fix |
| --- | --- |
| `npm run mcp:check` hangs or times out | First run downloads `@playwright/mcp`; run `npx @playwright/mcp@latest --help` once, then retry. Check proxy settings for npm. |
| Client shows the server as failed | Clients often use a different PATH. Use the absolute path to `npx` in the config, or start the client from a terminal. On Windows use `"command": "cmd", "args": ["/c", "npx", ...]`. |
| `Executable doesn't exist at ...` | `npx playwright install` (add `--with-deps` on Linux). For the `playwright` MCP server you can also add `"--browser", "chrome"` to use your installed Chrome. |
| Agents not listed in Claude Code | Run `claude` from the repo root; check `/agents`. Agent files must be in `.claude/agents/`. |
| Chat modes missing in VS Code | Needs a recent VS Code with Copilot agent mode; files must be in `.github/chatmodes/`. |
| Generated test passes once, fails sometimes | It acts before navigation finished. Assert the new page (URL or unique element) after each navigating click. Verify with `--repeat-each=5`. |
| `strict mode violation: ... resolved to N elements` | The locator matches several elements: scope it (`.filter({ hasText })`, a parent locator) or wait for the right page first. |
| SauceDemo blocked on your network | Run the app locally: `git clone https://github.com/saucelabs/sample-app-web && cd sample-app-web && npm ci && npx vite build && npx vite preview --port 3000`, then `BASE_URL=http://localhost:3000 npm test`. |
| Firefox/WebKit fail on Linux | Install system deps: `npx playwright install --with-deps`. |
