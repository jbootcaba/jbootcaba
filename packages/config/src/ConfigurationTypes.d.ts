import { IConfigurationStore } from "@jbootcaba/core";
import Joi from "joi";
export declare const UrlPattern: () => Joi.StringSchema<string>;
export declare type KeyValue = Record<string, any>;
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
export declare type PromiseProvider<T> = (configs: Partial<T>) => Promise<IConfigurationProvider>;
export declare type PromiseWatcher<T> = (configs: Partial<T>) => Promise<IWatcherStrategy>;
export interface IConfigurationBuilder<T> {
    Load(): Promise<IConfigurationStore<T>>;
    AddProvider(provider: IConfigurationProvider): IConfigurationBuilder<T>;
    AddProvider(provider: PromiseProvider<T>): IConfigurationBuilder<T>;
    AddWatcher(watcher: IWatcherStrategy): IConfigurationBuilder<T>;
    AddWatcher(watcher: PromiseWatcher<T>): IConfigurationBuilder<T>;
}
//# sourceMappingURL=ConfigurationTypes.d.ts.map