import { FallbackConfig } from "./policies/FallbackPolicy";
import { CircuitBreakerConfig } from "./policies/CircuitBreakerPolicy";
import { RetryConfig } from "./policies/RetryPolicy";
import { TimeoutConfig } from "./policies/TimeoutPolicy";
import { CacheConfig } from "./policies/CachePolicy";

export enum HttpStatusCode {
	Ok = 200,
	NotFound = 404,
	BadRequest = 400,
	RequestTimeout = 408,
	InternalServerError = 500,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeout = 504,
}

export type PolicyConfig = {
	handleWhenStatus: HttpStatusCode[];
	timeout: TimeoutConfig;
	circuitBreaker: CircuitBreakerConfig;
	retry: RetryConfig;
	bulkhead: BulkheadConfig;
	fallback: FallbackConfig;
	cache: Partial<CacheConfig>;
};

export interface BulkheadConfig {
	queueSize: number;
	limitParallelRequest: number;
}

export const retryStatus = [
	HttpStatusCode.BadGateway,
	HttpStatusCode.GatewayTimeout,
	HttpStatusCode.InternalServerError,
	HttpStatusCode.RequestTimeout,
	HttpStatusCode.ServiceUnavailable,
];

export const defaultConfig: PolicyConfig = {
	handleWhenStatus: retryStatus,
	timeout: {
		globalDuration: 5 * 1000, //5 Seg
		requestDuration: 2 * 1000, //2 seg
	},
	circuitBreaker: {
		halfOpenAfter: 30 * 1000, // 30 seg para abrir metade
		threshold: 25 / 100, // 25% de falha
		duration: 60 * 1000, // em 1 min
		minimumRps: 1,
	},
	retry: {
		attempts: 3,
	},
	bulkhead: {
		queueSize: 10,
		limitParallelRequest: 10,
	},
	fallback: {
		status: retryStatus,
		whenResult: () => false,
		data: undefined,
	},
	cache: {
		durantion: 15,
		status: [200, 201],
		methods: ["GET"],
		ignoreCache: () => false,
	},
};
