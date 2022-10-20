import { IContextManager } from "@jbootcaba/context";
export declare type ContextFiller<Request, Response> = (context: IContextManager, request: Request, response: Response) => void;
export declare const createContextMiddleware: <Request_1, Response_1>(filler: ContextFiller<Request_1, Response_1>) => (request: Request_1, response: Response_1, next: () => void) => void;
//# sourceMappingURL=createContextMiddleware.d.ts.map