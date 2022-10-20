import { AxiosRequestConfig } from "axios";
import { CachePolicy } from "./policies/CachePolicy";
import { IPolicy } from "cockatiel";
declare type Adapter = (c: AxiosRequestConfig) => Promise<any>;
export declare const BuildResiliencyAdapter: (p: IPolicy, cachePolicy: CachePolicy | undefined) => Adapter;
export {};
//# sourceMappingURL=AxiosAdapter.d.ts.map