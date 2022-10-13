import { ILogger } from "@jbootcaba/core";
import * as http from "http";
import { createHttpTerminator } from "http-terminator";
import { createLightship } from "lightship";

export const HttpServer = async (
	port: number,
	managementPort: number,
	logger: ILogger,
	application: http.RequestListener
): Promise<http.Server> => {
	logger.info("Starting HTTP server");
	const server = http.createServer(application);
	const lightship = await createLightship({
		port: managementPort,
		signals: ["SIGINT", "SIGTERM"],
	});

	const httpTerminator = createHttpTerminator({
		server,
		gracefulTerminationTimeout: 10,
	});
	lightship.registerShutdownHandler(async () => {
		logger.info(`Server is shot down in ${port} `);
		await httpTerminator.terminate();
	});
	server
		.listen(port, () => {
			lightship.signalReady();
			logger.info(`Server started in ${port}`);
		})
		.on("error", async (error: Error) => {
			logger.error(error);
			await lightship.shutdown();
		});
	return server;
};
