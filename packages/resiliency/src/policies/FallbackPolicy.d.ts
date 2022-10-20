import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IPolicy, IDefaultPolicyContext } from "cockatiel";
export declare type FallbackOptions = {
    status?: Array<number>;
    data: Required<any>;
    whenResult?: (response: AxiosResponse) => boolean;
};
export declare type FallbackConfig = {
    data: any;
    status: Array<number>;
    whenResult: (response: AxiosResponse) => boolean;
};
export declare const createFallbackPolicy: (c: AxiosRequestConfig, defaultConfig: FallbackConfig, policy: IPolicy) => IPolicy<IDefaultPolicyContext, AxiosResponse>;
//# sourceMappingURL=FallbackPolicy.d.ts.map