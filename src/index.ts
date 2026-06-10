#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import { BrowserlessClient } from './client.js';
import {
  BrowserlessConfig,
  BrowserlessConfigSchema,
  PdfRequestSchema,
  ScreenshotRequestSchema,
  ContentRequestSchema,
  FunctionRequestSchema,
  DownloadRequestSchema,
  ScrapeRequestSchema,
  PerformanceRequestSchema,
  WebSocketOptionsSchema,
} from './types.js';

dotenv.config();

const OUTPUT_DIR =
  process.env.BROWSERLESS_OUTPUT_DIR || path.join(os.tmpdir(), 'browserless-mcp');

type ToolResult = {
  // Loosely typed to accommodate text/image content variants of CallToolResult.
  content: any[];
  isError?: boolean;
};

class BrowserlessMCPServer {
  private server: McpServer;
  private client: BrowserlessClient | null = null;

  constructor() {
    this.server = new McpServer({
      name: 'browserless-mcp',
      version: '2.0.0',
    });

    this.maybeInitFromEnv();
    this.registerTools();
  }

  /**
   * Auto-initialise the client from environment variables so the server is
   * usable without an explicit `initialize_browserless` call.
   */
  private maybeInitFromEnv() {
    const token = process.env.BROWSERLESS_TOKEN;
    const url = process.env.BROWSERLESS_URL;
    const host = process.env.BROWSERLESS_HOST;

    if (!token || (!url && !host)) {
      return;
    }

    try {
      const config = BrowserlessConfigSchema.parse({
        url: url || undefined,
        host: host || undefined,
        port: process.env.BROWSERLESS_PORT ? Number(process.env.BROWSERLESS_PORT) : undefined,
        token,
        protocol: process.env.BROWSERLESS_PROTOCOL || undefined,
        timeout: process.env.BROWSERLESS_TIMEOUT ? Number(process.env.BROWSERLESS_TIMEOUT) : undefined,
        concurrent: process.env.BROWSERLESS_CONCURRENT ? Number(process.env.BROWSERLESS_CONCURRENT) : undefined,
        retries: process.env.BROWSERLESS_RETRIES ? Number(process.env.BROWSERLESS_RETRIES) : undefined,
      });
      this.client = new BrowserlessClient(config);
    } catch (error) {
      console.error('Failed to auto-initialise Browserless client from env:', error);
    }
  }

  private requireClient(): BrowserlessClient {
    if (!this.client) {
      throw new Error(
        'Browserless client not initialized. Call "initialize_browserless" first, or set BROWSERLESS_URL/BROWSERLESS_TOKEN.'
      );
    }
    return this.client;
  }

  private async saveOutput(filename: string, data: Buffer): Promise<string> {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const filePath = path.join(OUTPUT_DIR, filename);
    await fs.writeFile(filePath, data);
    return filePath;
  }

  private text(text: string) {
    return { type: 'text' as const, text };
  }

  private async run(fn: () => Promise<ToolResult>): Promise<ToolResult> {
    try {
      return await fn();
    } catch (error) {
      return {
        isError: true,
        content: [this.text(`Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)],
      };
    }
  }

  private registerTools() {
    const ro = { readOnlyHint: true } as const;

    this.server.registerTool(
      'initialize_browserless',
      {
        title: 'Initialize Browserless',
        description:
          'Initialize connection to a Browserless instance. Provide either a full "url" (e.g. https://my-browserless.example.com) or host/port/protocol.',
        inputSchema: BrowserlessConfigSchema.shape,
      },
      async (args) =>
        this.run(async () => {
          const config: BrowserlessConfig = BrowserlessConfigSchema.parse(args);
          this.client = new BrowserlessClient(config);
          const health = await this.client.getHealth();
          const meta = health.data?.meta;
          return {
            content: [
              this.text(
                [
                  `Browserless client initialized at ${this.client.getBaseUrl()}`,
                  `Status: ${health.data?.status ?? 'unknown'}`,
                  meta ? `API version: ${meta.version} | Chromium: ${meta.chromium ?? 'n/a'}` : '',
                ]
                  .filter(Boolean)
                  .join('\n')
              ),
            ],
          };
        })
    );

    this.server.registerTool(
      'generate_pdf',
      {
        title: 'Generate PDF',
        description: 'Generate a PDF from a URL or raw HTML content (saved to disk)',
        inputSchema: PdfRequestSchema.shape,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().generatePdf(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to generate PDF');
          const filePath = await this.saveOutput(result.data.filename, result.data.pdf);
          return { content: [this.text(`PDF generated (${result.data.pdf.length} bytes) and saved to: ${filePath}`)] };
        })
    );

    this.server.registerTool(
      'take_screenshot',
      {
        title: 'Take Screenshot',
        description: 'Take a screenshot of a webpage (returned inline as an image and saved to disk)',
        inputSchema: ScreenshotRequestSchema.shape,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().takeScreenshot(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to take screenshot');
          const filePath = await this.saveOutput(result.data.filename, result.data.image);
          return {
            content: [
              this.text(`Screenshot captured (${result.data.image.length} bytes) and saved to: ${filePath}`),
              { type: 'image', mimeType: `image/${result.data.format}`, data: result.data.image.toString('base64') },
            ],
          };
        })
    );

    this.server.registerTool(
      'get_content',
      {
        title: 'Get Content',
        description: 'Extract the rendered HTML content of a webpage after JavaScript execution',
        inputSchema: ContentRequestSchema.shape,
        annotations: ro,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().getContent(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to get content');
          return {
            content: [
              this.text(
                `Content extracted from ${result.data.url ?? 'HTML input'}${
                  result.data.title ? ` (title: ${result.data.title})` : ''
                }`
              ),
              this.text(result.data.html),
            ],
          };
        })
    );

    this.server.registerTool(
      'execute_function',
      {
        title: 'Execute Function',
        description:
          'Run custom puppeteer code in the browser. `code` is an ES module exporting a default async function, e.g. "export default async function ({ page }) { ... return { data, type } }".',
        inputSchema: FunctionRequestSchema.shape,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().executeFunction(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to execute function');
          const { contentType, data, isBinary } = result.data;
          if (isBinary) {
            if (contentType.startsWith('image/')) {
              return {
                content: [this.text(`Function returned an image (${contentType}).`), { type: 'image', mimeType: contentType, data }],
              };
            }
            const filePath = await this.saveOutput(`function-${Date.now()}.bin`, Buffer.from(data, 'base64'));
            return { content: [this.text(`Function returned binary data (${contentType}) saved to: ${filePath}`)] };
          }
          return { content: [this.text(`Function executed (${contentType}).`), this.text(data)] };
        })
    );

    this.server.registerTool(
      'scrape',
      {
        title: 'Scrape Selectors',
        description: 'Scrape text/html/attributes from a list of CSS selectors on a page',
        inputSchema: ScrapeRequestSchema.shape,
        annotations: ro,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().scrape(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to scrape');
          return {
            content: [this.text('Scrape completed successfully.'), this.text(JSON.stringify(result.data.data, null, 2))],
          };
        })
    );

    this.server.registerTool(
      'download_files',
      {
        title: 'Download Files',
        description: 'Run puppeteer code and return any files Chromium downloaded during execution',
        inputSchema: DownloadRequestSchema.shape,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().downloadFiles(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to download files');
          const filePath = await this.saveOutput(result.data.filename, result.data.data);
          return {
            content: [
              this.text(`Downloaded ${result.data.data.length} bytes (${result.data.contentType}) saved to: ${filePath}`),
            ],
          };
        })
    );

    this.server.registerTool(
      'run_performance_audit',
      {
        title: 'Run Performance Audit',
        description: 'Run a Lighthouse performance audit on a URL',
        inputSchema: PerformanceRequestSchema.shape,
        annotations: ro,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().runPerformanceAudit(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to run performance audit');
          return {
            content: [this.text('Performance audit completed successfully.'), this.text(JSON.stringify(result.data, null, 2))],
          };
        })
    );

    this.server.registerTool(
      'create_websocket_connection',
      {
        title: 'Create WebSocket Connection',
        description: 'Build a WebSocket endpoint for connecting Puppeteer/Playwright to the browser',
        inputSchema: WebSocketOptionsSchema.shape,
        annotations: ro,
      },
      async (args) =>
        this.run(async () => {
          const result = await this.requireClient().createWebSocketConnection(args as any);
          if (!result.success || !result.data) throw new Error(result.error || 'Failed to create WebSocket connection');
          return {
            content: [
              this.text(`WebSocket session: ${result.data.sessionId}`),
              this.text(`Browser WebSocket endpoint: ${result.data.browserWSEndpoint}`),
            ],
          };
        })
    );

    this.server.registerTool(
      'get_health',
      { title: 'Get Health', description: 'Get liveness status and version metadata of the Browserless instance', inputSchema: {}, annotations: ro },
      async () =>
        this.run(async () => {
          const result = await this.requireClient().getHealth();
          return {
            content: [this.text(`Health status: ${result.data?.status}`), this.text(JSON.stringify(result.data, null, 2))],
          };
        })
    );

    this.server.registerTool(
      'get_sessions',
      { title: 'Get Sessions', description: 'Get the list of active browser sessions', inputSchema: {}, annotations: ro },
      async () =>
        this.run(async () => {
          const result = await this.requireClient().getSessions();
          if (!result.success) throw new Error(result.error || 'Failed to get sessions');
          const count = Array.isArray(result.data) ? result.data.length : 0;
          return { content: [this.text(`Found ${count} active session(s).`), this.text(JSON.stringify(result.data, null, 2))] };
        })
    );

    this.server.registerTool(
      'get_config',
      { title: 'Get Config', description: 'Get the runtime configuration of the Browserless instance', inputSchema: {}, annotations: ro },
      async () =>
        this.run(async () => {
          const result = await this.requireClient().getConfig();
          if (!result.success) throw new Error(result.error || 'Failed to get configuration');
          return { content: [this.text('Current configuration:'), this.text(JSON.stringify(result.data, null, 2))] };
        })
    );

    this.server.registerTool(
      'get_metrics',
      { title: 'Get Metrics', description: 'Get aggregated metrics of the Browserless instance', inputSchema: {}, annotations: ro },
      async () =>
        this.run(async () => {
          const result = await this.requireClient().getMetrics();
          if (!result.success) throw new Error(result.error || 'Failed to get metrics');
          return { content: [this.text('Current metrics:'), this.text(JSON.stringify(result.data, null, 2))] };
        })
    );
  }

  /** Expose the underlying MCP server so it can be wired to any transport. */
  getServer(): McpServer {
    return this.server;
  }

  /** Start the server over stdio (one process = one session). */
  async startStdio() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Browserless MCP server started (stdio)');
  }
}

/** Read and JSON-parse an HTTP request body. Resolves `undefined` when empty. */
function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Start the server over Streamable HTTP, exposing the MCP endpoint at `path`.
 * Sessions are tracked by the `mcp-session-id` header so multiple clients can
 * connect concurrently, each backed by its own MCP server instance.
 */
async function startHttp() {
  const host = process.env.MCP_HTTP_HOST || '0.0.0.0';
  const port = Number(process.env.MCP_HTTP_PORT || process.env.PORT || 3000);
  const mcpPath = process.env.MCP_HTTP_PATH || '/mcp';
  const authToken = process.env.MCP_AUTH_TOKEN || '';

  /** Return 401 if the request lacks a valid Bearer token (when authToken is set). */
  function requireAuth(req: IncomingMessage, res: ServerResponse): boolean {
    if (!authToken) return true;
    const header = req.headers['authorization'] as string | undefined;
    if (header && header === `Bearer ${authToken}`) return true;
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return false;
  }

  const transports: Record<string, StreamableHTTPServerTransport> = {};

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

      if (!requireAuth(req, res)) return;

      if (req.method === 'GET' && url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', name: 'browserless-mcp', transport: 'http' }));
        return;
      }

      if (url.pathname !== mcpPath) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }

      const sessionId = req.headers['mcp-session-id'] as string | undefined;

      if (req.method === 'POST') {
        const body = await readJsonBody(req);
        let transport = sessionId ? transports[sessionId] : undefined;

        if (!transport) {
          if (isInitializeRequest(body)) {
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              onsessioninitialized: (sid) => {
                transports[sid] = transport!;
              },
            });
            transport.onclose = () => {
              const sid = transport!.sessionId;
              if (sid) delete transports[sid];
            };
            const mcp = new BrowserlessMCPServer();
            await mcp.getServer().connect(transport);
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: No valid session ID provided' },
                id: null,
              })
            );
            return;
          }
        }

        await transport.handleRequest(req, res, body);
        return;
      }

      if (req.method === 'GET' || req.method === 'DELETE') {
        const transport = sessionId ? transports[sessionId] : undefined;
        if (!transport) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid or missing session ID' }));
          return;
        }
        await transport.handleRequest(req, res);
        return;
      }

      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal server error' },
            id: null,
          })
        );
      }
    }
  });

  httpServer.listen(port, host, () => {
    console.error(`Browserless MCP server started (http) on http://${host}:${port}${mcpPath}`);
  });
}

const useStdio = process.argv.slice(2).some((arg) => arg === 'stdio' || arg === '--stdio');

if (useStdio) {
  const server = new BrowserlessMCPServer();
  server.startStdio().catch(console.error);
} else {
  startHttp().catch(console.error);
}
