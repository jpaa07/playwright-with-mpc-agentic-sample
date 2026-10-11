# Prompt: explore the app with Playwright MCP

Use with the **`playwright`** MCP server (`@playwright/mcp`). No test files are written;
this is how you get a feel for an app and for what the agent "sees".

```text
Using the playwright MCP tools, open https://www.saucedemo.com and log in as
standard_user / secret_sauce. Walk through the main user journeys (browse products,
sort, add to cart, checkout). For each page, list the interactive elements you find
and the data-test attribute of each one. Do not write any files.
Finish with a short list of risky areas you think deserve tests.
```

Tips
- Ask for `browser_snapshot` (accessibility tree) instead of screenshots; it is cheaper and gives the agent exact element refs.
- Add "keep the browser open" if you want to keep driving it with follow-up prompts.
