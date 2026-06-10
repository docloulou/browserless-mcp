// Real-condition test of the Browserless MCP client against a live instance,
// exercising every feature on https://fill.dev/.
//
// Usage:
//   BROWSERLESS_URL=... BROWSERLESS_TOKEN=... node test-fill-dev.mjs
//
// Defaults target the instance provided for this task.
import { BrowserlessClient } from './dist/client.js';

const url = process.env.BROWSERLESS_URL || 'http://xxx.io';
const token = process.env.BROWSERLESS_TOKEN || 'xxx';

const client = new BrowserlessClient({
  url,
  token,
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  timeout: 120000,
  concurrent: 5,
});

const FILL = 'https://fill.dev';
const goto = { waitUntil: 'domcontentloaded' };
const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` -> ${detail}` : ''}`);
}

async function main() {
  console.log(`Target: ${client.getBaseUrl()}\n`);

  // 1. Health + meta
  try {
    const r = await client.getHealth();
    record('get_health', r.data?.status === 'healthy', `status=${r.data?.status} version=${r.data?.meta?.version} chromium=${r.data?.meta?.chromium}`);
  } catch (e) { record('get_health', false, e.message); }

  // 2. Content
  try {
    const r = await client.getContent({ url: `${FILL}/`, gotoOptions: goto });
    record('get_content', r.success && /Test Autofill/i.test(r.data?.html || ''), `title="${r.data?.title}" htmlLen=${r.data?.html?.length}`);
  } catch (e) { record('get_content', false, e.message); }

  // 3. Scrape
  try {
    const r = await client.scrape({ url: `${FILL}/form/login-simple`, elements: [{ selector: 'input' }], gotoOptions: goto });
    const count = r.data?.data?.data?.[0]?.results?.length ?? 0;
    record('scrape', r.success && count >= 2, `inputs found=${count}`);
  } catch (e) { record('scrape', false, e.message); }

  // 4. execute_function - real autofill of the login form
  try {
    const code = `export default async function ({ page }) {
      await page.goto('${FILL}/form/login-simple', { waitUntil: 'domcontentloaded' });
      await page.type('#username', 'john.doe@example.com');
      await page.type('#password', 'S3cr3tP@ss');
      const values = await page.evaluate(() => ({
        username: document.querySelector('#username')?.value,
        password: document.querySelector('#password')?.value,
        title: document.title,
      }));
      return { data: values, type: 'application/json' };
    }`;
    const r = await client.executeFunction({ code, context: {} });
    let parsed = null;
    try { parsed = JSON.parse(r.data?.data || '{}'); } catch { /* not json */ }
    const filled = parsed?.data?.username === 'john.doe@example.com' && parsed?.data?.password === 'S3cr3tP@ss';
    record('execute_function (autofill)', r.success && filled, `ct=${r.data?.contentType} body=${(r.data?.data || '').slice(0, 160)}`);
  } catch (e) { record('execute_function (autofill)', false, e.message); }

  // 5. Screenshot
  try {
    const r = await client.takeScreenshot({ url: `${FILL}/form/login-simple`, options: { type: 'png', fullPage: true }, gotoOptions: goto });
    record('take_screenshot', r.success && (r.data?.image?.length || 0) > 1000, `bytes=${r.data?.image?.length} format=${r.data?.format}`);
  } catch (e) { record('take_screenshot', false, e.message); }

  // 6. PDF
  try {
    const r = await client.generatePdf({ url: `${FILL}/`, options: { format: 'A4', printBackground: true }, gotoOptions: goto });
    record('generate_pdf', r.success && (r.data?.pdf?.length || 0) > 1000, `bytes=${r.data?.pdf?.length}`);
  } catch (e) { record('generate_pdf', false, e.message); }

  // 7. Performance (Lighthouse) - may hit the server-side 30s timeout
  try {
    const r = await client.runPerformanceAudit({ url: `${FILL}/` });
    record('run_performance_audit', r.success, r.success ? `keys=${Object.keys(r.data || {}).slice(0, 5).join(',')}` : `${r.statusCode} ${r.error}`);
  } catch (e) { record('run_performance_audit', false, e.message); }

  // 8. Management endpoints
  try {
    const r = await client.getSessions();
    record('get_sessions', r.success, `count=${Array.isArray(r.data) ? r.data.length : 'n/a'}`);
  } catch (e) { record('get_sessions', false, e.message); }
  try {
    const r = await client.getConfig();
    record('get_config', r.success, `concurrent=${r.data?.concurrent} timeout=${r.data?.timeout}`);
  } catch (e) { record('get_config', false, e.message); }
  try {
    const r = await client.getMetrics();
    record('get_metrics', r.success, `entries=${Array.isArray(r.data) ? r.data.length : typeof r.data}`);
  } catch (e) { record('get_metrics', false, e.message); }

  // 9. WebSocket endpoint (puppeteer)
  try {
    const r = await client.createWebSocketConnection({ browser: 'chromium', library: 'puppeteer' });
    record('create_websocket_connection', r.success, r.success ? r.data?.browserWSEndpoint?.replace(token, '***') : r.error);
  } catch (e) { record('create_websocket_connection', false, e.message); }

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== ${passed}/${results.length} checks passed ===`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
