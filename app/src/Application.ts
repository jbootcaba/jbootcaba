import compression from "compression";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { Container } from "inversify";
import hpropagate from "hpropagate";
import {
	logMiddleware,
	notFoundHandler,
	unhandledError,
	createContextMiddleware,
	HttpServer,
} from "@jbootcaba/express";
import { Express } from "express";
import { LoggerFactory } from "jbootcaba";
import { RegisterDocs } from "./docs";
import { TYPES } from "./utils/TYPES";
import { RegisterRoutes } from "./routes/routes";
import { Configuration } from "./configs/Configuration";
import "./controllers";
import { GraphQlRegister } from "./utils/graphql/RegisterGraphql";
import {
	createRateLimiter,
	ContextFiller,
	CorrelationId,
	createExpressMetrics,
	createHelmet,
} from "./utils/middlewares";

/**
 * Build express application with all required middlewares and graphql server bindings
 * @param container
 */
export const BuildApplication = async (
	container: Container
): Promise<Express> => {
	const config = container.get<Configuration>(TYPES.Configuration);
	const logger = container.get<LoggerFactory>(TYPES.LoggerFactory)("EXPRESS");

	logger.info("Starting application...");
	hpropagate({
		setAndPropagateCorrelationId: false,
		headersToPropagate: ["cache-control"],
	});
	const application = express();
	application
		.use(logMiddleware(logger))
		.use(createHelmet(config))
		.use(<any>createRateLimiter(config))
		.use(compression())
		.use(cors())
		.use(bodyParser.urlencoded({ extended: true }))
		.use(bodyParser.json())
		.use(<any>createContextMiddleware(ContextFiller))
		.use(<any>CorrelationId);

	RegisterDocs(application);
	RegisterRoutes(application);
	await GraphQlRegister.Build(container).For(application).Register();
	application.use(notFoundHandler).use(unhandledError(logger));
	return application;
};

export const RunApplication = async (container: Container): Promise<void> => {
	const logger = container.get<LoggerFactory>(TYPES.LoggerFactory)("EXPRESS");
	const config = container.get<Configuration>(TYPES.Configuration);
	const application = await BuildApplication(container);
	await HttpServer(
		config.SERVER_PORT,
		config.MANAGEMENT_PORT,
		logger,
		application
	);
};
