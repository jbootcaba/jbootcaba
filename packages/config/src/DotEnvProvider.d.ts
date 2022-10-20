import { IConfigurationProvider, KeyValue } from "./ConfigurationTypes";
export declare class DotEnvProvider implements IConfigurationProvider {
    Load(configs: KeyValue): Promise<KeyValue>;
    static New(): IConfigurationProvider;
}
//# sourceMappingURL=DotEnvProvider.d.ts.map