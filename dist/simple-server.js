#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
/**
 * A minimal Browserless MCP server exposing only the most reliable endpoints
 * (content + pdf). For the full feature set use index.ts.
 */
class SimpleBrowserlessMCPServer {
    server;
    browserlessUrl;
    token;
    constructor() {
        this.server = new McpServer({ name: 'browserless-mcp-simple', version: '2.0.0' });
        const url = process.env.BROWSERLESS_URL;
        if (url) {
            this.browserlessUrl = url.replace(/\/+$/, '');
        }
        else {
            const protocol = process.env.BROWSERLESS_PROTOCOL || 'http';
            const host = process.env.BROWSERLESS_HOST || 'localhost';
            const port = process.env.BROWSERLESS_PORT || '3000';
            this.browserlessUrl = `${protocol}://${host}:${port}`;
        }
        this.token = process.env.BROWSERLESS_TOKEN;
        this.registerTools();
    }
    params() {
        return this.token ? { token: this.token } : {};
    }
    registerTools() {
        this.server.registerTool('get_content', {
            title: 'Get Content',
            description: 'Extract rendered HTML content from a webpage',
            inputSchema: {
                url: z.string(),
                waitForSelector: z
                    .object({ selector: z.string(), timeout: z.number().optional() })
                    .optional(),
            },
            annotations: { readOnlyHint: true },
        }, async ({ url, waitForSelector }) => {
            try {
                const response = await axios.post(`${this.browserlessUrl}/content`, { url, ...(waitForSelector ? { waitForSelector } : {}) }, { params: this.params(), timeout: 30000, responseType: 'text' });
                return {
                    content: [
                        { type: 'text', text: `Content extracted successfully from ${url}` },
                        { type: 'text', text: String(response.data) },
                    ],
                };
            }
            catch (error) {
                return { isError: true, content: [{ type: 'text', text: this.errMsg(error) }] };
            }
        });
        this.server.registerTool('generate_pdf', {
            title: 'Generate PDF',
            description: 'Generate a PDF from a URL',
            inputSchema: {
                url: z.string(),
                options: z.record(z.any()).optional(),
            },
        }, async ({ url, options }) => {
            try {
                const response = await axios.post(`${this.browserlessUrl}/pdf`, { url, options: options || {} }, { params: this.params(), responseType: 'arraybuffer', timeout: 60000 });
                const buf = Buffer.from(response.data);
                return {
                    content: [
                        { type: 'text', text: `PDF generated successfully from ${url} (${buf.length} bytes, base64 below)` },
                        { type: 'text', text: buf.toString('base64') },
                    ],
                };
            }
            catch (error) {
                return { isError: true, content: [{ type: 'text', text: this.errMsg(error) }] };
            }
        });
        this.server.registerTool('test_connection', { title: 'Test Connection', description: 'Test connection to the Browserless instance', inputSchema: {}, annotations: { readOnlyHint: true } }, async () => {
            try {
                const response = await axios.get(`${this.browserlessUrl}/config`, { params: this.params(), timeout: 5000 });
                return {
                    content: [
                        { type: 'text', text: 'Browserless connection successful.' },
                        { type: 'text', text: `Configuration: ${JSON.stringify(response.data, null, 2)}` },
                    ],
                };
            }
            catch (error) {
                return { isError: true, content: [{ type: 'text', text: this.errMsg(error) }] };
            }
        });
    }
    errMsg(error) {
        return `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Simple Browserless MCP server started');
    }
}
const server = new SimpleBrowserlessMCPServer();
server.start().catch(console.error);
//# sourceMappingURL=simple-server.js.map