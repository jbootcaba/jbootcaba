import { BaseConfiguration, IConfigurationProvider, PromiseProvider, IWatcherStrategy, PromiseWatcher } from "@jbootcaba/config";
import { ILogger, ILoggerAdapter } from "@jbootcaba/logger";
import Joi from "joi";
import { Container } from "inversify";
export declare type ServiceConfigureFunc<T = any> = (container: Container) => Promise<T>;
export declare type LoggerFactory = (parent: string) => ILogger;
export declare class StartupBuilder<T extends BaseConfiguration> {
    private schema;
    private adapterBuilder;
    private configureServices;
    private constructor();
    private configProviders;
    private configWatchers;
    static Given<T extends BaseConfiguration>(schema: Joi.ObjectSchema<T>, c?: (config?: T) => ILoggerAdapter): StartupBuilder<T>;
    WithConfigureServices(func: ServiceConfigureFunc): StartupBuilder<T>;
    WithConfigProvider(provider: IConfigurationProvider): StartupBuilder<T>;
    WithConfigProvider(provider: PromiseProvider<T>): StartupBuilder<T>;
    WithConfigWatcher(watcher: IWatcherStrategy): StartupBuilder<T>;
    WithConfigWatcher(watcher: PromiseWatcher<T>): StartupBuilder<T>;
    private SetupConfig;
    Configure(): Promise<Container>;
    Run<T>(run: ServiceConfigureFunc<T>): Promise<T>;
}
//# sourceMappingURL=StartupBuilder.d.ts.map