import { ILogger } from "@jbootcaba/core";
import { SamplingBreaker, circuitBreaker, Policy } from "cockatiel";
export interface CircuitBreakerConfig {
	halfOpenAfter: number;
	threshold: number;
	duration: number;
	minimumRps: number;
}

export const circuitBreakerPolicy = (
	handlerResults: Policy,
	config: CircuitBreakerConfig,
	logger: ILogger
) => {
	const breaker = circuitBreaker(handlerResults, {
		halfOpenAfter: config.halfOpenAfter,
		breaker: new SamplingBreaker(config),
	});
	breaker.onBreak(() => {
		logger.error(
			"Circuit Breaker Open after %s percent of failures in %s seconds. This is going half close after %s seconds.",
			config.threshold * 100,
			config.duration / 1000,
			config.halfOpenAfter / 1000
		);
	});
	breaker.onReset(() => {
		logger.warn(
			"Circuit Breaker Reseted and full closed. Traffic reestablished."
		);
	});
	breaker.onHalfOpen(() => {
		logger.warn(
			"Circuit Breaker Half Open after %s seconds",
			config.halfOpenAfter / 1000
		);
	});
	return breaker;
};
