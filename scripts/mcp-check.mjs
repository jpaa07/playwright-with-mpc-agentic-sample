#!/usr/bin/env node
/**
 * Sanity check for the MCP servers in .mcp.json.
 *
 * Starts each server over stdio, performs the MCP handshake, lists its tools
 * and (for playwright-test) asks it to list the project's tests. This is the
 * same conversation an AI agent has with the server, minus the AI.
 *
 *   npm run mcp:check
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../.mcp.json', import.meta.url), 'utf8'));

function connect(name, { command, args }) {
  const child = spawn(command, [...args, ...(name === 'playwright' ? ['--headless'] : [])], {
    stdio: ['pipe', 'pipe', 'ignore'],
    shell: process.platform === 'win32',
  });
  const pending = new Map();
  let buffer = '';
  let nextId = 1;
  child.stdout.on('data', (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      const msg = JSON.parse(line);
      pending.get(msg.id)?.(msg);
      pending.delete(msg.id);
    }
  });
  const send = (msg) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
  const request = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      const timer = setTimeout(() => reject(new Error(`${name}: ${method} timed out`)), 60_000);
      pending.set(id, (msg) => {
        clearTimeout(timer);
        msg.error ? reject(new Error(`${name}: ${msg.error.message}`)) : resolve(msg.result);
      });
      send({ id, method, params });
    });
  return { request, notify: (method) => send({ method }), close: () => child.kill() };
}

let failed = false;
for (const [name, server] of Object.entries(config.mcpServers)) {
  const client = connect(name, server);
  try {
    await client.request('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'mcp-check', version: '1.0.0' },
    });
    client.notify('notifications/initialized');
    const { tools } = await client.request('tools/list');
    console.log(`✔ ${name}: ${tools.length} tools (${tools.slice(0, 6).map((t) => t.name).join(', ')}, …)`);

    if (tools.some((t) => t.name === 'test_list')) {
      const result = await client.request('tools/call', { name: 'test_list', arguments: {} });
      const text = result.content?.map((c) => c.text).join('\n') ?? '';
      console.log(`  test_list → ${text.split('\n').filter((l) => l.includes('spec.ts')).length} tests visible to agents`);
    }
  } catch (error) {
    failed = true;
    console.error(`✘ ${name}: ${error.message}`);
  } finally {
    client.close();
  }
}
process.exit(failed ? 1 : 0);
