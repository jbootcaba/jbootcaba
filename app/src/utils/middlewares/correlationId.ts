import opentelemetryApi from "@opentelemetry/api";
import { Request, Response, NextFunction } from "express";

export function CorrelationId(
	response: Request,
	_request: Response,
	next: NextFunction
): void {
	const activeCtx = opentelemetryApi.context.active();
	const span = opentelemetryApi.trace.getSpan(activeCtx);
	const traceId = span?.spanContext().traceId;
	response.headers["X-Correlation-Id"] = traceId;
	next();
}
