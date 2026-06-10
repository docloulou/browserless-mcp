import { z } from 'zod';
export declare const BrowserlessConfigSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodNumber>;
    token: z.ZodString;
    protocol: z.ZodDefault<z.ZodEnum<["http", "https", "ws", "wss"]>>;
    timeout: z.ZodDefault<z.ZodNumber>;
    concurrent: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    host: string;
    port: number;
    token: string;
    protocol: "http" | "https" | "ws" | "wss";
    timeout: number;
    concurrent: number;
    url?: string | undefined;
}, {
    token: string;
    url?: string | undefined;
    host?: string | undefined;
    port?: number | undefined;
    protocol?: "http" | "https" | "ws" | "wss" | undefined;
    timeout?: number | undefined;
    concurrent?: number | undefined;
}>;
export type BrowserlessConfig = z.infer<typeof BrowserlessConfigSchema>;
export declare const PdfOptionsSchema: z.ZodObject<{
    displayHeaderFooter: z.ZodOptional<z.ZodBoolean>;
    printBackground: z.ZodOptional<z.ZodBoolean>;
    format: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodString>;
    height: z.ZodOptional<z.ZodString>;
    margin: z.ZodOptional<z.ZodObject<{
        top: z.ZodOptional<z.ZodString>;
        bottom: z.ZodOptional<z.ZodString>;
        left: z.ZodOptional<z.ZodString>;
        right: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        top?: string | undefined;
        bottom?: string | undefined;
        left?: string | undefined;
        right?: string | undefined;
    }, {
        top?: string | undefined;
        bottom?: string | undefined;
        left?: string | undefined;
        right?: string | undefined;
    }>>;
    landscape: z.ZodOptional<z.ZodBoolean>;
    pageRanges: z.ZodOptional<z.ZodString>;
    preferCSSPageSize: z.ZodOptional<z.ZodBoolean>;
    scale: z.ZodOptional<z.ZodNumber>;
    headerTemplate: z.ZodOptional<z.ZodString>;
    footerTemplate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayHeaderFooter?: boolean | undefined;
    printBackground?: boolean | undefined;
    format?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    margin?: {
        top?: string | undefined;
        bottom?: string | undefined;
        left?: string | undefined;
        right?: string | undefined;
    } | undefined;
    landscape?: boolean | undefined;
    pageRanges?: string | undefined;
    preferCSSPageSize?: boolean | undefined;
    scale?: number | undefined;
    headerTemplate?: string | undefined;
    footerTemplate?: string | undefined;
}, {
    displayHeaderFooter?: boolean | undefined;
    printBackground?: boolean | undefined;
    format?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    margin?: {
        top?: string | undefined;
        bottom?: string | undefined;
        left?: string | undefined;
        right?: string | undefined;
    } | undefined;
    landscape?: boolean | undefined;
    pageRanges?: string | undefined;
    preferCSSPageSize?: boolean | undefined;
    scale?: number | undefined;
    headerTemplate?: string | undefined;
    footerTemplate?: string | undefined;
}>;
export type PdfOptions = z.infer<typeof PdfOptionsSchema>;
export declare const ScreenshotOptionsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["png", "jpeg", "webp"]>>;
    quality: z.ZodOptional<z.ZodNumber>;
    fullPage: z.ZodOptional<z.ZodBoolean>;
    omitBackground: z.ZodOptional<z.ZodBoolean>;
    clip: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        x: number;
        y: number;
    }, {
        width: number;
        height: number;
        x: number;
        y: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    type?: "png" | "jpeg" | "webp" | undefined;
    quality?: number | undefined;
    fullPage?: boolean | undefined;
    omitBackground?: boolean | undefined;
    clip?: {
        width: number;
        height: number;
        x: number;
        y: number;
    } | undefined;
}, {
    type?: "png" | "jpeg" | "webp" | undefined;
    quality?: number | undefined;
    fullPage?: boolean | undefined;
    omitBackground?: boolean | undefined;
    clip?: {
        width: number;
        height: number;
        x: number;
        y: number;
    } | undefined;
}>;
export type ScreenshotOptions = z.infer<typeof ScreenshotOptionsSchema>;
export declare const ViewportSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    deviceScaleFactor: z.ZodOptional<z.ZodNumber>;
    isMobile: z.ZodOptional<z.ZodBoolean>;
    hasTouch: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    deviceScaleFactor?: number | undefined;
    isMobile?: boolean | undefined;
    hasTouch?: boolean | undefined;
}, {
    width: number;
    height: number;
    deviceScaleFactor?: number | undefined;
    isMobile?: boolean | undefined;
    hasTouch?: boolean | undefined;
}>;
export type Viewport = z.infer<typeof ViewportSchema>;
export declare const CookieSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    domain: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    expires: z.ZodOptional<z.ZodNumber>;
    httpOnly: z.ZodOptional<z.ZodBoolean>;
    secure: z.ZodOptional<z.ZodBoolean>;
    sameSite: z.ZodOptional<z.ZodEnum<["Strict", "Lax", "None"]>>;
}, "strip", z.ZodTypeAny, {
    value: string;
    name: string;
    url?: string | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    expires?: number | undefined;
    httpOnly?: boolean | undefined;
    secure?: boolean | undefined;
    sameSite?: "Strict" | "Lax" | "None" | undefined;
}, {
    value: string;
    name: string;
    url?: string | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    expires?: number | undefined;
    httpOnly?: boolean | undefined;
    secure?: boolean | undefined;
    sameSite?: "Strict" | "Lax" | "None" | undefined;
}>;
export type Cookie = z.infer<typeof CookieSchema>;
export declare const ScriptTagSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    content?: string | undefined;
}, {
    url?: string | undefined;
    content?: string | undefined;
}>;
export type ScriptTag = z.infer<typeof ScriptTagSchema>;
export declare const StyleTagSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    content?: string | undefined;
}, {
    url?: string | undefined;
    content?: string | undefined;
}>;
export type StyleTag = z.infer<typeof StyleTagSchema>;
export declare const WaitForSelectorSchema: z.ZodObject<{
    selector: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
    hidden: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    selector: string;
    timeout?: number | undefined;
    visible?: boolean | undefined;
    hidden?: boolean | undefined;
}, {
    selector: string;
    timeout?: number | undefined;
    visible?: boolean | undefined;
    hidden?: boolean | undefined;
}>;
export declare const WaitForFunctionSchema: z.ZodObject<{
    fn: z.ZodString;
    polling: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    fn: string;
    timeout?: number | undefined;
    polling?: string | number | undefined;
}, {
    fn: string;
    timeout?: number | undefined;
    polling?: string | number | undefined;
}>;
export declare const WaitForEventSchema: z.ZodObject<{
    event: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    event: string;
    timeout?: number | undefined;
}, {
    event: string;
    timeout?: number | undefined;
}>;
export declare const GotoOptionsSchema: z.ZodObject<{
    waitUntil: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    referer: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    waitUntil: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    referer: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    waitUntil: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    referer: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const PdfRequestSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodObject<{
        displayHeaderFooter: z.ZodOptional<z.ZodBoolean>;
        printBackground: z.ZodOptional<z.ZodBoolean>;
        format: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodString>;
        height: z.ZodOptional<z.ZodString>;
        margin: z.ZodOptional<z.ZodObject<{
            top: z.ZodOptional<z.ZodString>;
            bottom: z.ZodOptional<z.ZodString>;
            left: z.ZodOptional<z.ZodString>;
            right: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        }, {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        }>>;
        landscape: z.ZodOptional<z.ZodBoolean>;
        pageRanges: z.ZodOptional<z.ZodString>;
        preferCSSPageSize: z.ZodOptional<z.ZodBoolean>;
        scale: z.ZodOptional<z.ZodNumber>;
        headerTemplate: z.ZodOptional<z.ZodString>;
        footerTemplate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        displayHeaderFooter?: boolean | undefined;
        printBackground?: boolean | undefined;
        format?: string | undefined;
        width?: string | undefined;
        height?: string | undefined;
        margin?: {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        } | undefined;
        landscape?: boolean | undefined;
        pageRanges?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        scale?: number | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
    }, {
        displayHeaderFooter?: boolean | undefined;
        printBackground?: boolean | undefined;
        format?: string | undefined;
        width?: string | undefined;
        height?: string | undefined;
        margin?: {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        } | undefined;
        landscape?: boolean | undefined;
        pageRanges?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        scale?: number | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
    }>>;
    addScriptTag: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        content?: string | undefined;
    }, {
        url?: string | undefined;
        content?: string | undefined;
    }>, "many">>;
    addStyleTag: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        content?: string | undefined;
    }, {
        url?: string | undefined;
        content?: string | undefined;
    }>, "many">>;
    cookies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        domain: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        expires: z.ZodOptional<z.ZodNumber>;
        httpOnly: z.ZodOptional<z.ZodBoolean>;
        secure: z.ZodOptional<z.ZodBoolean>;
        sameSite: z.ZodOptional<z.ZodEnum<["Strict", "Lax", "None"]>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }>, "many">>;
    setExtraHTTPHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        deviceScaleFactor: z.ZodOptional<z.ZodNumber>;
        isMobile: z.ZodOptional<z.ZodBoolean>;
        hasTouch: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }>>;
    emulateMediaType: z.ZodOptional<z.ZodString>;
    gotoOptions: z.ZodOptional<z.ZodObject<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    waitForEvent: z.ZodOptional<z.ZodObject<{
        event: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        event: string;
        timeout?: number | undefined;
    }, {
        event: string;
        timeout?: number | undefined;
    }>>;
    waitForFunction: z.ZodOptional<z.ZodObject<{
        fn: z.ZodString;
        polling: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }>>;
    waitForSelector: z.ZodOptional<z.ZodObject<{
        selector: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }>>;
    waitForTimeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    options?: {
        displayHeaderFooter?: boolean | undefined;
        printBackground?: boolean | undefined;
        format?: string | undefined;
        width?: string | undefined;
        height?: string | undefined;
        margin?: {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        } | undefined;
        landscape?: boolean | undefined;
        pageRanges?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        scale?: number | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
    } | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    addStyleTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForEvent?: {
        event: string;
        timeout?: number | undefined;
    } | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
}, {
    url?: string | undefined;
    options?: {
        displayHeaderFooter?: boolean | undefined;
        printBackground?: boolean | undefined;
        format?: string | undefined;
        width?: string | undefined;
        height?: string | undefined;
        margin?: {
            top?: string | undefined;
            bottom?: string | undefined;
            left?: string | undefined;
            right?: string | undefined;
        } | undefined;
        landscape?: boolean | undefined;
        pageRanges?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        scale?: number | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
    } | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    addStyleTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForEvent?: {
        event: string;
        timeout?: number | undefined;
    } | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
}>;
export type PdfRequest = z.infer<typeof PdfRequestSchema>;
export declare const ScreenshotRequestSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["png", "jpeg", "webp"]>>;
        quality: z.ZodOptional<z.ZodNumber>;
        fullPage: z.ZodOptional<z.ZodBoolean>;
        omitBackground: z.ZodOptional<z.ZodBoolean>;
        clip: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
            x: number;
            y: number;
        }, {
            width: number;
            height: number;
            x: number;
            y: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type?: "png" | "jpeg" | "webp" | undefined;
        quality?: number | undefined;
        fullPage?: boolean | undefined;
        omitBackground?: boolean | undefined;
        clip?: {
            width: number;
            height: number;
            x: number;
            y: number;
        } | undefined;
    }, {
        type?: "png" | "jpeg" | "webp" | undefined;
        quality?: number | undefined;
        fullPage?: boolean | undefined;
        omitBackground?: boolean | undefined;
        clip?: {
            width: number;
            height: number;
            x: number;
            y: number;
        } | undefined;
    }>>;
    selector: z.ZodOptional<z.ZodString>;
    scrollPage: z.ZodOptional<z.ZodBoolean>;
    addScriptTag: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        content?: string | undefined;
    }, {
        url?: string | undefined;
        content?: string | undefined;
    }>, "many">>;
    addStyleTag: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        content?: string | undefined;
    }, {
        url?: string | undefined;
        content?: string | undefined;
    }>, "many">>;
    cookies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        domain: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        expires: z.ZodOptional<z.ZodNumber>;
        httpOnly: z.ZodOptional<z.ZodBoolean>;
        secure: z.ZodOptional<z.ZodBoolean>;
        sameSite: z.ZodOptional<z.ZodEnum<["Strict", "Lax", "None"]>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }>, "many">>;
    setExtraHTTPHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        deviceScaleFactor: z.ZodOptional<z.ZodNumber>;
        isMobile: z.ZodOptional<z.ZodBoolean>;
        hasTouch: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }>>;
    emulateMediaType: z.ZodOptional<z.ZodString>;
    gotoOptions: z.ZodOptional<z.ZodObject<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    waitForSelector: z.ZodOptional<z.ZodObject<{
        selector: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }>>;
    waitForFunction: z.ZodOptional<z.ZodObject<{
        fn: z.ZodString;
        polling: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }>>;
    waitForTimeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    options?: {
        type?: "png" | "jpeg" | "webp" | undefined;
        quality?: number | undefined;
        fullPage?: boolean | undefined;
        omitBackground?: boolean | undefined;
        clip?: {
            width: number;
            height: number;
            x: number;
            y: number;
        } | undefined;
    } | undefined;
    selector?: string | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    addStyleTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    scrollPage?: boolean | undefined;
}, {
    url?: string | undefined;
    options?: {
        type?: "png" | "jpeg" | "webp" | undefined;
        quality?: number | undefined;
        fullPage?: boolean | undefined;
        omitBackground?: boolean | undefined;
        clip?: {
            width: number;
            height: number;
            x: number;
            y: number;
        } | undefined;
    } | undefined;
    selector?: string | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    addStyleTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    scrollPage?: boolean | undefined;
}>;
export type ScreenshotRequest = z.infer<typeof ScreenshotRequestSchema>;
export declare const ContentRequestSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    gotoOptions: z.ZodOptional<z.ZodObject<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    waitForSelector: z.ZodOptional<z.ZodObject<{
        selector: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }>>;
    waitForFunction: z.ZodOptional<z.ZodObject<{
        fn: z.ZodString;
        polling: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }, {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    }>>;
    waitForTimeout: z.ZodOptional<z.ZodNumber>;
    addScriptTag: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        content?: string | undefined;
    }, {
        url?: string | undefined;
        content?: string | undefined;
    }>, "many">>;
    setExtraHTTPHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    cookies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        domain: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        expires: z.ZodOptional<z.ZodNumber>;
        httpOnly: z.ZodOptional<z.ZodBoolean>;
        secure: z.ZodOptional<z.ZodBoolean>;
        sameSite: z.ZodOptional<z.ZodEnum<["Strict", "Lax", "None"]>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }, {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }>, "many">>;
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        deviceScaleFactor: z.ZodOptional<z.ZodNumber>;
        isMobile: z.ZodOptional<z.ZodBoolean>;
        hasTouch: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }, {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    }>>;
    emulateMediaType: z.ZodOptional<z.ZodString>;
    bestAttempt: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    bestAttempt?: boolean | undefined;
}, {
    url?: string | undefined;
    html?: string | undefined;
    addScriptTag?: {
        url?: string | undefined;
        content?: string | undefined;
    }[] | undefined;
    cookies?: {
        value: string;
        name: string;
        url?: string | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        expires?: number | undefined;
        httpOnly?: boolean | undefined;
        secure?: boolean | undefined;
        sameSite?: "Strict" | "Lax" | "None" | undefined;
    }[] | undefined;
    setExtraHTTPHeaders?: Record<string, string> | undefined;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number | undefined;
        isMobile?: boolean | undefined;
        hasTouch?: boolean | undefined;
    } | undefined;
    emulateMediaType?: string | undefined;
    gotoOptions?: z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForFunction?: {
        fn: string;
        timeout?: number | undefined;
        polling?: string | number | undefined;
    } | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    bestAttempt?: boolean | undefined;
}>;
export type ContentRequest = z.infer<typeof ContentRequestSchema>;
export declare const FunctionRequestSchema: z.ZodObject<{
    code: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    context?: Record<string, any> | undefined;
}, {
    code: string;
    context?: Record<string, any> | undefined;
}>;
export type FunctionRequest = z.infer<typeof FunctionRequestSchema>;
export declare const DownloadRequestSchema: z.ZodObject<{
    code: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    context?: Record<string, any> | undefined;
}, {
    code: string;
    context?: Record<string, any> | undefined;
}>;
export type DownloadRequest = z.infer<typeof DownloadRequestSchema>;
export declare const ScrapeElementSchema: z.ZodObject<{
    selector: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    selector: string;
    timeout?: number | undefined;
}, {
    selector: string;
    timeout?: number | undefined;
}>;
export declare const ScrapeRequestSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    elements: z.ZodArray<z.ZodObject<{
        selector: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        timeout?: number | undefined;
    }, {
        selector: string;
        timeout?: number | undefined;
    }>, "many">;
    gotoOptions: z.ZodOptional<z.ZodObject<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    waitForSelector: z.ZodOptional<z.ZodObject<{
        selector: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }, {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    }>>;
    waitForTimeout: z.ZodOptional<z.ZodNumber>;
    debugOpts: z.ZodOptional<z.ZodObject<{
        console: z.ZodOptional<z.ZodBoolean>;
        cookies: z.ZodOptional<z.ZodBoolean>;
        html: z.ZodOptional<z.ZodBoolean>;
        network: z.ZodOptional<z.ZodBoolean>;
        screenshot: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        html?: boolean | undefined;
        cookies?: boolean | undefined;
        console?: boolean | undefined;
        network?: boolean | undefined;
        screenshot?: boolean | undefined;
    }, {
        html?: boolean | undefined;
        cookies?: boolean | undefined;
        console?: boolean | undefined;
        network?: boolean | undefined;
        screenshot?: boolean | undefined;
    }>>;
    bestAttempt: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    elements: {
        selector: string;
        timeout?: number | undefined;
    }[];
    url?: string | undefined;
    html?: string | undefined;
    gotoOptions?: z.objectOutputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    bestAttempt?: boolean | undefined;
    debugOpts?: {
        html?: boolean | undefined;
        cookies?: boolean | undefined;
        console?: boolean | undefined;
        network?: boolean | undefined;
        screenshot?: boolean | undefined;
    } | undefined;
}, {
    elements: {
        selector: string;
        timeout?: number | undefined;
    }[];
    url?: string | undefined;
    html?: string | undefined;
    gotoOptions?: z.objectInputType<{
        waitUntil: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        referer: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    waitForSelector?: {
        selector: string;
        timeout?: number | undefined;
        visible?: boolean | undefined;
        hidden?: boolean | undefined;
    } | undefined;
    waitForTimeout?: number | undefined;
    bestAttempt?: boolean | undefined;
    debugOpts?: {
        html?: boolean | undefined;
        cookies?: boolean | undefined;
        console?: boolean | undefined;
        network?: boolean | undefined;
        screenshot?: boolean | undefined;
    } | undefined;
}>;
export type ScrapeRequest = z.infer<typeof ScrapeRequestSchema>;
export declare const PerformanceRequestSchema: z.ZodObject<{
    url: z.ZodString;
    config: z.ZodOptional<z.ZodObject<{
        extends: z.ZodOptional<z.ZodString>;
        settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        extends?: string | undefined;
        settings?: Record<string, any> | undefined;
    }, {
        extends?: string | undefined;
        settings?: Record<string, any> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    config?: {
        extends?: string | undefined;
        settings?: Record<string, any> | undefined;
    } | undefined;
}, {
    url: string;
    config?: {
        extends?: string | undefined;
        settings?: Record<string, any> | undefined;
    } | undefined;
}>;
export type PerformanceRequest = z.infer<typeof PerformanceRequestSchema>;
export declare const WebSocketOptionsSchema: z.ZodObject<{
    browser: z.ZodDefault<z.ZodEnum<["chromium", "firefox", "webkit"]>>;
    library: z.ZodDefault<z.ZodEnum<["puppeteer", "playwright"]>>;
    blockAds: z.ZodOptional<z.ZodBoolean>;
    launch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    browser: "chromium" | "firefox" | "webkit";
    library: "puppeteer" | "playwright";
    blockAds?: boolean | undefined;
    launch?: Record<string, any> | undefined;
}, {
    browser?: "chromium" | "firefox" | "webkit" | undefined;
    library?: "puppeteer" | "playwright" | undefined;
    blockAds?: boolean | undefined;
    launch?: Record<string, any> | undefined;
}>;
export type WebSocketOptions = z.infer<typeof WebSocketOptionsSchema>;
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
export interface FunctionResponse {
    contentType: string;
    data: string;
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
export interface MetaResponse {
    version: string;
    chromium: string | null;
    firefox: string | null;
    webkit: string | null;
    puppeteer: string[];
    playwright: string[];
}
export interface HealthResponse {
    status: 'healthy' | 'unhealthy';
    active: boolean;
    meta?: MetaResponse;
}
//# sourceMappingURL=types.d.ts.map