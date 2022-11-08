import { Attributes } from "@opentelemetry/api";
import {
	MeterProvider,
	PeriodicExportingMetricReader,
	PushMetricExporter,
} from "@opentelemetry/sdk-metrics-base";
import { Histogram } from "@opentelemetry/api-metrics";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
// import { HostMetrics } from "@opentelemetry/host-metrics";

export type ApdexConfiguration = {
	isFailureStatus: (status: number) => boolean;
	threshold: number;
};
export type MetricsConfiguration = {
	SERVICE_NAME: string;
	APDEX?: ApdexConfiguration;
	EXPORTER: PushMetricExporter;
};

const createProvider = (configuration: MetricsConfiguration) => {
	const serviceName = configuration.SERVICE_NAME;
	const meterProvider = new MeterProvider({
		resource: new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
		}),
	});

	meterProvider.addMetricReader(
		new PeriodicExportingMetricReader({
			exporter: configuration.EXPORTER,
			exportIntervalMillis: 1000,
		})
	);
	return meterProvider;
};

export class ExpressMetricsCollector {
	private requestDuration: Histogram;
	private toleratedValue: number;

	constructor(
		private config: {
			meterProvider: MeterProvider;
			name: string;
			apdex: ApdexConfiguration;
		}
	) {}

	start(): void {
		this.toleratedValue = this.config.apdex.threshold * 4;
		const meter = this.config.meterProvider.getMeter(this.config.name);

		this.requestDuration = meter.createHistogram("request_duration", {
			description: "Request duration 150, 200, 300",
		});
	}
	private calcApdex(statusCode: number, time: number) {
		const fail = this.config.apdex.isFailureStatus(statusCode);
		let level = "satisfied";
		level = fail || time > this.toleratedValue ? "frustrated" : level;
		level =
			!fail && time > this.config.apdex.threshold && time <= this.toleratedValue
				? "tolerated"
				: level;
		const apdexResult = time / this.config.apdex.threshold;
		return {
			value: apdexResult,
			level,
		};
	}

	record(statusCode: number, time: number, attributes: Attributes) {
		const apdex = this.calcApdex(statusCode, time);
		this.requestDuration.record(time, { apdex: apdex.level, ...attributes });
	}
}
const apdexConfigDefault: ApdexConfiguration = {
	isFailureStatus: (status: number) => status >= 500 || status == 408,
	threshold: 300,
};

const defaultConfig: Partial<MetricsConfiguration> = {
	SERVICE_NAME: "SERVICE",
};

export const registerMetrics = (configuration: MetricsConfiguration) => {
	const config: MetricsConfiguration = Object.assign(
		{},
		defaultConfig,
		configuration
	);
	const configApdex: ApdexConfiguration = Object.assign(
		{},
		apdexConfigDefault,
		configuration.APDEX
	);
	const serviceName = config.SERVICE_NAME;
	const meterProvider = createProvider(config);
	//opentelemetry.setGlobalMeterProvider(new MeterProvider());

	const httpMetrics = new ExpressMetricsCollector({
		meterProvider,
		name: serviceName,
		apdex: configApdex,
	});
	// const hostMetrics = new HostMetrics({
	// 	meterProvider,
	// 	name: serviceName,
	// });
	// hostMetrics.start();
	httpMetrics.start();
	return httpMetrics;
};
