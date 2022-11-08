import {
	BaseConfiguration,
	IConfigurationProvider,
	PromiseProvider,
	IWatcherStrategy,
	PromiseWatcher,
	ConfigurationBuilder,
	DotEnvProvider,
	IConfigurationBuilder,
} from "@config";
import { ILogger, LoggerManager, ILoggerAdapter } from "@jbootcaba/logger";
import { TYPES } from "./TYPES";
import { container } from "./Container";
import Joi from "joi";
import { PinoAdapterBuilder } from "@jbootcaba/pino";
import { Container } from "inversify";
export type ServiceConfigureFunc<T = any> = (
	container: Container
) => Promise<T>;

export type LoggerFactory = (parent: string) => ILogger;
export class StartupBuilder<T extends BaseConfiguration> {
	private configureServices: ServiceConfigureFunc = () => Promise.resolve();
	private constructor(
		private schema: Joi.ObjectSchema<T>,
		private adapterBuilder: (config?: T) => ILoggerAdapter
	) {}

	private configProviders: IConfigurationProvider[] = [];
	private configWatchers: IWatcherStrategy[] = [];

	public static Given<T extends BaseConfiguration>(
		schema: Joi.ObjectSchema<T>,
		c?: (config?: T) => ILoggerAdapter
	): StartupBuilder<T> {
		return new StartupBuilder<T>(schema, c || PinoAdapterBuilder);
	}

	WithConfigureServices(func: ServiceConfigureFunc): StartupBuilder<T> {
		this.configureServices = func;
		return this;
	}

	WithConfigProvider(provider: IConfigurationProvider): StartupBuilder<T>;
	WithConfigProvider(provider: PromiseProvider<T>): StartupBuilder<T>;
	WithConfigProvider(provider: any): StartupBuilder<T> {
		this.configProviders.push(provider);
		return this;
	}

	WithConfigWatcher(watcher: IWatcherStrategy): StartupBuilder<T>;
	WithConfigWatcher(watcher: PromiseWatcher<T>): StartupBuilder<T>;
	WithConfigWatcher(watcher: any): StartupBuilder<T> {
		this.configWatchers.push(watcher);
		return this;
	}

	private async SetupConfig(
		loggerManager: LoggerManager
	): Promise<IConfigurationBuilder<T>> {
		const builder = ConfigurationBuilder.Builder<T>(
			this.schema,
			loggerManager.Get("CONFIGURATION")
		);
		builder.AddProvider(DotEnvProvider.New());
		this.configProviders.forEach((it) => builder.AddProvider(it));
		this.configWatchers.forEach((it) => builder.AddWatcher(it));
		return builder;
	}
	async Configure(): Promise<Container> {
		const logManager = new LoggerManager(this.adapterBuilder());
		const configurationBuilder = await this.SetupConfig(logManager);
		const store = await configurationBuilder.Load();
		logManager.ChangeAdapter(this.adapterBuilder(store.Get()));
		store.OnUpdate((config) => {
			logManager.ChangeLevel(config.LOG_LEVEL);
		});
		container.bind(TYPES.Configuration).toDynamicValue(() => store.Get());
		container.bind<LoggerManager>(LoggerManager).toConstantValue(logManager);

		container
			.bind<LoggerFactory>(TYPES.LoggerFactory)
			.toFactory<ILogger, [string]>(
				() => (scope: string) => logManager.Get(scope)
			);
		container
			.bind<ILoggerAdapter>(TYPES.LOGGER_ADAPTER)
			.toDynamicValue(() => logManager.adapter);

		container.bind<ILogger>(TYPES.LOGGER).toDynamicValue((context) => {
			if (!context.currentRequest.parentRequest)
				throw Error("DON`T HAVE CONTEXT");
			const service =
				context.currentRequest.parentRequest.target.serviceIdentifier;
			const ctx = (service["name"] || service).toUpperCase();
			return context.container.get<LoggerFactory>(TYPES.LoggerFactory)(ctx);
		});
		const log = logManager.Get("STARTUP");
		try {
			await this.configureServices(container);
		} catch (error) {
			log.error("ERROR TO REGISTER SERVICES %s", error);
		}
		return container;
	}
	async Run<T>(run: ServiceConfigureFunc<T>): Promise<T> {
		const container = await this.Configure();
		const logManager = container.get<LoggerManager>(LoggerManager);
		const log = logManager.Get("STARTUP");
		try {
			log.info("STARTUP .....");
			const _run = await run(container);
			return _run;
		} catch (error) {
			log.error("STARTUP FAIL %s", error);
			throw error;
		}
	}
}
