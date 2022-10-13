import { IPolicy } from "cockatiel";
import { PartialDeep } from "type-fest";
import { AxiosRequestCacheConfig } from "./policies/CachePolicy";
import { FallbackOptions } from "./policies/FallbackPolicy";

declare module "axios" {
	interface AxiosResponse {
		isFallback?: boolean;
	}
	interface AxiosRequestConfig {
		fallback?: FallbackOptions;
		cache?: PartialDeep<AxiosRequestCacheConfig>;
		policy?: IPolicy;
		anonymous?: boolean;
		startTime?: number;
	}
}
