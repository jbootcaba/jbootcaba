import Joi from "joi";
import { IConfigurationProvider, IWatcherStrategy, PromiseProvider, PromiseWatcher, IConfigurationBuilder } from "./ConfigurationTypes";
import { BaseConfiguration } from ".";
import { IConfigurationStore } from "@jbootcaba/core";
import { ILogger } from "@jbootcaba/core";
export declare class ConfigurationBuilder<T extends BaseConfiguration> implements IConfigurationBuilder<T>, IConfigurationStore<T> {
    private readonly schema;
    private readonly logger;
    private constructor();
    static Builder<T extends BaseConfiguration>(schema: Joi.ObjectSchema<T>, logger: ILogger): IConfigurationBuilder<T>;
    private _config;
    private _providers;
    private _watchers;
    private _listeners;
    AddProvider(provider: PromiseProvider<T> | IConfigurationProvider): IConfigurationBuilder<T>;
    private CallListener;
    OnUpdate(eventListener: (config: T) => void): void;
    private UpdateConfig;
    NotifyListeners(): void;
    AddWatcher(watcher: IWatcherStrategy | PromiseWatcher<T>): IConfigurationBuilder<T>;
    Get(): T;
    Load(): Promise<IConfigurationStore<T>>;
}
//# sourceMappingURL=ConfigurationManager.d.ts.map