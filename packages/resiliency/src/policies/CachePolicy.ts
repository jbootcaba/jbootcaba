import { AxiosRequestConfig, AxiosResponse } from "axios";
import lodash from "lodash";

type CacheResponse = {
	data: any;
	status: number;
	statusText: string;
	headers: any;
};

export type ICacheProvider = {
	delete(key: string): Promise<void>;
	get<T>(key: string): Promise<T | undefined>;
	add<T>(key: string, data: T, duration: number): Promise<void>;
};

export interface CacheConfig {
	/**
	 * http status able to cache
	 * Default: [200, 201]
	 **/
	status: Array<number>;
	/**
	 * Time to live of cached data in seconds
	 * Default: 15 Sec
	 **/
	durantion: number;
	/**
	 * http methods able to cache
	 * Default: [GET]
	 **/
	methods: Array<string>;
	/**
	 * Bypass previous cached request
	 * Default: false
	 **/
	ignoreCache: () => boolean | boolean;
	/**
	 * Cache provider
	 **/
	provider: ICacheProvider;
}

export type AxiosRequestCacheConfig = CacheConfig & {
	/**
	 * Extra condition to save request on cache.
	 **/
	cacheIf(res: AxiosResponse): boolean;
	/**
	 * force cache invalidation
	 */
	clearCacheEntry: boolean;
	/**
	 * custom build key
	 */
	getKey(config: AxiosRequestConfig): string;
};

type Executor = (
	config: AxiosRequestConfig
) => AxiosResponse | Promise<AxiosResponse>;
export class CachePolicy {
	constructor(
		private provider: ICacheProvider,
		private readonly cacheConfig: Partial<CacheConfig>
	) {}
	safeParseJson(json: string): unknown | boolean {
		try {
			return JSON.parse(json);
		} catch (e) {
			return false;
		}
	}

	async execute(
		config: AxiosRequestConfig,
		executor: Executor
	): Promise<AxiosResponse> {
		const cacheConfig: AxiosRequestCacheConfig = lodash.merge<any, any, any>(
			{
				getKey: this.getKey,
			},
			this.cacheConfig,
			config.cache
		);
		let ignoreCache = false;
		if (
			cacheConfig.ignoreCache &&
			typeof cacheConfig.ignoreCache === "function"
		)
			ignoreCache = cacheConfig.ignoreCache();
		if (cacheConfig.ignoreCache && typeof cacheConfig.ignoreCache === "boolean")
			ignoreCache = cacheConfig.ignoreCache;
		const key = cacheConfig.getKey(config);
		const allowedMethod = cacheConfig.methods.some(
			(it) => it.toUpperCase() === config.method?.toUpperCase()
		);

		if (allowedMethod && cacheConfig.clearCacheEntry)
			await this.provider.delete(key);

		if (allowedMethod && !ignoreCache && !cacheConfig.clearCacheEntry) {
			const cachedResponse = await this.provider.get<CacheResponse>(key);
			if (cachedResponse) {
				return {
					...cachedResponse,
					config: config,
					request: { ...config, fromCache: true },
				};
			}
		}

		const data = await executor(config);

		const allowedStatus = cacheConfig.status.includes(data.status);
		const jsonResponse =
			!data.isFallback &&
			data.headers["content-type"]?.includes("application/json") &&
			typeof data.data === "string";
		if (jsonResponse) {
			const json = this.safeParseJson(data.data);
			data.data = json ? json : data.data;
		}
		cacheConfig.cacheIf = cacheConfig.cacheIf || (() => true);
		if (
			!data.isFallback &&
			allowedMethod &&
			allowedStatus &&
			cacheConfig.cacheIf(data)
		) {
			const duration = cacheConfig.durantion;
			this.provider.add<CacheResponse>(
				key,
				{
					status: data.status,
					statusText: data.statusText,
					data: data.data,
					headers: data.headers,
				},
				duration
			);
		}
		return data;
	}

	private getKey(config: AxiosRequestConfig): string {
		const params = config.params ? JSON.stringify(config.params) : "";
		return `${config?.method || ""}${config.url}${params}`;
	}
}
export const createCachePolicy = (
	config: Partial<CacheConfig>
): CachePolicy | undefined => {
	if (config.provider) {
		return new CachePolicy(config.provider, config);
	}
	return undefined;
};
