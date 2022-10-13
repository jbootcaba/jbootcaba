import { Request } from "express";
import morgan, { StreamOptions } from "morgan";
import { ILogger } from "@jbootcaba/core";

export const logMiddleware = (logger: ILogger) => {
	const stream: StreamOptions = {
		write: (message) => {
			logger.info(message);
		},
	};
	morgan.token("path", function getMethodToken(req: Request) {
		return req.route?.path || req.url;
	});
	return morgan(
		'End request :remote-addr ":method :path HTTP/:http-version" :status :res[content-length] :total-time ms',
		{
			stream,
		}
	);
};
