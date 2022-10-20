import { ILogger } from "@jbootcaba/core";
import { Policy } from "cockatiel";
export interface RetryConfig {
    attempts: number;
}
export declare const retryPolicy: (handlerResults: Policy, config: RetryConfig, logger: ILogger) => import("cockatiel").RetryPolicy;
//# sourceMappingURL=RetryPolicy.d.ts.map