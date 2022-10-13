import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
	getNodeAutoInstrumentations,
	InstrumentationConfigMap,
} from "@opentelemetry/auto-instrumentations-node";
import { IncomingMessage, ClientRequest } from "http";
export const provider = new NodeTracerProvider();

const _ignoredIncomingPaths: string[] = ["/health", "/ready", "/live"];
const _ignoredOutgoingPaths: string[] = ["/v1/metrics"];
export const addIgnoredIncomingRequests = (...endpoints: string[]) =>
	_ignoredIncomingPaths.push(...endpoints);
export const addIgnoredOutgoingRequests = (...endpoints: string[]) =>
	_ignoredOutgoingPaths.push(...endpoints);

const pino: InstrumentationConfigMap = {
	"@opentelemetry/instrumentation-pino": {
		logHook: (_span, record) => {
			record[SemanticResourceAttributes.SERVICE_NAME] =
				provider.resource.attributes[SemanticResourceAttributes.SERVICE_NAME];
		},
	},
};

const express: InstrumentationConfigMap = {
	"@opentelemetry/instrumentation-express": {
		enabled: false,
		ignoreLayersType: [
			ExpressLayerType.MIDDLEWARE,
			ExpressLayerType.REQUEST_HANDLER,
		],
	},
};

const http: InstrumentationConfigMap = {
	"@opentelemetry/instrumentation-http": {
		ignoreIncomingRequestHook: (req) =>
			_ignoredIncomingPaths.some((it) => req.url?.includes(it)),
		ignoreOutgoingRequestHook: (req) =>
			_ignoredOutgoingPaths.some(
				(it) => req.path?.includes(it) || req.hostname?.includes(it)
			),
		applyCustomAttributesOnSpan: (
			span,
			request: IncomingMessage | ClientRequest
		) => {
			let header: string | undefined | string[] | number;
			if ("headers" in request) header = request.headers["device-id"];
			if ("getHeaders" in request) header = request.getHeaders()["device-id"];
			if (header) {
				span.setAttribute("deviceId", header);
			}
		},
	},
};

registerInstrumentations({
	tracerProvider: provider,
	instrumentations: [
		getNodeAutoInstrumentations({ ...pino, ...express, ...http }),
	],
});
