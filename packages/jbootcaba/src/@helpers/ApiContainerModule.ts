import { container, LoggerFactory, TYPES } from "@jbootcaba/inversify";
import { Api, IInterceptor, LoggerInterceptor } from "@jbootcaba/http";
import { CreateResiliencyConfig, PolicyConfig } from "@jbootcaba/resiliency";
import { interfaces, AsyncContainerModule } from "inversify";
import https from "https";
import { PartialDeep } from "type-fest";

const resiliencyConfig = {
	cache: {
		duration: 60 * 60 * 1, // 1 hora de cache
	},
	timeout: {
		globalDuration: 5000,
		requestDuration: 2000,
	},
	retry: {
		attempts: 3,
	},
	circuitBreaker: {},
	bulkhead: {},
	fallback: {},
};
type ApiConfig = {
	identifier: symbol;
	endpoint: string;
	resiliency?: PartialDeep<PolicyConfig>;
	interceptors?: Array<IInterceptor>;
	agent?: https.Agent;
};
export const ApiContainerModule = (config: ApiConfig): AsyncContainerModule => {
	return new AsyncContainerModule(async (bind: interfaces.Bind) => {
		const logManager = container.get<LoggerFactory>(TYPES.LoggerFactory);
		const apiLogger = logManager(
			config.identifier.description ?? config.identifier.toString()
		);
		let apiConfig: any = {
			baseURL: config.endpoint,
			httpsAgent: config.agent,
			validateStatus: (status: number) => status !== 401 && status !== 403,
		};
		apiConfig = CreateResiliencyConfig(apiLogger, {
			...apiConfig,
			resiliency: Object.assign(config.resiliency || {}, resiliencyConfig),
		});

		const api = new Api(
			apiConfig,
			new LoggerInterceptor(apiLogger),
			...(config.interceptors || [])
		);
		bind<Api>(config.identifier).toConstantValue(api);
	});
};
