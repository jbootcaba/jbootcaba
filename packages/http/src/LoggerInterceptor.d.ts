import { ILogger } from "@jbootcaba/core";
import { AxiosInstance } from "axios";
import { IInterceptor } from "./IInterceptor";
export declare class LoggerInterceptor implements IInterceptor {
    private logger;
    /**
     *
     */
    constructor(logger: ILogger);
    register(axios: AxiosInstance): void;
    private OnRequestFulfilledLogger;
    safeParseJson(json: any): string;
    private OnResponseErrorLogger;
    private OnResponseFulfilledLogger;
    private OnRequestErrorLogger;
}
//# sourceMappingURL=LoggerInterceptor.d.ts.map