import { ILogger } from "@jbootcaba/core";
import { NextFunction, Response, Request } from "express";
export declare const unhandledError: (logger: ILogger) => (err: any, req: Request, res: Response, next: NextFunction) => Response | void;
export declare const notFoundHandler: (_req: Request, res: Response) => void;
//# sourceMappingURL=unhandledErrorMiddleware.d.ts.map