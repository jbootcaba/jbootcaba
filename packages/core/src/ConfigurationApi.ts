export interface IConfigurationStore<T> {
	Get(): T;
	OnUpdate(event: (config: T) => void): void;
}
