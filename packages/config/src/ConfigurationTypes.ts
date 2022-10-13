import { IConfigurationStore } from "@jbootcaba/core";
import Joi from "joi";

export const UrlPattern = () =>
	Joi.string()
		.uri({ scheme: ["http", "https"] })
		.regex(/\w$/)
		.messages({
			"string.pattern.base": "{#label} não deve finalizar com '/'",
		});

export type KeyValue = Record<string, any>;
export interface IConfigurationProvider {
	Load(config: KeyValue): Promise<KeyValue>;
}
export interface IConfigurationBuilded {
	Get<T>(schema: Joi.ObjectSchema<T>): T;
	Get(): KeyValue;
}

export interface IWatcherStrategy {
	Watch(valuesCallback: (values: KeyValue) => void): Promise<void>;
}

export type PromiseProvider<T> = (
	configs: Partial<T>
) => Promise<IConfigurationProvider>;

export type PromiseWatcher<T> = (
	configs: Partial<T>
) => Promise<IWatcherStrategy>;
export interface IConfigurationBuilder<T> {
	Load(): Promise<IConfigurationStore<T>>;
	AddProvider(provider: IConfigurationProvider): IConfigurationBuilder<T>;
	AddProvider(provider: PromiseProvider<T>): IConfigurationBuilder<T>;
	AddWatcher(watcher: IWatcherStrategy): IConfigurationBuilder<T>;
	AddWatcher(watcher: PromiseWatcher<T>): IConfigurationBuilder<T>;
}
