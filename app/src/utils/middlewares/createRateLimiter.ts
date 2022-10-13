import { Configuration } from "../../configs/Configuration";
import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { IncomingMessage, ServerResponse } from "http";
//import { RateLimiterRedis } from "rate-limiter-flexible";

export type NextHandleFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;
export const createRateLimiter = (
	config: Configuration
): NextHandleFunction => {
	const rateLimiter = new RateLimiterMemory({
		keyPrefix: "middleware",
		points: config.RATE_LIMITER_REQUEST, // 10 requests
		duration: config.RATE_LIMITER_INTERVAL_SECONDS, // per 1 second by IP
	});
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await rateLimiter.consume(req.ip);
			next();
		} catch {
			res.status(429).send("Too Many Requests");
		}
	};
};
