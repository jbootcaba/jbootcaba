import swaggerUi from "swagger-ui-express";
import { Express } from "express-serve-static-core";
import { Request, Response } from "express";

export const RegisterDocs = (application: Express) => {
	application.use(
		"/docs",
		swaggerUi.serve,
		async (_req: Request, res: Response) => {
			var options = {
				explorer: true,
				swaggerOptions: {
					bearer_token: {
						value: "Bearer <token>",
					},
				},
			};
			return res.send(
				swaggerUi.generateHTML(await import("./swagger.json"), options)
			);
		}
	);
};
