import { buildSchema } from "type-graphql";
import { Container } from "inversify";
import { Express } from "express";
import depthLimit from "graphql-depth-limit";
import playground from "graphql-playground-middleware-express";
import { Resolvers } from "@schema/Resolvers";
import { UseAuthChecker } from "./UseAuthChecker";
import { Configuration } from "../../configuration";
import { TYPES } from "jbootcaba/inversify";
import { NodeEnv } from "jbootcaba/config";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { useMetrics } from "./UseMetrics";
import { AuthService } from "../../services/AuthService";
export class GraphQlRegister {
	private app: Express;
	private endpoint = "/graphql";
	private config: Configuration;
	constructor(private container: Container) {
		this.config = container.get<Configuration>(TYPES.Configuration);
	}

	static Build(container: Container): GraphQlRegister {
		return new GraphQlRegister(container);
	}

	For(app: Express): GraphQlRegister {
		this.app = app;
		return this;
	}

	private CreateSchema(): Promise<GraphQLSchema> {
		return buildSchema({
			resolvers: Resolvers,
			authChecker: UseAuthChecker(this.container.get<AuthService>(AuthService)),
			container: (() => this.container).bind(this),
			emitSchemaFile: true,
			dateScalarMode: "isoDate", // "timestamp" or "isoDate"
		});
	}

	private RegisterPlayground() {
		if (this.config.NODE_ENV != NodeEnv.PRODUCTION)
			this.app.get(
				"/playground",
				playground({
					endpoint: this.endpoint,
					settings: { "editor.theme": "dark", "schema.polling.enable": false },
				})
			);
	}
	private async CreateApoloServer(
		schema: GraphQLSchema
	): Promise<ApolloServer<ExpressContext>> {
		const server = new ApolloServer({
			schema,
			csrfPrevention: true,
			context: ({ req }) => req,
			validationRules: [depthLimit(7)],
			introspection: true,
			plugins: [useMetrics(this.config)],
			formatError: (err) => {
				// Don't give the specific errors to the client.
				if (err.extensions?.exception?.name === "AxiosError") {
					delete err.extensions?.exception?.request;
					delete err.extensions?.exception?.config;
				}
				return err;
			},
		});
		await server.start();
		return server;
	}

	async Register() {
		this.RegisterPlayground();
		const schema = await this.CreateSchema();
		const server = await this.CreateApoloServer(schema);
		server.applyMiddleware({ app: this.app, path: this.endpoint });
	}
}
