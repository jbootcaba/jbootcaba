import { ILogger } from "@jbootcaba/core";
import {
	fullJitterGenerator,
	ExponentialBackoff,
	Policy,
	retry,
} from "cockatiel";

export interface RetryConfig {
	attempts: number;
}

export const retryPolicy = (
	handlerResults: Policy,
	config: RetryConfig,
	logger: ILogger
) => {
	const retryPolicy = retry(handlerResults, {
		maxAttempts: config.attempts,
		backoff: new ExponentialBackoff({ generator: fullJitterGenerator }),
	});
	retryPolicy.onGiveUp((data: any) => {
		logger.error(
			"REQ GIVEUP %s:%s %s",
			data.error?.config?.method?.toUpperCase(),
			data.error?.response?.status,
			data.error?.config?.url
		);
	});
	retryPolicy.onRetry((data: any) => {
		logger.warn(
			"RETRYING AFTER RESP END %s",
			data.error?.message || data.value?.status
		);
	});
	return retryPolicy;
};
