import { Configuration } from "../../configuration";
import { registerMetrics } from "jbootcaba/express";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { GraphQLError } from "graphql";
import { Request } from "express";
import { GraphQLRequestContextWillSendResponse } from "apollo-server-types";
import { GraphQLRequestContext } from "apollo-server-types";
import { GraphQLRequestListener } from "apollo-server-plugin-base";

export const useMetrics = (config: Configuration) => {
	const metricExporter = new OTLPMetricExporter({
		url: config.OTEL_COLLECTOR_METRICS,
		concurrencyLimit: 10, // an optional limit on pending requests
		hostname: config.SERVICE_NAME,
		compression: CompressionAlgorithm.GZIP,
	});
	const metricCollector = registerMetrics({
		EXPORTER: metricExporter,
		SERVICE_NAME: config.SERVICE_NAME,
	});
	metricCollector.start();
	return {
		requestDidStart: (
			_requestContext: GraphQLRequestContext<Request>
		): Promise<GraphQLRequestListener<Request>> => {
			const start_time = process.hrtime.bigint();
			return Promise.resolve({
				willSendResponse: (
					request: GraphQLRequestContextWillSendResponse<Request>
				): Promise<void> => {
					const end_time = process.hrtime.bigint();
					const hasCriticalError = request.errors?.some(
						(err: GraphQLError) => err.name === "GraphQLError"
					);
					const diff = Number(end_time - start_time) * 1e-6; //Convert nano segundos para mili segundos
					const label = {
						status: hasCriticalError ? 200 : 500,
						operationName: request.operationName || "",
						hostname: process.env.HOSTNAME,
					};
					metricCollector.record(200, diff, label);
					return Promise.resolve();
				},
			});
		},
	};
};
