#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import { BrowserlessClient } from './client.js';
import { BrowserlessConfigSchema, PdfRequestSchema, ScreenshotRequestSchema, ContentRequestSchema, FunctionRequestSchema, DownloadRequestSchema, ScrapeRequestSchema, PerformanceRequestSchema, WebSocketOptionsSchema, } from './types.js';
dotenv.config();
const OUTPUT_DIR = process.env.BROWSERLESS_OUTPUT_DIR || path.join(os.tmpdir(), 'browserless-mcp');
class BrowserlessMCPServer {
    server;
    client = null;
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
    maybeInitFromEnv() {
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
            });
            this.client = new BrowserlessClient(config);
        }
        catch (error) {
            console.error('Failed to auto-initialise Browserless client from env:', error);
        }
    }
    requireClient() {
        if (!this.client) {
            throw new Error('Browserless client not initialized. Call "initialize_browserless" first, or set BROWSERLESS_URL/BROWSERLESS_TOKEN.');
        }
        return this.client;
    }
    async saveOutput(filename, data) {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        const filePath = path.join(OUTPUT_DIR, filename);
        await fs.writeFile(filePath, data);
        return filePath;
    }
    text(text) {
        return { type: 'text', text };
    }
    async run(fn) {
        try {
            return await fn();
        }
        catch (error) {
            return {
                isError: true,
                content: [this.text(`Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)],
            };
        }
    }
    registerTools() {
        const ro = { readOnlyHint: true };
        this.server.registerTool('initialize_browserless', {
            title: 'Initialize Browserless',
            description: 'Initialize connection to a Browserless instance. Provide either a full "url" (e.g. https://my-browserless.example.com) or host/port/protocol.',
            inputSchema: BrowserlessConfigSchema.shape,
        }, async (args) => this.run(async () => {
            const config = BrowserlessConfigSchema.parse(args);
            this.client = new BrowserlessClient(config);
            const health = await this.client.getHealth();
            const meta = health.data?.meta;
            return {
                content: [
                    this.text([
                        `Browserless client initialized at ${this.client.getBaseUrl()}`,
                        `Status: ${health.data?.status ?? 'unknown'}`,
                        meta ? `API version: ${meta.version} | Chromium: ${meta.chromium ?? 'n/a'}` : '',
                    ]
                        .filter(Boolean)
                        .join('\n')),
                ],
            };
        }));
        this.server.registerTool('generate_pdf', {
            title: 'Generate PDF',
            description: 'Generate a PDF from a URL or raw HTML content (saved to disk)',
            inputSchema: PdfRequestSchema.shape,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().generatePdf(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to generate PDF');
            const filePath = await this.saveOutput(result.data.filename, result.data.pdf);
            return { content: [this.text(`PDF generated (${result.data.pdf.length} bytes) and saved to: ${filePath}`)] };
        }));
        this.server.registerTool('take_screenshot', {
            title: 'Take Screenshot',
            description: 'Take a screenshot of a webpage (returned inline as an image and saved to disk)',
            inputSchema: ScreenshotRequestSchema.shape,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().takeScreenshot(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to take screenshot');
            const filePath = await this.saveOutput(result.data.filename, result.data.image);
            return {
                content: [
                    this.text(`Screenshot captured (${result.data.image.length} bytes) and saved to: ${filePath}`),
                    { type: 'image', mimeType: `image/${result.data.format}`, data: result.data.image.toString('base64') },
                ],
            };
        }));
        this.server.registerTool('get_content', {
            title: 'Get Content',
            description: 'Extract the rendered HTML content of a webpage after JavaScript execution',
            inputSchema: ContentRequestSchema.shape,
            annotations: ro,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().getContent(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to get content');
            return {
                content: [
                    this.text(`Content extracted from ${result.data.url ?? 'HTML input'}${result.data.title ? ` (title: ${result.data.title})` : ''}`),
                    this.text(result.data.html),
                ],
            };
        }));
        this.server.registerTool('execute_function', {
            title: 'Execute Function',
            description: 'Run custom puppeteer code in the browser. `code` is an ES module exporting a default async function, e.g. "export default async function ({ page }) { ... return { data, type } }".',
            inputSchema: FunctionRequestSchema.shape,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().executeFunction(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to execute function');
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
        }));
        this.server.registerTool('scrape', {
            title: 'Scrape Selectors',
            description: 'Scrape text/html/attributes from a list of CSS selectors on a page',
            inputSchema: ScrapeRequestSchema.shape,
            annotations: ro,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().scrape(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to scrape');
            return {
                content: [this.text('Scrape completed successfully.'), this.text(JSON.stringify(result.data.data, null, 2))],
            };
        }));
        this.server.registerTool('download_files', {
            title: 'Download Files',
            description: 'Run puppeteer code and return any files Chromium downloaded during execution',
            inputSchema: DownloadRequestSchema.shape,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().downloadFiles(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to download files');
            const filePath = await this.saveOutput(result.data.filename, result.data.data);
            return {
                content: [
                    this.text(`Downloaded ${result.data.data.length} bytes (${result.data.contentType}) saved to: ${filePath}`),
                ],
            };
        }));
        this.server.registerTool('run_performance_audit', {
            title: 'Run Performance Audit',
            description: 'Run a Lighthouse performance audit on a URL',
            inputSchema: PerformanceRequestSchema.shape,
            annotations: ro,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().runPerformanceAudit(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to run performance audit');
            return {
                content: [this.text('Performance audit completed successfully.'), this.text(JSON.stringify(result.data, null, 2))],
            };
        }));
        this.server.registerTool('create_websocket_connection', {
            title: 'Create WebSocket Connection',
            description: 'Build a WebSocket endpoint for connecting Puppeteer/Playwright to the browser',
            inputSchema: WebSocketOptionsSchema.shape,
            annotations: ro,
        }, async (args) => this.run(async () => {
            const result = await this.requireClient().createWebSocketConnection(args);
            if (!result.success || !result.data)
                throw new Error(result.error || 'Failed to create WebSocket connection');
            return {
                content: [
                    this.text(`WebSocket session: ${result.data.sessionId}`),
                    this.text(`Browser WebSocket endpoint: ${result.data.browserWSEndpoint}`),
                ],
            };
        }));
        this.server.registerTool('get_health', { title: 'Get Health', description: 'Get liveness status and version metadata of the Browserless instance', inputSchema: {}, annotations: ro }, async () => this.run(async () => {
            const result = await this.requireClient().getHealth();
            return {
                content: [this.text(`Health status: ${result.data?.status}`), this.text(JSON.stringify(result.data, null, 2))],
            };
        }));
        this.server.registerTool('get_sessions', { title: 'Get Sessions', description: 'Get the list of active browser sessions', inputSchema: {}, annotations: ro }, async () => this.run(async () => {
            const result = await this.requireClient().getSessions();
            if (!result.success)
                throw new Error(result.error || 'Failed to get sessions');
            const count = Array.isArray(result.data) ? result.data.length : 0;
            return { content: [this.text(`Found ${count} active session(s).`), this.text(JSON.stringify(result.data, null, 2))] };
        }));
        this.server.registerTool('get_config', { title: 'Get Config', description: 'Get the runtime configuration of the Browserless instance', inputSchema: {}, annotations: ro }, async () => this.run(async () => {
            const result = await this.requireClient().getConfig();
            if (!result.success)
                throw new Error(result.error || 'Failed to get configuration');
            return { content: [this.text('Current configuration:'), this.text(JSON.stringify(result.data, null, 2))] };
        }));
        this.server.registerTool('get_metrics', { title: 'Get Metrics', description: 'Get aggregated metrics of the Browserless instance', inputSchema: {}, annotations: ro }, async () => this.run(async () => {
            const result = await this.requireClient().getMetrics();
            if (!result.success)
                throw new Error(result.error || 'Failed to get metrics');
            return { content: [this.text('Current metrics:'), this.text(JSON.stringify(result.data, null, 2))] };
        }));
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Browserless MCP server started');
    }
}
const server = new BrowserlessMCPServer();
server.start().catch(console.error);
//# sourceMappingURL=index.js.map