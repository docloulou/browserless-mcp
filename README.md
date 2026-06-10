# Browserless MCP Server

A Model Context Protocol (MCP) server for [Browserless](https://browserless.io/) browser automation. This server provides an interface to Browserless's browser automation capabilities through MCP tools.

> **Compatibility:** This server targets the **Browserless v2** REST API (the `/chromium/*` endpoints and their `/content`, `/pdf`, ... backwards-compatible aliases). It has been verified end-to-end against a live instance using [fill.dev](https://fill.dev/).

## Features

- **PDF Generation**: Convert web pages or HTML content to PDF with custom styling
- **Screenshots**: Capture full-page or element-specific screenshots (returned inline + saved to disk)
- **Content Extraction**: Get rendered HTML content after JavaScript execution
- **Custom Functions**: Execute Puppeteer code in browser context (e.g. fill forms, scrape data)
- **Scraping**: Extract text/html/attributes from a list of CSS selectors
- **File Downloads**: Return files Chromium downloaded during a function run
- **Performance Audits**: Run Lighthouse performance audits
- **WebSocket Connections**: Build endpoints for Puppeteer/Playwright
- **Health Monitoring**: Check instance liveness, version and metrics
- **Session Management**: Monitor active browser sessions

> **Note:** `/export`, `/unblock` and BrowserQL (`/chromium/bql`) are not part of the standard Browserless v2 chromium build and are therefore not exposed by this server.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Lizzard-Solutions/browserless-mcp.git
cd browserless-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Copy the example environment file:
```bash
cp env.example .env
```

5. Edit `.env` with your Browserless configuration:
```bash
# Either a full base URL (recommended):
BROWSERLESS_URL=http://localhost:3000
# ...or host/port/protocol:
BROWSERLESS_HOST=localhost
BROWSERLESS_PORT=3000
BROWSERLESS_PROTOCOL=http

BROWSERLESS_TOKEN=your-secure-token-here
BROWSERLESS_TIMEOUT=120000
BROWSERLESS_CONCURRENT=5
# Optional: where generated files are written (default: <tmpdir>/browserless-mcp)
# BROWSERLESS_OUTPUT_DIR=/path/to/output
```

When these variables are set, the server auto-initializes on startup, so calling `initialize_browserless` is optional.

## Run directly with `bunx` / `npx`

The package ships an executable (`browserless-mcp`). You can run it straight from
the Git repository without cloning — ideal for dropping into an image or an MCP
client config:

```bash
# from a Git URL
bunx github:<user>/<repo>
# or with npx
npx github:<user>/<repo>
```

The server reads its configuration from environment variables
(`BROWSERLESS_URL`, `BROWSERLESS_TOKEN`, ...).

### MCP client configuration (`mcp.json`)

```json
{
  "mcpServers": {
    "browserless": {
      "command": "bunx",
      "args": ["github:<user>/<repo>"],
      "env": {
        "BROWSERLESS_URL": "https://my-browserless.example.com",
        "BROWSERLESS_TOKEN": "your-token"
      }
    }
  }
}
```

> The repo is built automatically on install (the `prepare` script runs `tsc`).
> For a pinned, build-free install you can also publish to npm and use
> `"args": ["browserless-mcp"]`.

## Usage

### Starting the MCP Server

```bash
npm start
```

Or for development:
```bash
npm run dev
```

### Using with MCP Clients

The server provides the following tools:

#### 1. Initialize Browserless Connection
```json
{
  "name": "initialize_browserless",
  "arguments": {
    "url": "https://my-browserless.example.com",
    "token": "your-token",
    "timeout": 120000
  }
}
```

Alternatively, provide `host`/`port`/`protocol` instead of `url`.

#### 2. Generate PDF
```json
{
  "name": "generate_pdf",
  "arguments": {
    "url": "https://example.com",
    "options": {
      "format": "A4",
      "printBackground": true,
      "displayHeaderFooter": true,
      "margin": {
        "top": "20mm",
        "bottom": "10mm",
        "left": "10mm",
        "right": "10mm"
      }
    }
  }
}
```

#### 3. Take Screenshot
```json
{
  "name": "take_screenshot",
  "arguments": {
    "url": "https://example.com",
    "options": {
      "type": "png",
      "fullPage": true,
      "quality": 90
    }
  }
}
```

#### 4. Extract Content
```json
{
  "name": "get_content",
  "arguments": {
    "url": "https://example.com",
    "waitForSelector": {
      "selector": "#content-loaded",
      "timeout": 5000
    }
  }
}
```

#### 5. Execute Custom Function
```json
{
  "name": "execute_function",
  "arguments": {
    "code": "export default async function ({ page }) { await page.goto('https://example.com'); const title = await page.title(); return { data: { title }, type: 'application/json' }; }",
    "context": {
      "customData": "value"
    }
  }
}
```

#### 6. Run Performance Audit
```json
{
  "name": "run_performance_audit",
  "arguments": {
    "url": "https://example.com",
    "config": {
      "extends": "lighthouse:default",
      "settings": {
        "onlyCategories": ["performance", "accessibility"]
      }
    }
  }
}
```

#### 7. Scrape Selectors
```json
{
  "name": "scrape",
  "arguments": {
    "url": "https://fill.dev/form/login-simple",
    "elements": [
      { "selector": "input" },
      { "selector": "button" }
    ],
    "gotoOptions": { "waitUntil": "domcontentloaded" }
  }
}
```

#### 8. Create WebSocket Connection
```json
{
  "name": "create_websocket_connection",
  "arguments": {
    "browser": "chromium",
    "library": "puppeteer"
  }
}
```

#### 9. Health and Monitoring
```json
{
  "name": "get_health",
  "arguments": {}
}
```

```json
{
  "name": "get_sessions",
  "arguments": {}
}
```

```json
{
  "name": "get_metrics",
  "arguments": {}
}
```

## Browserless Setup

### Docker Setup

```bash
# Basic setup
docker run -p 3000:3000 ghcr.io/browserless/chromium

# With configuration
docker run \
  --rm \
  -p 3000:3000 \
  -e "CONCURRENT=10" \
  -e "TOKEN=your-secure-token" \
  ghcr.io/browserless/chromium
```

### Docker Compose

```yaml
version: '3.8'

services:
  browserless:
    image: ghcr.io/browserless/chromium:latest
    container_name: browserless
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - TOKEN=your-secure-token-here
      - CONCURRENT=10
      - TIMEOUT=120000
      - HEALTH=true
      - CORS=true
    volumes:
      - ./data:/app/data
      - ./downloads:/app/downloads
```

## Advanced Examples

### Complex Web Scraping
```json
{
  "name": "execute_function",
  "arguments": {
    "code": "export default async function ({ page }) { await page.goto('https://example.com'); await page.waitForSelector('.item'); const items = await page.evaluate(() => Array.from(document.querySelectorAll('.item')).map(el => ({ text: el.textContent, href: el.href }))); return { data: { items }, type: 'application/json' }; }"
  }
}
```

### Multi-step Form Automation
```json
{
  "name": "execute_function",
  "arguments": {
    "code": "export default async function ({ page }) { await page.goto('https://example.com/form'); await page.type('#username', 'user@example.com'); await page.type('#password', 'password123'); await page.click('#submit'); await page.waitForNavigation(); const result = await page.evaluate(() => document.querySelector('.success-message').textContent); return { data: { result }, type: 'application/json' }; }"
  }
}
```

### PDF Report Generation
```json
{
  "name": "generate_pdf",
  "arguments": {
    "html": "<!DOCTYPE html><html><head><style>body{font-family:Arial;margin:20px;} .header{background:#333;color:white;padding:20px;} .content{margin:20px 0;}</style></head><body><div class='header'><h1>Monthly Report</h1></div><div class='content'><h2>Summary</h2><p>This is a generated report with custom styling.</p></div></body></html>",
    "options": {
      "format": "A4",
      "printBackground": true,
      "displayHeaderFooter": true,
      "headerTemplate": "<div style='font-size:12px;'>Confidential Report</div>",
      "footerTemplate": "<div style='font-size:10px;'>Page <span class='pageNumber'></span></div>"
    }
  }
}
```

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BROWSERLESS_URL` | — | Full base URL (overrides host/port/protocol) |
| `BROWSERLESS_HOST` | `localhost` | Browserless host |
| `BROWSERLESS_PORT` | `3000` | Browserless port |
| `BROWSERLESS_PROTOCOL` | `http` | Protocol (http/https/ws/wss) |
| `BROWSERLESS_TOKEN` | Required | Authentication token |
| `BROWSERLESS_TIMEOUT` | `120000` | Request timeout in ms |
| `BROWSERLESS_CONCURRENT` | `5` | Max concurrent sessions |
| `BROWSERLESS_OUTPUT_DIR` | `<tmpdir>/browserless-mcp` | Where generated files are written |

### Browserless Configuration

For complete Browserless configuration options, see the [Browserless API Reference](ref/browserless_api_reference.md).

## Error Handling

The MCP server provides detailed error messages for common issues:

- **Connection Errors**: Check host, port, and token configuration
- **Timeout Errors**: Increase timeout values for slow-loading pages
- **Authentication Errors**: Verify token is correct and has proper permissions
- **Resource Errors**: Check concurrent session limits and memory usage

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure Browserless is running
   - Check host and port configuration
   - Verify firewall settings

2. **Authentication Failed**
   - Verify token is correct
   - Check token permissions
   - Ensure token is not expired

3. **Timeout Errors**
   - Increase timeout values
   - Check network connectivity
   - Monitor Browserless resource usage

4. **Memory Issues**
   - Reduce concurrent session limit
   - Monitor system memory usage
   - Restart Browserless instance

### Debug Mode

Enable debug logging:

```bash
DEBUG=browserless:* npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:

1. Check the [Browserless API Reference](ref/browserless_api_reference.md)
2. Review the [Browserless Documentation](https://docs.browserless.io/)
3. Open an issue on GitHub

## Related Projects

- [Browserless.io](https://browserless.io/) - Browser automation platform
- [Puppeteer](https://pptr.dev/) - Node.js library for browser automation
- [Playwright](https://playwright.dev/) - Cross-browser automation library
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for AI model interactions

## Repository

- **GitHub**: https://github.com/Lizzard-Solutions/browserless-mcp
- **Issues**: https://github.com/Lizzard-Solutions/browserless-mcp/issues
- **Discussions**: https://github.com/Lizzard-Solutions/browserless-mcp/discussions 