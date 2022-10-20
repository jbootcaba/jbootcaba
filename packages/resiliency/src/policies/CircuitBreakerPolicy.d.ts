import { ILogger } from "@jbootcaba/core";
import { Policy } from "cockatiel";
export interface CircuitBreakerConfig {
    halfOpenAfter: number;
    threshold: number;
    duration: number;
    minimumRps: number;
}
export declare const circuitBreakerPolicy: (handlerResults: Policy, config: CircuitBreakerConfig, logger: ILogger) => import("cockatiel").CircuitBreakerPolicy;
//# sourceMappingURL=CircuitBreakerPolicy.d.ts.map