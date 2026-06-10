import { z } from 'zod';

// Browserless configuration
// Supports either a full base `url` (e.g. https://my-browserless.example.com)
// or the classic host/port/protocol combination.
export const BrowserlessConfigSchema = z.object({
  url: z.string().optional(),
  host: z.string().default('localhost'),
  port: z.number().default(3000),
  token: z.string(),
  protocol: z.enum(['http', 'https', 'ws', 'wss']).default('http'),
  timeout: z.number().default(120000),
  concurrent: z.number().default(5),
});

export type BrowserlessConfig = z.infer<typeof BrowserlessConfigSchema>;

// PDF generation options
export const PdfOptionsSchema = z.object({
  displayHeaderFooter: z.boolean().optional(),
  printBackground: z.boolean().optional(),
  format: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  margin: z.object({
    top: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
    right: z.string().optional(),
  }).optional(),
  landscape: z.boolean().optional(),
  pageRanges: z.string().optional(),
  preferCSSPageSize: z.boolean().optional(),
  scale: z.number().optional(),
  headerTemplate: z.string().optional(),
  footerTemplate: z.string().optional(),
});

export type PdfOptions = z.infer<typeof PdfOptionsSchema>;

// Screenshot options
export const ScreenshotOptionsSchema = z.object({
  type: z.enum(['png', 'jpeg', 'webp']).optional(),
  quality: z.number().optional(),
  fullPage: z.boolean().optional(),
  omitBackground: z.boolean().optional(),
  clip: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
});

export type ScreenshotOptions = z.infer<typeof ScreenshotOptionsSchema>;

// Viewport options
export const ViewportSchema = z.object({
  width: z.number(),
  height: z.number(),
  deviceScaleFactor: z.number().optional(),
  isMobile: z.boolean().optional(),
  hasTouch: z.boolean().optional(),
});

export type Viewport = z.infer<typeof ViewportSchema>;

// Cookie schema
export const CookieSchema = z.object({
  name: z.string(),
  value: z.string(),
  domain: z.string().optional(),
  url: z.string().optional(),
  path: z.string().optional(),
  expires: z.number().optional(),
  httpOnly: z.boolean().optional(),
  secure: z.boolean().optional(),
  sameSite: z.enum(['Strict', 'Lax', 'None']).optional(),
});

export type Cookie = z.infer<typeof CookieSchema>;

// Script tag schema
export const ScriptTagSchema = z.object({
  url: z.string().optional(),
  content: z.string().optional(),
});

export type ScriptTag = z.infer<typeof ScriptTagSchema>;

// Style tag schema
export const StyleTagSchema = z.object({
  url: z.string().optional(),
  content: z.string().optional(),
});

export type StyleTag = z.infer<typeof StyleTagSchema>;

// Wait options
export const WaitForSelectorSchema = z.object({
  selector: z.string(),
  timeout: z.number().optional(),
  visible: z.boolean().optional(),
  hidden: z.boolean().optional(),
});

export const WaitForFunctionSchema = z.object({
  fn: z.string(),
  polling: z.union([z.string(), z.number()]).optional(),
  timeout: z.number().optional(),
});

export const WaitForEventSchema = z.object({
  event: z.string(),
  timeout: z.number().optional(),
});

// goto options (passed to puppeteer's page.goto)
export const GotoOptionsSchema = z.object({
  waitUntil: z.string().optional(),
  timeout: z.number().optional(),
  referer: z.string().optional(),
}).passthrough();

// PDF request schema
export const PdfRequestSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  options: PdfOptionsSchema.optional(),
  addScriptTag: z.array(ScriptTagSchema).optional(),
  addStyleTag: z.array(StyleTagSchema).optional(),
  cookies: z.array(CookieSchema).optional(),
  setExtraHTTPHeaders: z.record(z.string()).optional(),
  viewport: ViewportSchema.optional(),
  emulateMediaType: z.string().optional(),
  gotoOptions: GotoOptionsSchema.optional(),
  waitForEvent: WaitForEventSchema.optional(),
  waitForFunction: WaitForFunctionSchema.optional(),
  waitForSelector: WaitForSelectorSchema.optional(),
  waitForTimeout: z.number().optional(),
});

export type PdfRequest = z.infer<typeof PdfRequestSchema>;

// Screenshot request schema
export const ScreenshotRequestSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  options: ScreenshotOptionsSchema.optional(),
  selector: z.string().optional(),
  scrollPage: z.boolean().optional(),
  addScriptTag: z.array(ScriptTagSchema).optional(),
  addStyleTag: z.array(StyleTagSchema).optional(),
  cookies: z.array(CookieSchema).optional(),
  setExtraHTTPHeaders: z.record(z.string()).optional(),
  viewport: ViewportSchema.optional(),
  emulateMediaType: z.string().optional(),
  gotoOptions: GotoOptionsSchema.optional(),
  waitForSelector: WaitForSelectorSchema.optional(),
  waitForFunction: WaitForFunctionSchema.optional(),
  waitForTimeout: z.number().optional(),
});

export type ScreenshotRequest = z.infer<typeof ScreenshotRequestSchema>;

// Content request schema
export const ContentRequestSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  gotoOptions: GotoOptionsSchema.optional(),
  waitForSelector: WaitForSelectorSchema.optional(),
  waitForFunction: WaitForFunctionSchema.optional(),
  waitForTimeout: z.number().optional(),
  addScriptTag: z.array(ScriptTagSchema).optional(),
  setExtraHTTPHeaders: z.record(z.string()).optional(),
  cookies: z.array(CookieSchema).optional(),
  viewport: ViewportSchema.optional(),
  emulateMediaType: z.string().optional(),
  bestAttempt: z.boolean().optional(),
});

export type ContentRequest = z.infer<typeof ContentRequestSchema>;

// Function request schema (sent as application/json: { code, context })
export const FunctionRequestSchema = z.object({
  code: z.string(),
  context: z.record(z.any()).optional(),
});

export type FunctionRequest = z.infer<typeof FunctionRequestSchema>;

// Download request schema (same shape as function)
export const DownloadRequestSchema = z.object({
  code: z.string(),
  context: z.record(z.any()).optional(),
});

export type DownloadRequest = z.infer<typeof DownloadRequestSchema>;

// Scrape request schema
export const ScrapeElementSchema = z.object({
  selector: z.string(),
  timeout: z.number().optional(),
});

export const ScrapeRequestSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  elements: z.array(ScrapeElementSchema),
  gotoOptions: GotoOptionsSchema.optional(),
  waitForSelector: WaitForSelectorSchema.optional(),
  waitForTimeout: z.number().optional(),
  debugOpts: z.object({
    console: z.boolean().optional(),
    cookies: z.boolean().optional(),
    html: z.boolean().optional(),
    network: z.boolean().optional(),
    screenshot: z.boolean().optional(),
  }).optional(),
  bestAttempt: z.boolean().optional(),
});

export type ScrapeRequest = z.infer<typeof ScrapeRequestSchema>;

// Performance request schema
export const PerformanceRequestSchema = z.object({
  url: z.string(),
  config: z.object({
    extends: z.string().optional(),
    settings: z.record(z.any()).optional(),
  }).optional(),
});

export type PerformanceRequest = z.infer<typeof PerformanceRequestSchema>;

// WebSocket connection options
export const WebSocketOptionsSchema = z.object({
  browser: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  library: z.enum(['puppeteer', 'playwright']).default('puppeteer'),
  blockAds: z.boolean().optional(),
  launch: z.record(z.any()).optional(),
});

export type WebSocketOptions = z.infer<typeof WebSocketOptionsSchema>;

// Response types
export interface BrowserlessResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PdfResponse {
  pdf: Buffer;
  filename: string;
}

export interface ScreenshotResponse {
  image: Buffer;
  filename: string;
  format: string;
}

export interface ContentResponse {
  html: string;
  url?: string;
  title?: string;
}

// The /function endpoint returns whatever the executed function returns.
// We surface the raw payload alongside its content-type.
export interface FunctionResponse {
  contentType: string;
  data: string; // utf-8 text for textual responses, base64 for binary
  isBinary: boolean;
}

export interface DownloadResponse {
  data: Buffer;
  contentType: string;
  filename: string;
}

export interface ScrapeResponse {
  data: any;
}

export interface PerformanceResponse {
  [key: string]: any;
}

export interface WebSocketResponse {
  browserWSEndpoint: string;
  sessionId: string;
}

// Browserless /meta payload
export interface MetaResponse {
  version: string;
  chromium: string | null;
  firefox: string | null;
  webkit: string | null;
  puppeteer: string[];
  playwright: string[];
}

// Health (derived from /active + /meta)
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  active: boolean;
  meta?: MetaResponse;
}
