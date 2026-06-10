# Browserless MCP Test Results

Verified end-to-end against a **live Browserless v2 instance** (API `2.51.2`,
Chromium `148.0.7778.96`) using [https://fill.dev/](https://fill.dev/).

Run the suites yourself:

```bash
npm run build
BROWSERLESS_URL=<your-url> BROWSERLESS_TOKEN=<your-token> node test-fill-dev.mjs     # client/API
BROWSERLESS_URL=<your-url> BROWSERLESS_TOKEN=<your-token> node test-mcp-stdio.mjs    # MCP protocol
```

## API / Client suite (`test-fill-dev.mjs`) — 11/11 ✅

| Feature | Tool | Endpoint | Status |
|---------|------|----------|--------|
| Health + version | `get_health` | `GET /active` + `GET /meta` | ✅ |
| Content extraction | `get_content` | `POST /content` | ✅ |
| Selector scraping | `scrape` | `POST /scrape` | ✅ |
| Function / **form autofill** | `execute_function` | `POST /function` | ✅ |
| Screenshot | `take_screenshot` | `POST /screenshot` | ✅ |
| PDF | `generate_pdf` | `POST /pdf` | ✅ |
| Performance audit | `run_performance_audit` | `POST /performance` | ✅ |
| Sessions | `get_sessions` | `GET /sessions` | ✅ |
| Config | `get_config` | `GET /config` | ✅ |
| Metrics | `get_metrics` | `GET /metrics` | ✅ |
| WebSocket endpoint | `create_websocket_connection` | `ws /chromium` | ✅ |

**Autofill highlight:** `execute_function` filled `#username` and `#password`
on `https://fill.dev/form/login-simple` and read the values back successfully.

## MCP protocol suite (`test-mcp-stdio.mjs`) ✅

- Auto-initialization from `BROWSERLESS_URL` / `BROWSERLESS_TOKEN`.
- `tools/list` returns all 13 tools.
- `get_health`, `get_content`, `take_screenshot` return valid MCP content
  (screenshots use the `image` content type; PDFs/downloads are saved to disk).

## What changed vs. the previous version

- All REST calls migrated to the Browserless v2 endpoints (`/content`, `/pdf`,
  `/screenshot`, `/function`, `/download`, `/scrape`, `/performance`).
- `get_content` now reads the raw `text/html` response (was expecting JSON).
- `execute_function` / `download_files` now send `application/json` `{ code, context }`
  (was sending the object as `application/javascript`, causing 400 errors).
- `get_health` uses `/active` + `/meta` (the old `/health` endpoint returns 404).
- Binary outputs use the valid MCP `image`/`text` content types (was the
  non-existent `binary` type) and are written to `BROWSERLESS_OUTPUT_DIR`.
- Added the `scrape` tool.
- Removed `export_page`, `unblock` and `execute_browserql` (not available on the
  v2 chromium build — they return 404).
- `initialize_browserless` accepts a full `url`, and the server auto-initializes
  from environment variables.
- Upgraded to `@modelcontextprotocol/sdk` **1.29.0** and migrated to the
  high-level `McpServer` / `registerTool` API (automatic zod input validation,
  tool titles and read-only annotations).
- Dropped the unused `puppeteer` / `playwright` dependencies (the server talks to
  Browserless over HTTP/WS) for a fast, lean `bunx` install.
- Shipped a `browserless-mcp` binary (`bin` + shebang + `prepare` build) so it can
  be run via `bunx github:<user>/<repo>`.
