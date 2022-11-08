import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IPolicy, handleWhenResult, bulkhead, wrap } from "cockatiel";
import { PartialDeep } from "type-fest";
import lodash from "lodash";
import { ILogger } from "@jbootcaba/core";
import { circuitBreakerPolicy } from "./policies/CircuitBreakerPolicy";
import { retryPolicy } from "./policies/RetryPolicy";
import { timeoutPolicy } from "./policies/TimeoutPolicy";
import { CachePolicy, createCachePolicy } from "./policies/CachePolicy";
import { defaultConfig, PolicyConfig } from "./DefaultConfig";
import { BuildResiliencyAdapter } from "./AxiosAdapter";

export type AxiosResiliencyConfig = AxiosRequestConfig & {
	resiliency?: PartialDeep<PolicyConfig>;
	cachePolicy?: CachePolicy;
};

export const CreateResiliencyConfig = (
	logger: ILogger,
	config?: Partial<AxiosResiliencyConfig>
): AxiosResiliencyConfig => {
	const finalConfig: PolicyConfig = lodash.merge<any, any, any>(
		{},
		defaultConfig,
		config?.resiliency
	);
	const cachePolicy = createCachePolicy(finalConfig.cache);
	const policy = config?.policy || resiliencyPolicyBuild(logger, finalConfig);
	const adapter = BuildResiliencyAdapter(policy, cachePolicy);
	return {
		...config,
		adapter,
		timeout: finalConfig.timeout.requestDuration,
	};
};

const resiliencyPolicyBuild = (
	logger: ILogger,
	finalConfig: PolicyConfig
): IPolicy => {
	const func = (it: AxiosResponse) =>
		finalConfig.handleWhenStatus.includes(it.status);
	const func2 = (err: AxiosError) => {
		return (
			["ECONNABORTED", "ECONNREFUSED"].includes(err.code ?? "") ||
			finalConfig.handleWhenStatus.includes(err.response?.status || 0)
		);
	};
	const handlerResults = handleWhenResult(<any>func).orWhen(<any>func2);

	const breaker = circuitBreakerPolicy(
		handlerResults,
		finalConfig.circuitBreaker,
		logger
	);
	const retry = retryPolicy(handlerResults, finalConfig.retry, logger);
	const timeout = timeoutPolicy(finalConfig.timeout, logger);

	const bulkheadPolicy = bulkhead(
		finalConfig.bulkhead.limitParallelRequest,
		finalConfig.bulkhead.queueSize
	);
	bulkheadPolicy.onReject((data) => console.log(data));
	bulkheadPolicy.onFailure((data) => console.log(data));
	return wrap(timeout, retry, breaker, bulkheadPolicy);
};
