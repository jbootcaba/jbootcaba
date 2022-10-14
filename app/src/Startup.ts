import "reflect-metadata";
import "@utils/tracer/instrumentation";
import { Configuration, ConfigurationSchema } from "./configs/Configuration";
import { StartupBuilder } from "@jbootcaba/seed/inversify";
import { RunApplication } from "./Application";
import { PinoAdapterBuilder } from "@jbootcaba/logger-pino";
import { context, isSpanContextValid, trace } from "@opentelemetry/api";
import "./services/AuthService";
import { ConfigureServices } from "./ConfigureServices";

const injectTrace = () => {
	const record = {};
	const span = trace.getSpan(context.active());
	const spanContext = span?.spanContext();
	if (spanContext && isSpanContextValid(spanContext)) {
		Object.assign(record, {
			trace_id: spanContext.traceId,
			span_id: spanContext.spanId,
			trace_flags: `0${spanContext.traceFlags.toString(16)}`,
		});
	}
	return record;
};

StartupBuilder.Given<Configuration>(ConfigurationSchema, (config) =>
	PinoAdapterBuilder({
		pretty: true,
		level: config?.LOG_LEVEL,
		mixin: injectTrace,
	})
)
	.WithConfigureServices(ConfigureServices)
	.Run(RunApplication);