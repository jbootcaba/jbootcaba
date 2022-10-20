/// <reference types="node" />
import { IInterceptor } from "@jbootcaba/http";
import { PolicyConfig } from "@jbootcaba/resiliency";
import { AsyncContainerModule } from "inversify";
import https from "https";
import { PartialDeep } from "type-fest";
declare type ApiConfig = {
    identifier: symbol;
    endpoint: string;
    resiliency?: PartialDeep<PolicyConfig>;
    interceptors?: Array<IInterceptor>;
    agent?: https.Agent;
};
export declare const ApiContainerModule: (config: ApiConfig) => AsyncContainerModule;
export {};
//# sourceMappingURL=ApiContainerModule.d.ts.map