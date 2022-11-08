import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
	IPolicy,
	BrokenCircuitError,
	TaskCancelledError,
	BulkheadRejectedError,
	IsolatedCircuitError,
	handleWhenResult,
	IDefaultPolicyContext,
	fallback as Fallback,
	wrap,
	noop,
} from "cockatiel";
import lodash from "lodash";

export type FallbackOptions = {
	status?: Array<number>;
	data: Required<any>;
	whenResult?: (response: AxiosResponse) => boolean;
};

export type FallbackConfig = {
	data: any;
	status: Array<number>;
	whenResult: (response: AxiosResponse) => boolean;
};

export const createFallbackPolicy = (
	c: AxiosRequestConfig,
	defaultConfig: FallbackConfig,
	policy: IPolicy
): IPolicy<IDefaultPolicyContext, AxiosResponse> => {
	const fallback: FallbackConfig = lodash.merge<FallbackConfig, any>(
		defaultConfig,
		c.fallback
	);
	if (fallback.data) {
		const fallbackResult: AxiosResponse = {
			data: fallback.data,
			status: 200,
			statusText: "200",
			config: c,
			isFallback: true,
			headers: {},
			request: c,
		};
		const func = (it: AxiosResponse) => fallback.status.includes(it.status);
		const defaultFaultBackPolicy = handleWhenResult(<any>func)
			.orWhenResult(<any>fallback.whenResult)
			.orType<BrokenCircuitError>(BrokenCircuitError)
			.orType<IsolatedCircuitError>(IsolatedCircuitError)
			.orType<TaskCancelledError>(TaskCancelledError)
			.orType<BulkheadRejectedError>(BulkheadRejectedError);
		const fallbackPolicy = Fallback(defaultFaultBackPolicy, () => {
			return fallbackResult;
		});
		if (policy) return wrap(fallbackPolicy, policy);
		return wrap(fallbackPolicy);
	}
	if (policy) return policy;
	return noop;
};
