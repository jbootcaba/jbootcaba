import { FallbackConfig } from "./policies/FallbackPolicy";
import { CircuitBreakerConfig } from "./policies/CircuitBreakerPolicy";
import { RetryConfig } from "./policies/RetryPolicy";
import { TimeoutConfig } from "./policies/TimeoutPolicy";
import { CacheConfig } from "./policies/CachePolicy";
export declare enum HttpStatusCode {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    RequestTimeout = 408,
    InternalServerError = 500,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504
}
export declare type PolicyConfig = {
    handleWhenStatus: HttpStatusCode[];
    timeout: TimeoutConfig;
    circuitBreaker: CircuitBreakerConfig;
    retry: RetryConfig;
    bulkhead: BulkheadConfig;
    fallback: FallbackConfig;
    cache: Partial<CacheConfig>;
};
export interface BulkheadConfig {
    queueSize: number;
    limitParallelRequest: number;
}
export declare const retryStatus: HttpStatusCode[];
export declare const defaultConfig: PolicyConfig;
//# sourceMappingURL=DefaultConfig.d.ts.map