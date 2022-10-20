import { AxiosRequestConfig } from "axios";
import { PartialDeep } from "type-fest";
import { ILogger } from "@jbootcaba/core";
import { CachePolicy } from "./policies/CachePolicy";
import { PolicyConfig } from "./DefaultConfig";
export declare type AxiosResiliencyConfig = AxiosRequestConfig & {
    resiliency?: PartialDeep<PolicyConfig>;
    cachePolicy?: CachePolicy;
};
export declare const CreateResiliencyConfig: (logger: ILogger, config?: Partial<AxiosResiliencyConfig>) => AxiosResiliencyConfig;
//# sourceMappingURL=ResiliencyPolicy.d.ts.map