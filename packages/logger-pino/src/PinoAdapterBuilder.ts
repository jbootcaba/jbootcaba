import { LogLevel, ILoggerAdapter } from "@jbootcaba/logger";
import pinoElastic from "pino-elasticsearch";
import pino from "pino";
import { PinoAdapter } from "./PinoAdapter";
import { LoggerPinoConfig, PinoElasticSearchConfig } from "./PinoConfig";
import { defaultTransporter } from "./defaultTransporter";
const defaultConfig: PinoElasticSearchConfig = {
	CONSISTENCY: "one",
	INDEX: "service.logs",
	level: LogLevel.info,
	SERVER_ADDRESS: "",
};

export const PinoElasticSearchAdapterBuilder = (
	configuration?: PinoElasticSearchConfig
): ILoggerAdapter => {
	const prettyStream = defaultTransporter();
	const streams = [{ stream: prettyStream }];
	const config = Object.assign<
		Partial<PinoElasticSearchConfig>,
		PinoElasticSearchConfig | undefined,
		PinoElasticSearchConfig
	>({}, configuration, defaultConfig);
	if (configuration) {
		const streamToElastic = pinoElastic({
			index: config.INDEX,
			consistency: config.CONSISTENCY,
			node: config.SERVER_ADDRESS,
			"es-version": 7,
			"flush-bytes": 1000,
			"flush-interval": 5000,
		});
		streamToElastic.on("insertError", (error) => {
			const documentThatFailed = error.document;
			console.log(`An error occurred insert document:`, documentThatFailed);
		});
		streamToElastic.on("error", (error) => {
			console.error("Elasticsearch client error:", error);
		});
		streamToElastic.on("unknown", (error) => {
			console.error("Elasticsearch client error:", error);
		});
		streamToElastic.on("insert", (stats: Record<string, any>) => {
			console.error("Elasticsearch client error:", stats);
		});
		streams.push({ stream: streamToElastic });
	}
	const logger = pino(config, pino.multistream(streams));
	return new PinoAdapter(logger);
};

export const PinoAdapterBuilder = (
	configuration?: LoggerPinoConfig
): ILoggerAdapter => {
	const prettyStream = defaultTransporter();
	const pinoConfig = Object.assign(
		{
			level: LogLevel.info,
			pretty: false,
			timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
		},
		configuration
	);

	const logger = pinoConfig.pretty
		? pino(pinoConfig, prettyStream)
		: pino(pinoConfig);
	return new PinoAdapter(logger);
};
