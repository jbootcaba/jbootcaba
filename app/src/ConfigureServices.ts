import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import { Configuration } from "./configs/Configuration";
import { TYPES } from "./utils/TYPES";
import { registerTracer } from "./utils/tracer/tracer";
import { ApiContainerModule } from "@jbootcaba/helpers";

export const ConfigureServices = async (
	container: Container
): Promise<void> => {
	const config = container.get<Configuration>(TYPES.Configuration);

	registerTracer(config);
	decorate(injectable(), Controller); // Makes tsoa's Controller injectable
	// container
	// 	.bind<ICacheProvider>(ServicesTokens.Cache)
	// 	.toConstantValue(new InMemoryCacheProvider());
	container.load(buildProviderModule());
	await container.loadAsync(
		ApiContainerModule({
			identifier: TYPES.CHARACTERS_API,
			endpoint: `${config.API_GATEWAY_URL}/character-service`,
		})
	);
};
