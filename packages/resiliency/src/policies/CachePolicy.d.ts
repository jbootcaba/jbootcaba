import { AxiosRequestConfig, AxiosResponse } from "axios";
export declare type ICacheProvider = {
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
export declare type AxiosRequestCacheConfig = CacheConfig & {
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
declare type Executor = (config: AxiosRequestConfig) => AxiosResponse | Promise<AxiosResponse>;
export declare class CachePolicy {
    private provider;
    private readonly cacheConfig;
    constructor(provider: ICacheProvider, cacheConfig: Partial<CacheConfig>);
    safeParseJson(json: string): unknown | boolean;
    execute(config: AxiosRequestConfig, executor: Executor): Promise<AxiosResponse>;
    private getKey;
}
export declare const createCachePolicy: (config: Partial<CacheConfig>) => CachePolicy | undefined;
export {};
//# sourceMappingURL=CachePolicy.d.ts.map