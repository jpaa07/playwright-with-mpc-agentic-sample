# Prompt: fix failing tests (healer agent)

Use with the **`playwright-test-healer`** agent (Claude Code) or the **healer** chat mode (VS Code).
The healer runs the tests, pauses on the failure, inspects the live page through MCP and patches the test.

```text
Use the playwright-test-healer agent.
Run tests/agent-generated and fix any failing test. Do not change assertions that
check product behaviour; if the app itself looks broken, mark the test with
test.fixme() and explain why in a comment.
```

Try it yourself: break a locator on purpose, for example change
`'shopping-cart-badge'` to `'cart-badge'` in `src/pages/HeaderComponent.ts`, run the prompt
and watch the agent find and fix it.

A real example from building this repo: the first version of
`tests/agent-generated/product-details.spec.ts` clicked a product and then immediately
clicked "Add to cart". About one run in five, the click landed while the inventory page
(six "Add to cart" buttons) was still rendered and failed with a strict-mode violation.
The fix, which is exactly what the healer is good at, was to wait for the details page
(`Back to products` visible) before the next step.
