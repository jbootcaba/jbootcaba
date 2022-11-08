import { ContextManager, IContextManager } from "jbootcaba/context";
import { Request, Response } from "express";

export const cacheKey = "cache-control";
export const keys = {
	userIp: "device-ip",
	deviceId: "device-id",
	userAgent: "user-agent",
};

export const ignoreCache = () => ContextManager.Context.get(cacheKey) === true;

export const ContextFiller = (
	context: IContextManager,
	request: Request,
	_response: Response
) => {
	const isNoCache =
		request.headers["cache-control"]?.toLocaleLowerCase() === "no-cache";
	context.set(cacheKey, isNoCache);
	const ip =
		request.headers["X-Real-Ip"] ??
		request.headers["X-Forwarded-For"] ??
		"0.0.0.0";
	context.set(keys.userIp, ip);
	const userAgent = request.headers["user-agent"] ?? "none";
	context.set(keys.userAgent, userAgent);
};
