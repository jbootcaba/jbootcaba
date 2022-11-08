import { ContextManager, IContextManager } from "@jbootcaba/context";
export type ContextFiller<Request, Response> = (
	context: IContextManager,
	request: Request,
	response: Response
) => void;
export const createContextMiddleware = <Request, Response>(
	filler: ContextFiller<Request, Response>
) => {
	ContextManager.Init();
	return (request: Request, response: Response, next: () => void) => {
		ContextManager.Context.run(() => {
			filler(ContextManager.Context, request, response);
			next();
		});
	};
};
