import * as dotenv from "dotenv";
import { IConfigurationProvider, KeyValue } from "./ConfigurationTypes";

export class DotEnvProvider implements IConfigurationProvider {
	Load(configs: KeyValue): Promise<KeyValue> {
		dotenv.config();
		return Promise.resolve(process.env);
	}
	static New(): IConfigurationProvider {
		return new DotEnvProvider();
	}
}
