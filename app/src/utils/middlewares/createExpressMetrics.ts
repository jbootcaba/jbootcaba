import { Configuration } from "../../configs/Configuration";
import { expressMetrics } from "@jbootcaba/express";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";

export const createExpressMetrics = (config: Configuration) => {
	const metricExporter = new OTLPMetricExporter({
		url: config.OTEL_COLLECTOR_METRICS,
		concurrencyLimit: 10, // an optional limit on pending requests
		hostname: config.SERVICE_NAME,
		compression: CompressionAlgorithm.GZIP,
	});
	return expressMetrics({
		EXPORTER: metricExporter,
		SERVICE_NAME: config.SERVICE_NAME,
	});
};
