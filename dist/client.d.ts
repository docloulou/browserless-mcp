import { BrowserlessConfig, BrowserlessResponse, PdfRequest, PdfResponse, ScreenshotRequest, ScreenshotResponse, ContentRequest, ContentResponse, FunctionRequest, FunctionResponse, DownloadRequest, DownloadResponse, ScrapeRequest, ScrapeResponse, PerformanceRequest, PerformanceResponse, WebSocketOptions, WebSocketResponse, HealthResponse, MetaResponse } from './types.js';
export declare class BrowserlessClient {
    private config;
    private httpClient;
    private baseUrl;
    private wsBaseUrl;
    constructor(config: BrowserlessConfig);
    /**
     * Build the HTTP base URL from either an explicit `url` or host/port/protocol.
     * A trailing slash is stripped so endpoint paths can be appended cleanly.
     */
    private static resolveBaseUrl;
    /**
     * Split a request into a JSON body and Browserless query parameters
     * (launch / blockAds / timeout are sent as query params, not in the body).
     */
    private extractQuery;
    /**
     * Whether a failed request is worth retrying (transient server/launch issues).
     */
    private isRetryable;
    /**
     * POST with automatic retries on transient failures (browser launch crashes,
     * 5xx, network resets), using a small linear backoff.
     */
    private postWithRetry;
    /**
     * Generate PDF from URL or HTML content
     */
    generatePdf(request: PdfRequest): Promise<BrowserlessResponse<PdfResponse>>;
    /**
     * Take screenshot of a webpage
     */
    takeScreenshot(request: ScreenshotRequest): Promise<BrowserlessResponse<ScreenshotResponse>>;
    /**
     * Extract rendered HTML content from a webpage.
     * The /content endpoint returns raw HTML (text/html), not JSON.
     */
    getContent(request: ContentRequest): Promise<BrowserlessResponse<ContentResponse>>;
    /**
     * Execute custom JavaScript (puppeteer) code in the browser context.
     * The body must be JSON: { code, context }. The response is whatever the
     * function returns, so we decode it based on its content-type.
     */
    executeFunction(request: FunctionRequest): Promise<BrowserlessResponse<FunctionResponse>>;
    /**
     * Run puppeteer code and return any files Chromium downloaded during execution.
     * Body is JSON: { code, context }. The response is the downloaded file(s).
     */
    downloadFiles(request: DownloadRequest): Promise<BrowserlessResponse<DownloadResponse>>;
    /**
     * Scrape text/html/attributes from a list of selectors on a page.
     */
    scrape(request: ScrapeRequest): Promise<BrowserlessResponse<ScrapeResponse>>;
    /**
     * Run a Lighthouse performance audit
     */
    runPerformanceAudit(request: PerformanceRequest): Promise<BrowserlessResponse<PerformanceResponse>>;
    /**
     * Build (and verify) a WebSocket endpoint for Puppeteer/Playwright connections.
     */
    createWebSocketConnection(options?: WebSocketOptions): Promise<BrowserlessResponse<WebSocketResponse>>;
    /**
     * Liveness probe. /active returns 204 when the service is up.
     */
    getActive(): Promise<boolean>;
    /**
     * System versions (core API version, browser versions, ...).
     */
    getMeta(): Promise<BrowserlessResponse<MetaResponse>>;
    /**
     * Combined health: liveness (/active) + version metadata (/meta).
     */
    getHealth(): Promise<BrowserlessResponse<HealthResponse>>;
    /**
     * Active sessions
     */
    getSessions(): Promise<BrowserlessResponse<any>>;
    /**
     * Runtime configuration
     */
    getConfig(): Promise<BrowserlessResponse<any>>;
    /**
     * Aggregated metrics
     */
    getMetrics(): Promise<BrowserlessResponse<any>>;
    /**
     * Decode an arraybuffer response into a string (text) or base64 (binary)
     * based on the content-type header.
     */
    private decodeBody;
    private extensionForContentType;
    /**
     * Extract a human-readable message from an axios error, decoding string,
     * Buffer, ArrayBuffer and JSON error bodies.
     */
    private errorText;
    /**
     * Handle errors from API calls
     */
    private handleError;
    /**
     * Get the base URL for this client
     */
    getBaseUrl(): string;
    /**
     * Get the current configuration
     */
    getCurrentConfig(): BrowserlessConfig;
}
//# sourceMappingURL=client.d.ts.map