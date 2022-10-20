import { ILogger } from "@jbootcaba/core";
export interface TimeoutConfig {
    globalDuration: number;
    requestDuration: number;
}
export declare const timeoutPolicy: (config: TimeoutConfig, logger: ILogger) => import("cockatiel").TimeoutPolicy;
//# sourceMappingURL=TimeoutPolicy.d.ts.map