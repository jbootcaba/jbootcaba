import { LoggerOptions } from "pino";

export type LoggerPinoConfig = LoggerOptions & {
	pretty?: boolean;
};

export type PinoElasticSearchConfig = LoggerPinoConfig & {
	SERVER_ADDRESS: string;
	INDEX: string;
	CONSISTENCY: string;
};
