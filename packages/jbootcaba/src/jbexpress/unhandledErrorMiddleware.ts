import { ILogger } from "@jbootcaba/core";
import { NextFunction, Response, Request } from "express";

export const unhandledError =
	(logger: ILogger) =>
	(
		err: any,
		req: Request,
		res: Response,
		next: NextFunction
	): Response | void => {
		if (err instanceof Error) {
			logger.error("%s %s", err.message, err.stack);
			return res.status(500).json({
				message: "Internal Server Error",
			});
		}
		if (err?.status === 401) {
			return res.status(err.status).json(err);
		}
		next();
	};

export const notFoundHandler = (_req: Request, res: Response) => {
	res.status(404).send({
		message: "Not Found",
	});
};
