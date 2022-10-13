export interface ICacheProvider {
	/**
	 * @key - the string identifier for the resource you want to store
	 * @data
	 * @ttl - the maximum amount of time you want the resource stored in milliseconds
	 */
	add<T>(key: string, data: T, ttl: number): Promise<void>;
	get<T>(key: string): Promise<T | undefined>;
	delete(key: string): Promise<void>;
}
