import { AxiosRequestConfig, AxiosResponse } from "axios";
import { createFallbackPolicy } from "./policies/FallbackPolicy";
import httpAdapter from "axios/lib/adapters/http";
import { defaultConfig } from "./DefaultConfig";
import { CachePolicy } from "./policies/CachePolicy";
import { IPolicy } from "cockatiel";

type Adapter = (c: AxiosRequestConfig) => Promise<any>;
export const BuildResiliencyAdapter = (
	p: IPolicy,
	cachePolicy: CachePolicy | undefined
): Adapter => {
	return (c: AxiosRequestConfig): Promise<any> => {
		const policy = createFallbackPolicy(
			c,
			defaultConfig.fallback,
			c.policy || p
		);
		if (cachePolicy) {
			return cachePolicy.execute(c, () =>
				policy.execute((): Promise<AxiosResponse> => httpAdapter(c))
			);
		} else {
			return policy.execute((): Promise<AxiosResponse> => httpAdapter(c));
		}
	};
};
