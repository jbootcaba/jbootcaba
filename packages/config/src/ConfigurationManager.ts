import Joi from "joi";
import lodash from "lodash";
import {
	KeyValue,
	IConfigurationProvider,
	IWatcherStrategy,
	PromiseProvider,
	PromiseWatcher,
	IConfigurationBuilder,
} from "./ConfigurationTypes";
import { BaseConfiguration } from ".";
import { IConfigurationStore } from "@jbootcaba/core";
import { ILogger } from "@jbootcaba/core";

export class ConfigurationBuilder<T extends BaseConfiguration>
	implements IConfigurationBuilder<T>, IConfigurationStore<T>
{
	private constructor(
		private readonly schema: Joi.ObjectSchema<T>,
		private readonly logger: ILogger
	) {}

	public static Builder<T extends BaseConfiguration>(
		schema: Joi.ObjectSchema<T>,
		logger: ILogger
	): IConfigurationBuilder<T> {
		return new ConfigurationBuilder<T>(schema, logger);
	}

	private _config!: T;
	private _providers: PromiseProvider<T>[] = [];
	private _watchers: PromiseWatcher<T>[] = [];
	private _listeners: Array<(config: T) => void> = [];

	public AddProvider(
		provider: PromiseProvider<T> | IConfigurationProvider
	): IConfigurationBuilder<T> {
		if (typeof provider === "function") this._providers.push(provider);
		else this._providers.push(() => Promise.resolve(provider));
		return this;
	}

	private CallListener(listener: (config: T) => void) {
		try {
			listener(this._config);
		} catch (error) {
			this.logger.error(
				"Error on call configuration event listener, Erros: \r\n%s",
				error
			);
		}
	}

	OnUpdate(eventListener: (config: T) => void): void {
		this._listeners.push(eventListener);
	}

	private UpdateConfig(values: KeyValue): void {
		this.logger.info("Configuration Updating");
		const schema = {};
		for (const key in values) {
			const s = this.schema.extract(key);
			schema[key] = s;
		}
		const validation = Joi.object(schema)
			.unknown(false)
			.options({
				abortEarly: false,
				stripUnknown: { arrays: false, objects: true },
			})
			.validate(values, {
				convert: true,
			});
		if (validation.error) {
			const errors = validation.error.details
				.map((it) => it.message)
				.join("\r\n");
			this.logger.warn("Configuration can`t be updated, Erros: \r\n%s", errors);
			return;
		}
		for (const key in values) {
			this._config[key] = validation.value[key];
		}
		this.NotifyListeners();
		this.logger.info("Configuration Updated");
	}
	NotifyListeners() {
		for (const iterator of this._listeners) {
			this.CallListener(iterator);
		}
	}

	AddWatcher(
		watcher: IWatcherStrategy | PromiseWatcher<T>
	): IConfigurationBuilder<T> {
		if (typeof watcher === "function") this._watchers.push(watcher);
		else this._watchers.push(() => Promise.resolve(watcher));
		return this;
	}

	Get(): T {
		return this._config;
	}

	async Load(): Promise<IConfigurationStore<T>> {
		this.logger.info("Configuration loading");
		let config: Partial<T> = {};
		for await (const setting of this._providers) {
			const provider = await setting(config);
			const values = await provider.Load(config);
			config = lodash.merge(config, values);
		}

		const validation = this.schema.validate(config, {
			convert: true,
		});
		if (validation.error) {
			const errors = validation.error.details
				.map((it) => it.message)
				.join("\r\n");
			this.logger.error("Configuration can`t be loaded, Erros: \r\n%s", errors);
			throw Error("Configuration can`t be loaded");
		}
		this._config = validation.value;

		for await (const promiseWatch of this._watchers) {
			const watcher = await promiseWatch(config);
			watcher.Watch(this.UpdateConfig.bind(this));
		}
		this.NotifyListeners();
		this.logger.info("Configuration loaded");
		return this;
	}
}
