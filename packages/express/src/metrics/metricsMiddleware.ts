import { MetricsConfiguration, registerMetrics } from "./metrics";
import ResponseTime from "response-time";
import { Request, Response } from "express";

export const expressMetrics = (config: MetricsConfiguration) => {
	const metricCollector = registerMetrics(config);
	return ResponseTime((request: Request, response: Response, time: number) => {
		const attributes = {
			status: response.statusCode,
			path: request.route?.path,
		};
		metricCollector.record(response.statusCode, time, attributes);
	});
};
