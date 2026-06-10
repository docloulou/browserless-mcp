import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WebSocket } from 'ws';
import {
  BrowserlessConfig,
  BrowserlessResponse,
  PdfRequest,
  PdfResponse,
  ScreenshotRequest,
  ScreenshotResponse,
  ContentRequest,
  ContentResponse,
  FunctionRequest,
  FunctionResponse,
  DownloadRequest,
  DownloadResponse,
  ScrapeRequest,
  ScrapeResponse,
  PerformanceRequest,
  PerformanceResponse,
  WebSocketOptions,
  WebSocketResponse,
  HealthResponse,
  MetaResponse,
} from './types.js';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';

export class BrowserlessClient {
  private config: BrowserlessConfig;
  private httpClient: AxiosInstance;
  private baseUrl: string;
  private wsBaseUrl: string;

  constructor(config: BrowserlessConfig) {
    this.config = config;
    this.baseUrl = BrowserlessClient.resolveBaseUrl(config);
    this.wsBaseUrl = this.baseUrl.replace(/^http/i, 'ws');

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.config.timeout,
      // Browserless treats any 2xx (including 204) as success. 4xx/5xx should reject.
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: { 'User-Agent': DEFAULT_USER_AGENT },
    });

    // Authenticate every request with the token as a query parameter.
    this.httpClient.interceptors.request.use((cfg) => {
      cfg.params = { ...(cfg.params || {}), token: this.config.token };
      return cfg;
    });
  }

  /**
   * Build the HTTP base URL from either an explicit `url` or host/port/protocol.
   * A trailing slash is stripped so endpoint paths can be appended cleanly.
   */
  private static resolveBaseUrl(config: BrowserlessConfig): string {
    if (config.url && config.url.trim().length > 0) {
      return config.url.trim().replace(/\/+$/, '');
    }
    const protocol = config.protocol === 'ws' ? 'http' : config.protocol === 'wss' ? 'https' : config.protocol;
    return `${protocol}://${config.host}:${config.port}`;
  }

  /**
   * Split a request into a JSON body and Browserless query parameters
   * (launch / blockAds / timeout are sent as query params, not in the body).
   */
  private extractQuery(request: any): { body: any; params: Record<string, any> } {
    const { launch, blockAds, timeout, ...body } = request || {};
    const params: Record<string, any> = {};
    if (launch !== undefined) params.launch = typeof launch === 'string' ? launch : JSON.stringify(launch);
    if (blockAds !== undefined) params.blockAds = blockAds;
    if (timeout !== undefined) params.timeout = timeout;
    return { body, params };
  }

  /**
   * Whether a failed request is worth retrying (transient server/launch issues).
   */
  private isRetryable(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false;
    if (!error.response) return true; // network error / reset / client timeout
    const status = error.response.status;
    if ([408, 425, 429, 500, 502, 503, 504].includes(status)) return true;
    const msg = this.errorText(error).toLowerCase();
    return (
      msg.includes('failed to launch') ||
      msg.includes('session closed') ||
      msg.includes('target closed') ||
      msg.includes('socket hang up') ||
      msg.includes('protocol error')
    );
  }

  /**
   * POST with automatic retries on transient failures (browser launch crashes,
   * 5xx, network resets), using a small linear backoff.
   */
  private async postWithRetry<T = any>(
    path: string,
    body: any,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    let lastError: unknown;
    const maxRetries = Math.max(0, this.config.retries ?? 0);
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.httpClient.post<T>(path, body, config);
      } catch (error) {
        lastError = error;
        if (attempt >= maxRetries || !this.isRetryable(error)) break;
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  /**
   * Generate PDF from URL or HTML content
   */
  async generatePdf(request: PdfRequest): Promise<BrowserlessResponse<PdfResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<ArrayBuffer>('/pdf', body, {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      return {
        success: true,
        data: {
          pdf: Buffer.from(response.data),
          filename: `document-${Date.now()}.pdf`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Take screenshot of a webpage
   */
  async takeScreenshot(request: ScreenshotRequest): Promise<BrowserlessResponse<ScreenshotResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<ArrayBuffer>('/screenshot', body, {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const format = request.options?.type || 'png';
      const filename = `screenshot-${Date.now()}.${format}`;

      return {
        success: true,
        data: {
          image: Buffer.from(response.data),
          filename,
          format,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Extract rendered HTML content from a webpage.
   * The /content endpoint returns raw HTML (text/html), not JSON.
   */
  async getContent(request: ContentRequest): Promise<BrowserlessResponse<ContentResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<string>('/content', body, {
        responseType: 'text',
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const html = typeof response.data === 'string' ? response.data : String(response.data);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

      return {
        success: true,
        data: {
          html,
          url: request.url,
          title: titleMatch ? titleMatch[1].trim() : undefined,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Execute custom JavaScript (puppeteer) code in the browser context.
   * The body must be JSON: { code, context }. The response is whatever the
   * function returns, so we decode it based on its content-type.
   */
  async executeFunction(request: FunctionRequest): Promise<BrowserlessResponse<FunctionResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<ArrayBuffer>('/function', body, {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      return {
        success: true,
        data: this.decodeBody(response.data, response.headers['content-type'] as string | undefined),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Run puppeteer code and return any files Chromium downloaded during execution.
   * Body is JSON: { code, context }. The response is the downloaded file(s).
   */
  async downloadFiles(request: DownloadRequest): Promise<BrowserlessResponse<DownloadResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<ArrayBuffer>('/download', body, {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const contentType = (response.headers['content-type'] as string) || 'application/octet-stream';
      return {
        success: true,
        data: {
          data: Buffer.from(response.data),
          contentType,
          filename: `download-${Date.now()}${this.extensionForContentType(contentType)}`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Scrape text/html/attributes from a list of selectors on a page.
   */
  async scrape(request: ScrapeRequest): Promise<BrowserlessResponse<ScrapeResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<any>('/scrape', body, {
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      return {
        success: true,
        data: { data: response.data },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Run a Lighthouse performance audit
   */
  async runPerformanceAudit(request: PerformanceRequest): Promise<BrowserlessResponse<PerformanceResponse>> {
    try {
      const { body, params } = this.extractQuery(request);
      const response = await this.postWithRetry<PerformanceResponse>('/performance', body, {
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Build (and verify) a WebSocket endpoint for Puppeteer/Playwright connections.
   */
  async createWebSocketConnection(
    options: WebSocketOptions = { browser: 'chromium', library: 'puppeteer' }
  ): Promise<BrowserlessResponse<WebSocketResponse>> {
    try {
      const { browser, library } = options;

      const path = library === 'playwright' ? `/${browser}/playwright` : `/${browser}`;
      const endpoint = `${this.wsBaseUrl}${path}?token=${encodeURIComponent(this.config.token)}`;

      const ws = new WebSocket(endpoint);

      return await new Promise((resolve) => {
        const timer = setTimeout(() => {
          try { ws.terminate(); } catch { /* noop */ }
          resolve({ success: false, error: 'WebSocket connection timed out' });
        }, Math.min(this.config.timeout, 15000));

        ws.on('open', () => {
          clearTimeout(timer);
          ws.close();
          resolve({
            success: true,
            data: {
              browserWSEndpoint: endpoint,
              sessionId: `session-${Date.now()}`,
            },
          });
        });

        ws.on('error', (error) => {
          clearTimeout(timer);
          resolve({
            success: false,
            error: `WebSocket connection failed: ${error.message}`,
          });
        });
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Liveness probe. /active returns 204 when the service is up.
   */
  async getActive(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/active', {
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return response.status >= 200 && response.status < 300;
    } catch {
      return false;
    }
  }

  /**
   * System versions (core API version, browser versions, ...).
   */
  async getMeta(): Promise<BrowserlessResponse<MetaResponse>> {
    try {
      const response: AxiosResponse<MetaResponse> = await this.httpClient.get('/meta');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Combined health: liveness (/active) + version metadata (/meta).
   */
  async getHealth(): Promise<BrowserlessResponse<HealthResponse>> {
    const active = await this.getActive();
    const meta = await this.getMeta();

    return {
      success: true,
      data: {
        status: active ? 'healthy' : 'unhealthy',
        active,
        meta: meta.success ? meta.data : undefined,
      },
    };
  }

  /**
   * Active sessions
   */
  async getSessions(): Promise<BrowserlessResponse<any>> {
    try {
      const response: AxiosResponse<any> = await this.httpClient.get('/sessions');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Runtime configuration
   */
  async getConfig(): Promise<BrowserlessResponse<any>> {
    try {
      const response: AxiosResponse<any> = await this.httpClient.get('/config');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Aggregated metrics
   */
  async getMetrics(): Promise<BrowserlessResponse<any>> {
    try {
      const response: AxiosResponse<any> = await this.httpClient.get('/metrics');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Decode an arraybuffer response into a string (text) or base64 (binary)
   * based on the content-type header.
   */
  private decodeBody(data: ArrayBuffer, contentTypeHeader?: string): FunctionResponse {
    const buffer = Buffer.from(data);
    const contentType = (contentTypeHeader || 'application/octet-stream').toLowerCase();
    const isText =
      contentType.includes('json') ||
      contentType.includes('text') ||
      contentType.includes('html') ||
      contentType.includes('xml') ||
      contentType.includes('javascript') ||
      contentType.includes('csv') ||
      contentType.includes('svg') ||
      contentType.includes('urlencoded');

    if (isText) {
      return { contentType, data: buffer.toString('utf-8'), isBinary: false };
    }
    return { contentType, data: buffer.toString('base64'), isBinary: true };
  }

  private extensionForContentType(contentType: string): string {
    const ct = contentType.toLowerCase();
    if (ct.includes('pdf')) return '.pdf';
    if (ct.includes('zip')) return '.zip';
    if (ct.includes('png')) return '.png';
    if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
    if (ct.includes('csv')) return '.csv';
    if (ct.includes('json')) return '.json';
    if (ct.includes('html')) return '.html';
    if (ct.includes('plain')) return '.txt';
    return '.bin';
  }

  /**
   * Extract a human-readable message from an axios error, decoding string,
   * Buffer, ArrayBuffer and JSON error bodies.
   */
  private errorText(error: unknown): string {
    if (!axios.isAxiosError(error)) {
      return error instanceof Error ? error.message : 'Unknown error occurred';
    }
    let message = error.message;
    const data = error.response?.data;
    if (data) {
      if (typeof data === 'string') {
        message = data;
      } else if (Buffer.isBuffer(data)) {
        message = data.toString('utf-8') || message;
      } else if (data instanceof ArrayBuffer) {
        message = Buffer.from(data).toString('utf-8') || message;
      } else if (typeof data === 'object') {
        message = (data as any).message || (data as any).error || JSON.stringify(data);
      }
    }
    return message;
  }

  /**
   * Handle errors from API calls
   */
  private handleError(error: unknown): BrowserlessResponse {
    return {
      success: false,
      error: this.errorText(error),
      statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
    };
  }

  /**
   * Get the base URL for this client
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get the current configuration
   */
  getCurrentConfig(): BrowserlessConfig {
    return { ...this.config };
  }
}
