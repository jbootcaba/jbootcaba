import { trace, Tracer } from "@opentelemetry/api";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Configuration } from "../../configuration";
import { addIgnoredOutgoingRequests, provider } from "./instrumentation";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
// Setting the default Global logger to use the Console
// And optionally change the logging level (Defaults to INFO)
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

export const registerTracer = (config: Configuration): NodeTracerProvider => {
	provider.resource.attributes[SemanticResourceAttributes.SERVICE_NAME] =
		config.SERVICE_NAME;
	const url = new URL(config.OTEL_COLLECTOR_TRACES);
	addIgnoredOutgoingRequests(url.hostname);
	const collectorOptions = {
		url: url.toString(),
		concurrencyLimit: 10, // an optional limit on pending requests
		hostname: config.SERVICE_NAME,
		compression: CompressionAlgorithm.GZIP,
	};
	const exporter = new OTLPTraceExporter(collectorOptions);
	provider.addSpanProcessor(new BatchSpanProcessor(exporter));
	provider.register();
	return provider;
};

export const getTracer = (name: string): Tracer => {
	return trace.getTracer(name);
};
