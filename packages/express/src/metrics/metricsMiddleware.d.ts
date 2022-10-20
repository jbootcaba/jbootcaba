/// <reference types="qs" />
/// <reference types="express" />
import { MetricsConfiguration } from "./metrics";
export declare const expressMetrics: (config: MetricsConfiguration) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=metricsMiddleware.d.ts.map