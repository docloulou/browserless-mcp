// Drives the compiled MCP server over stdio (JSON-RPC) to validate the protocol
// layer end-to-end: auto-init from env, tools/list, and a few tools/call.
import { spawn } from 'child_process';

const env = {
  ...process.env,
  BROWSERLESS_URL: process.env.BROWSERLESS_URL || 'http://xxx.io',
  BROWSERLESS_TOKEN: process.env.BROWSERLESS_TOKEN || 'xxx',
};

const child = spawn('node', ['dist/index.js'], { env, stdio: ['pipe', 'pipe', 'inherit'] });

let buf = '';
const pending = new Map();
child.stdout.on('data', (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});

let id = 0;
function rpc(method, params) {
  const reqId = ++id;
  return new Promise((resolve) => {
    pending.set(reqId, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: reqId, method, params }) + '\n');
  });
}
function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
}

const summarize = (res) => {
  const c = res.result?.content || [];
  return c.map((x) => (x.type === 'text' ? `text(${x.text.length})` : `${x.type}(${(x.data || '').length})`)).join(', ') + (res.result?.isError ? ' [isError]' : '');
};

async function main() {
  const init = await rpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'stdio-test', version: '1.0.0' },
  });
  console.log('initialize ->', init.result?.serverInfo?.name, init.result?.serverInfo?.version);
  notify('notifications/initialized', {});

  const tools = await rpc('tools/list', {});
  console.log('tools/list ->', tools.result.tools.map((t) => t.name).join(', '));

  const health = await rpc('tools/call', { name: 'get_health', arguments: {} });
  console.log('get_health ->', summarize(health));

  const content = await rpc('tools/call', {
    name: 'get_content',
    arguments: { url: 'https://fill.dev/', gotoOptions: { waitUntil: 'domcontentloaded' } },
  });
  console.log('get_content ->', summarize(content));

  const shot = await rpc('tools/call', {
    name: 'take_screenshot',
    arguments: { url: 'https://fill.dev/form/login-simple', options: { type: 'png' }, gotoOptions: { waitUntil: 'domcontentloaded' } },
  });
  console.log('take_screenshot ->', summarize(shot));
  const hasImage = (shot.result?.content || []).some((x) => x.type === 'image');
  console.log('screenshot returns image content:', hasImage);

  child.kill();
  process.exit(hasImage ? 0 : 1);
}

main().catch((e) => { console.error(e); child.kill(); process.exit(1); });
